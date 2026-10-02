"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import AMLogo from "./AMLogo";
import MobileMenu from "./Mobile";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Projects", href: "/projects" },
  { title: "Blog", href: "/blog" },
  // { title: "Terminal", href: "/#terminal" },
  // { title: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header
      className="px-5 sm:px-8 lg:px-12 relative lg:fixed lg:top-0 lg:left-0 lg:right-0"
      style={{
        zIndex: 500,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: "calc(0.75rem + env(safe-area-inset-top))",
        paddingBottom: "0.75rem",
        background: "rgba(240,242,245,0.92)",
        backdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "3px solid #0D0F14",
        animation: "navIn .8s cubic-bezier(.16,1,.3,1) both",
      }}
    >
      {/* Logo */}
      <Link
        href="/"
        style={{
          color: "#E8192C",
          border: "3px solid #E8192C",
          padding: ".28rem .55rem",
          background: "#fff",
          position: "relative",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all .25s",
          cursor: "pointer",
        }}
        className="logo-am hover:bg-[#E8192C] hover:text-white"
      >
        <AMLogo size={24} />
      </Link>

      {/* Desktop Nav */}
      <nav className="hidden sm:block">
        <ul className="flex items-center gap-x-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                style={{
                  fontFamily: "var(--space-mono)",
                  fontSize: ".62rem",
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  color: "#4A5068",
                  position: "relative",
                  transition: "color .2s",
                }}
                className="nav-link hover:!text-[#E8192C]"
              >
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Status pill */}
      <div
        className="hidden sm:flex"
        style={{
          alignItems: "center",
          gap: ".6rem",
          fontFamily: "var(--space-mono)",
          fontSize: ".58rem",
          letterSpacing: ".15em",
          textTransform: "uppercase",
          color: "#8892AA",
          border: "2px solid #E4E7ED",
          padding: ".5rem 1rem",
        }}
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: "#22C55E",
            flexShrink: 0,
            animation: "livePulse 2s ease-in-out infinite",
          }}
        />
        Available · Remote
      </div>

        {/* Mobile menu */}
        <div className="sm:hidden">
          <MobileMenu />
        </div>

      <style>{`
        @keyframes navIn {
          from { transform: translateY(-100%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @keyframes livePulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,.5); }
          50%      { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
        }
        .logo-am::before {
          content: '';
          position: absolute;
          inset: 4px;
          border: 2.5px dotted rgba(232,25,44,0.45);
          pointer-events: none;
          transition: border-color .25s;
        }
        .logo-am:hover::before { border-color: rgba(255,255,255,0.35); }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0;
          width: 0; height: 2px;
          background: #E8192C;
          transition: width .3s;
        }
        .nav-link:hover::after { width: 100%; }
      `}</style>
    </header>
  );
}
