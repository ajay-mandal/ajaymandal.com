export default function Footer() {
  return (
    <footer
      className="flex flex-col items-center gap-3 px-4 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-8 sm:py-6 sm:text-left lg:px-14"
      style={{
        borderTop: "3px solid #0D0F14",
        fontSize: "clamp(0.55rem, 1.3vw, 0.62rem)",
        letterSpacing: "clamp(0.08em, 0.5vw, 0.14em)",
        textTransform: "uppercase" as const,
        color: "#8892AA",
        background: "#FFFFFF",
        fontFamily: "var(--space-mono)",
        lineHeight: "1.6",
      }}
    >
      <span className="whitespace-nowrap">
        &copy; {new Date().getFullYear()}{" "}
        <strong style={{ color: "#E8192C", fontWeight: 400 }}>Ajay Mandal</strong>
      </span>
      <span className="whitespace-nowrap">
        Made with <strong style={{ color: "#E8192C", fontWeight: 400 }}>&hearts;</strong> in Nepal
      </span>
      <span className="whitespace-nowrap">
        Built with{" "}
        <strong style={{ color: "#E8192C", fontWeight: 400 }}>Next.js {String(16)}</strong>
      </span>
    </footer>
  );
}
