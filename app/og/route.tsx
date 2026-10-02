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
          background: "#F0F2F5",
          padding: 40,
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#FFFFFF",
            border: "6px solid #0D0F14",
            boxShadow: "16px 16px 0 #E8192C",
            padding: "56px 64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                color: "#E8192C",
                border: "4px solid #E8192C",
                padding: "4px 14px",
                fontSize: 34,
                fontWeight: 800,
                letterSpacing: 2,
              }}
            >
              AM
            </div>
            <div style={{ display: "flex", width: 64, height: 4, background: "#E8192C" }} />
            <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, color: "#4A5068", textTransform: "uppercase" }}>
              ajaymandal.com
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                display: "flex",
                fontSize: titleSize,
                fontWeight: 800,
                lineHeight: 1.08,
                color: "#0D0F14",
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div style={{ display: "flex", fontSize: 30, color: "#4A5068" }}>{subtitle}</div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", fontSize: 24, color: "#8892AA", letterSpacing: 4, textTransform: "uppercase" }}>
              Ajay Mandal · Engineer
            </div>
            <div style={{ display: "flex", width: 120, height: 14, background: "#E8192C" }} />
          </div>
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
