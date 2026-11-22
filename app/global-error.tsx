"use client";

// Replaces the root layout when it fails, so it can't rely on globals.css or fonts.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#faf8fa",
          color: "#1e1822",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <main style={{ maxWidth: "46rem", margin: "0 auto", padding: "96px 24px" }}>
          <p style={{ margin: "0 0 12px", fontFamily: "ui-monospace, monospace", fontSize: 12.5, color: "#6a6170" }}>
            error{error.digest ? ` · ${error.digest}` : ""}
          </p>
          <h1 style={{ margin: "0 0 16px", fontSize: 40, fontWeight: 600, letterSpacing: "-0.02em" }}>
            Something broke
          </h1>
          <p style={{ margin: "0 0 28px", fontSize: 19, lineHeight: 1.6, color: "#5e5563" }}>
            The site failed to load. Trying again usually works.
          </p>
          <p style={{ display: "flex", gap: 20, fontFamily: "system-ui, sans-serif", fontSize: 14 }}>
            <button
              type="button"
              onClick={reset}
              style={{ background: "none", border: 0, padding: 0, color: "#6a3d7c", font: "inherit", fontWeight: 500, cursor: "pointer" }}
            >
              try again
            </button>
            <a href="/" style={{ color: "#6a6170" }}>
              ← back to writing
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
