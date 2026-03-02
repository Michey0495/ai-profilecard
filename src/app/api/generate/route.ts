import { NextRequest, NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { generateProfileCard } from "@/lib/generate";

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

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "不正なリクエストです。" },
        { status: 400 }
      );
    }
    const { name, interests, personality, style } = body;

    const validStyles = ["cool", "cute", "dark", "creative"];
    const safeStyle = validStyles.includes(style) ? style : "cool";

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

    const result = await generateProfileCard({
      name,
      interests,
      personality,
      style: safeStyle,
    });

    return NextResponse.json({ id: result.id });
  } catch (error) {
    console.error("Generate API error:", error);
    return NextResponse.json(
      { error: "カードの生成中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
