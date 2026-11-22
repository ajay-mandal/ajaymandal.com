"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <section style={{ paddingBottom: 24 }}>
      <p className="mono meta" style={{ margin: "0 0 12px", fontSize: 12.5 }}>
        error{error.digest ? ` · ${error.digest}` : ""}
      </p>
      <h1 className="page-title">Something broke</h1>
      <p className="page-lede" style={{ marginBottom: 28 }}>
        This page hit an error while loading. Trying again usually works.
      </p>
      <p style={{ display: "flex", gap: 20, fontSize: 14 }}>
        <button type="button" className="link-accent" onClick={reset} style={{ background: "none", border: 0, padding: 0, cursor: "pointer", font: "inherit" }}>
          try again
        </button>
        <Link className="meta" href="/">
          ← back to writing
        </Link>
      </p>
    </section>
  );
}
