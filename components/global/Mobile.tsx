"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { RxHamburgerMenu } from "react-icons/rx";
import { HiOutlineX } from "react-icons/hi";

const NAV_LINKS = [
  { title: "Home", href: "/" },
  { title: "About", href: "/about" },
  { title: "Projects", href: "/projects" },
  { title: "Blog", href: "/blog" },
];

export default function MobileMenu() {
  const [navShow, setNavShow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const onToggleNav = () => {
    setNavShow((status) => {
      document.body.style.overflow = status ? "auto" : "hidden";
      return !status;
    });
  };

  const modalContent = (
    <div
      className="sm:hidden"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        pointerEvents: navShow ? 'auto' : 'none',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onToggleNav}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          zIndex: 1001,
          opacity: navShow ? 1 : 0,
          transition: 'opacity 500ms',
        }}
      />

      {/* Drawer */}
      <div
        className={`mobile-menu flex flex-col bg-[#F0F2F5] border-l-[3px] border-[#0D0F14] transform transition-all duration-500 ease-out ${
          navShow ? "translate-x-0 scale-100 opacity-100" : "translate-x-full scale-95 opacity-0"
        }`}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '100%',

          zIndex: 1002,
          paddingTop: "calc(1rem + env(safe-area-inset-top))",
          paddingBottom: "calc(1rem + env(safe-area-inset-bottom))",
          transformOrigin: 'top right',
        }}
      >
          {/* Red accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#E8192C]" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4">
            <Link href="/" onClick={onToggleNav} className="flex items-center gap-3">
              <div className="border-[3px] border-[#0D0F14] bg-white p-1.5 shadow-[3px_3px_0_#E8192C]">
                <Image src="/logo.svg" alt="AM" width={24} height={24} />
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "var(--oxanium)",
                    fontWeight: 800,
                    fontSize: "1rem",
                    lineHeight: 1.1,
                  }}
                >
                  Ajay Mandal
                </div>
                <div
                  style={{
                    fontFamily: "var(--space-mono)",
                    fontSize: ".5rem",
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                    color: "#E8192C",
                  }}
                >
                  Backend Eng
                </div>
              </div>
            </Link>
            <button
              aria-label="Close Menu"
              onClick={onToggleNav}
              className="border-[3px] border-[#0D0F14] bg-white p-2 shadow-[3px_3px_0_#0D0F14] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all duration-200"
            >
              <HiOutlineX className="text-xl text-[#0D0F14]" />
            </button>
          </div>

          {/* Divider */}
          <div className="mx-6 h-[3px] bg-[#0D0F14]" />

          {/* Navigation */}
          <nav className="flex flex-col gap-2 py-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.title}
                  href={link.href}
                  onClick={onToggleNav}
                  className={`group flex items-center justify-between px-6 py-4 border-y-[3px] border-[#0D0F14] transition-all ${
                    isActive
                      ? "bg-[#E8192C] text-white"
                      : "bg-white text-[#1A1D24] hover:bg-[#0D0F14] hover:text-white"
                  }`}
                  style={{ fontFamily: "var(--oxanium)", fontWeight: 700, fontSize: "1rem" }}
                >
                  <span>{link.title}</span>
                  <span
                    className={`transition-all ${
                      isActive
                        ? "text-white"
                        : "text-white opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    →
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Footer - Status Badge */}
          <div className="mt-auto px-6 pb-4">
            <div className="border-[3px] border-[#0D0F14] bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-[#22C55E] animate-pulse" />
                <span
                  style={{
                    fontFamily: "var(--space-mono)",
                    fontSize: ".52rem",
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "#22C55E",
                  }}
                >
                  Available
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--space-mono)",
                  fontSize: ".5rem",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "#8892AA",
                }}
              >
                Open to freelance &amp; full-time
              </div>
            </div>
          </div>
        </div>
    </div>
  );

  return (
    <>
      {/* Hamburger button */}
      <button
        aria-label="Toggle Menu"
        onClick={onToggleNav}
        className="sm:hidden border-[3px] border-[#0D0F14] bg-white p-2 shadow-[3px_3px_0_#0D0F14] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all duration-200"
      >
        <RxHamburgerMenu className="text-xl text-[#0D0F14]" />
      </button>
      
      {/* Portal overlay to body */}
      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
