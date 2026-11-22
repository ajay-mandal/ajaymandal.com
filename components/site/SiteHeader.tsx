"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "writing", match: (p: string) => p === "/" || p.startsWith("/blog") },
  { href: "/projects", label: "projects", match: (p: string) => p.startsWith("/projects") },
  { href: "/life", label: "life so far", match: (p: string) => p.startsWith("/life") },
  { href: "/about", label: "about", match: (p: string) => p.startsWith("/about") },
];

export default function SiteHeader() {
  const pathname = usePathname() ?? "/";
  return (
    <header className="site-head">
      <Link href="/" className="brand" aria-label="Ajay Mandal, home">
        <span className="brand-mark" aria-hidden="true">
          a<span>.</span>
        </span>
        <span className="brand-text">
          <span className="brand-name">
            ajay<span>/</span>mandal
          </span>
          <span className="brand-tag">backend engineer</span>
        </span>
      </Link>
      <nav className="site-nav" aria-label="Main">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={item.match(pathname) ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
