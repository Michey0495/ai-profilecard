import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";
import type { ProfileInput, ProfileResult } from "@/types";

const RATE_LIMIT = 10;
const RATE_WINDOW = 600;

async function checkRateLimit(ip: string): Promise<boolean> {
  const key = `rate:profilecard:${ip}`;
  const count = (await kv.get<number>(key)) ?? 0;
  if (count >= RATE_LIMIT) return false;
  await kv.set(key, count + 1, { ex: RATE_WINDOW });
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";

    const allowed = await checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: "利用回数の上限に達しました。10分後に再度お試しください。" },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, interests, personality, style } = body;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "名前を入力してください。" },
        { status: 400 }
      );
    }
    if (!interests?.trim()) {
      return NextResponse.json(
        { error: "趣味・興味を入力してください。" },
        { status: 400 }
      );
    }

    const input: ProfileInput = {
      name: String(name).slice(0, 50),
      interests: String(interests).slice(0, 300),
      personality: String(personality ?? "").slice(0, 200),
      style: String(style ?? "cool").slice(0, 20),
    };

    const anthropic = new Anthropic();

    const prompt = `あなたはプロフィールカードデザイナーです。ユーザーの情報からオシャレな自己紹介カードの内容を生成してください。

【ユーザー情報】
- 名前: ${input.name}
- 趣味・興味: ${input.interests}
${input.personality ? `- 性格・特徴: ${input.personality}` : ""}
- カードの雰囲気: ${input.style}

以下のJSON形式で回答してください。日本語で回答。絵文字は使わないでください。

{
  "title": "その人を一言で表すキャッチーな二つ名（5-15文字、例: 深夜のコード職人）",
  "catchcopy": "カッコいいor可愛いキャッチコピー（15-30文字）",
  "type": "性格タイプ名（例: 探究者タイプ、自由人タイプ、クリエイタータイプなど）",
  "description": "その人の魅力を伝える紹介文（50-80文字）",
  "stats": [
    {"label": "能力名1", "value": 数値(50-99)},
    {"label": "能力名2", "value": 数値(50-99)},
    {"label": "能力名3", "value": 数値(50-99)},
    {"label": "能力名4", "value": 数値(50-99)},
    {"label": "能力名5", "value": 数値(50-99)}
  ],
  "hashtags": ["ハッシュタグ1", "ハッシュタグ2", "ハッシュタグ3"]
}

重要:
- JSONのみを出力してください。前後に説明文やマークダウンは不要です
- statsの能力名はその人の趣味・性格に合ったユニークなものにしてください（例: コード力、審美眼、冒険心）
- statsのvalueは50-99の範囲で、高すぎず適度にバラつきを持たせてください
- titleは印象的で個性的なものにしてください
- ハッシュタグは3つ、日本語で`;

    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response");
      }
    }

    const id = nanoid(10);
    const result: ProfileResult = {
      id,
      input,
      title: parsed.title ?? input.name,
      catchcopy: parsed.catchcopy ?? "",
      type: parsed.type ?? "不明タイプ",
      description: parsed.description ?? "",
      stats: (parsed.stats ?? []).slice(0, 5).map((s: { label: string; value: number }) => ({
        label: String(s.label).slice(0, 20),
        value: Math.min(99, Math.max(50, Number(s.value) || 70)),
      })),
      hashtags: (parsed.hashtags ?? []).slice(0, 3).map((h: string) => String(h).slice(0, 30)),
      createdAt: new Date().toISOString(),
    };

    await kv.set(`profilecard:${id}`, result, { ex: 60 * 60 * 24 * 30 });

    return NextResponse.json({ id });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: "カードの生成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
