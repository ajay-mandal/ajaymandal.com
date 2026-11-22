import Link from "next/link";

export default function NotFound() {
  return (
    <section style={{ paddingBottom: 24 }}>
      <p className="mono meta" style={{ margin: "0 0 12px", fontSize: 12.5 }}>
        404
      </p>
      <h1 className="page-title">Nothing here</h1>
      <p className="page-lede" style={{ marginBottom: 28 }}>
        The page you&apos;re looking for doesn&apos;t exist, or it moved.
      </p>
      <Link className="link-accent" href="/">
        ← back to writing
      </Link>
    </section>
  );
}
