import { ImageResponse } from "next/og";

/**
 * Default 1200×630 share image: /og?title=...&subtitle=...
 * Used for pages and posts that have no cover image of their own.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") || "Ajay Mandal").slice(0, 120);
  const subtitle = (searchParams.get("subtitle") || "").slice(0, 80);
  const titleSize = title.length > 60 ? 56 : title.length > 30 ? 68 : 84;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAF9F6",
          padding: "72px 88px",
          color: "#1C1B19",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700, fontStyle: "italic", lineHeight: 1 }}>
            a<span style={{ color: "#B5473A", fontStyle: "normal" }}>.</span>
          </div>
          <div style={{ display: "flex", fontSize: 30, letterSpacing: -0.5 }}>
            ajay<span style={{ color: "#B5473A" }}>/</span>mandal
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", fontSize: titleSize, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1.5 }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ display: "flex", fontSize: 30, color: "#57544E" }}>{subtitle}</div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 28,
            borderTop: "2px solid #E6E2DA",
            fontSize: 24,
            color: "#6B6862",
          }}
        >
          <div style={{ display: "flex" }}>ajaymandal.com</div>
          <div style={{ display: "flex", width: 56, height: 6, borderRadius: 3, background: "#B5473A" }} />
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable" },
    },
  );
}
