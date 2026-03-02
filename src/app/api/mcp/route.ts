import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";
import type { ProfileResult } from "@/types";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ai-profilecard.ezoai.jp";

const TOOL_DEFINITION = {
  name: "generate_profile_card",
  description:
    "Generate an AI-powered profile card. Given a name and interests, creates a stylish self-introduction card with a catchy title, personality type, stats, and hashtags.",
  inputSchema: {
    type: "object" as const,
    properties: {
      name: {
        type: "string",
        description: "Name or nickname for the profile card",
      },
      interests: {
        type: "string",
        description: "Hobbies and interests (comma-separated)",
      },
      personality: {
        type: "string",
        description: "Personality traits (optional)",
      },
      style: {
        type: "string",
        description: "Card style: cool, cute, dark, or creative (optional, default: cool)",
      },
    },
    required: ["name", "interests"],
  },
};

export async function GET() {
  return NextResponse.json({
    name: "AIプロフカード MCP Server",
    version: "1.0.0",
    tools: [TOOL_DEFINITION],
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.method === "tools/list") {
      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: { tools: [TOOL_DEFINITION] },
      });
    }

    if (body.method === "tools/call") {
      const toolName = body.params?.name;
      if (toolName !== "generate_profile_card") {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: body.id,
          error: { code: -32601, message: `Tool not found: ${toolName}` },
        });
      }

      const args = body.params?.arguments ?? {};
      if (!args.name || !args.interests) {
        return NextResponse.json({
          jsonrpc: "2.0",
          id: body.id,
          error: { code: -32602, message: "name and interests are required" },
        });
      }

      const anthropic = new Anthropic();
      const prompt = `あなたはプロフィールカードデザイナーです。ユーザーの情報からオシャレな自己紹介カードの内容を生成してください。

【ユーザー情報】
- 名前: ${String(args.name).slice(0, 50)}
- 趣味・興味: ${String(args.interests).slice(0, 300)}
${args.personality ? `- 性格・特徴: ${String(args.personality).slice(0, 200)}` : ""}
- カードの雰囲気: ${String(args.style ?? "cool").slice(0, 20)}

以下のJSON形式で回答してください。日本語で回答。絵文字は使わないでください。

{
  "title": "その人を一言で表すキャッチーな二つ名（5-15文字）",
  "catchcopy": "カッコいいorかわいいキャッチコピー（15-30文字）",
  "type": "性格タイプ名",
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

JSONのみを出力してください。`;

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
        input: {
          name: String(args.name).slice(0, 50),
          interests: String(args.interests).slice(0, 300),
          personality: String(args.personality ?? "").slice(0, 200),
          style: String(args.style ?? "cool").slice(0, 20),
        },
        title: parsed.title ?? args.name,
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

      return NextResponse.json({
        jsonrpc: "2.0",
        id: body.id,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  title: result.title,
                  catchcopy: result.catchcopy,
                  type: result.type,
                  description: result.description,
                  stats: result.stats,
                  hashtags: result.hashtags,
                },
                null,
                2
              ),
            },
          ],
          meta: {
            resultId: id,
            resultUrl: `${siteUrl}/result/${id}`,
          },
        },
      });
    }

    return NextResponse.json({
      jsonrpc: "2.0",
      id: body.id ?? null,
      error: { code: -32601, message: "Method not found" },
    });
  } catch (error) {
    console.error("MCP error:", error);
    return NextResponse.json({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32000, message: "Server error" },
    });
  }
}
