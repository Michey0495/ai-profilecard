import { ImageResponse } from "next/og";
import { kv } from "@vercel/kv";
import type { ProfileResult } from "@/types";

export const runtime = "edge";
export const alt = "AIプロフカードの結果";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await kv.get<ProfileResult>(`profilecard:${id}`);

  if (!result) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#000",
            color: "#fff",
            fontSize: 48,
            fontWeight: 900,
          }}
        >
          AIプロフカード
        </div>
      ),
      { ...size }
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#000",
          color: "#fff",
          padding: 60,
          position: "relative",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ color: "#38bdf8", fontSize: 32, fontWeight: 900 }}>
              {"//"}
            </span>
            <span style={{ fontSize: 24, fontWeight: 700, color: "#fff" }}>
              AIプロフカード
            </span>
          </div>
          <span style={{ fontSize: 18, color: "rgba(255,255,255,0.4)" }}>
            ai-profilecard.ezoai.jp
          </span>
        </div>

        {/* Center content */}
        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "space-between",
            gap: 60,
          }}
        >
          {/* Left: name + title */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: 16,
                color: "#38bdf8",
                fontWeight: 700,
                letterSpacing: 2,
              }}
            >
              {result.type}
            </div>
            <div style={{ fontSize: 52, fontWeight: 900, color: "#fff" }}>
              {result.input.name.slice(0, 12)}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "#38bdf8",
              }}
            >
              {result.title.slice(0, 20)}
            </div>
            <div
              style={{
                fontSize: 20,
                color: "rgba(255,255,255,0.6)",
                marginTop: 8,
              }}
            >
              {result.catchcopy.slice(0, 40)}
            </div>
          </div>

          {/* Right: stats */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              width: 320,
            }}
          >
            {result.stats.slice(0, 5).map((stat, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    fontSize: 16,
                    color: "rgba(255,255,255,0.5)",
                    width: 80,
                  }}
                >
                  {stat.label.slice(0, 6)}
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    height: 12,
                    background: "rgba(255,255,255,0.1)",
                    borderRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${stat.value}%`,
                      height: "100%",
                      background: "#38bdf8",
                      borderRadius: 6,
                    }}
                  />
                </div>
                <div
                  style={{
                    fontSize: 16,
                    color: "#38bdf8",
                    fontWeight: 700,
                    width: 32,
                    textAlign: "right",
                  }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom hashtags */}
        <div
          style={{
            display: "flex",
            gap: 16,
            borderTop: "1px solid rgba(255,255,255,0.1)",
            paddingTop: 20,
          }}
        >
          {result.hashtags.map((tag, i) => (
            <div
              key={i}
              style={{
                fontSize: 16,
                color: "#38bdf8",
                background: "rgba(56,189,248,0.1)",
                padding: "4px 16px",
                borderRadius: 999,
              }}
            >
              #{tag}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
