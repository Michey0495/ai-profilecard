import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const type = String(body.type ?? "other").slice(0, 20);
    const message = String(body.message ?? "").slice(0, 1000);
    const repo = String(body.repo ?? "ai-profilecard").slice(0, 50);

    if (!message.trim()) {
      return NextResponse.json({ ok: false, error: "メッセージが空です" }, { status: 400 });
    }

    const labelMap: Record<string, string> = {
      bug: "bug",
      feature: "enhancement",
      other: "feedback",
    };

    const token = process.env.GITHUB_TOKEN;
    if (token) {
      await fetch(
        "https://api.github.com/repos/Michey0495/ai-profilecard/issues",
        {
          method: "POST",
          headers: {
            Authorization: `token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: `[${repo}] ${type}: ${message.slice(0, 60)}`,
            body: `**Type:** ${type}\n**Repo:** ${repo}\n\n${message}`,
            labels: [labelMap[type] ?? "feedback"],
          }),
        }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
