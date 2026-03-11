import { NextRequest, NextResponse } from "next/server";
import { generateProfileCard } from "@/lib/generate";

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

      const result = await generateProfileCard({
        name: args.name,
        interests: args.interests,
        personality: args.personality,
        style: args.style,
      });

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
            resultId: result.id,
            resultUrl: `${siteUrl}/result/${result.id}`,
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
