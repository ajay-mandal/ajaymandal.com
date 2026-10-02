"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

const HERO_LINES = [
  { type: "cmd",    text: "./status.sh",                             delay: 500  },
  { type: "out",    text: "uptime:        <b style='color:#FCD34D'>99.9%</b>",  delay: 800  },
  { type: "out",    text: "stack:         <b style='color:#FCD34D'>TypeScript · NestJS · Postgres · GCP</b>", delay: 1000 },
  { type: "out",    text: "current role:  <b style='color:#FCD34D'>Backend Engineer @ JUTEQ Inc</b>",        delay: 1200 },
  { type: "out",    text: "location:      <b style='color:#FCD34D'>Remote</b>",                        delay: 1400 },
  { type: "dim",    text: "<span style='color:rgba(255,255,255,.3)'>// all systems nominal ✓</span>",         delay: 1600 },
  { type: "prompt", text: "",                                         delay: 1900 },
];

export default function HeroSection() {
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = termRef.current;
    if (!el) return;
    el.innerHTML = "";
    HERO_LINES.forEach(({ type, text, delay }) => {
      setTimeout(() => {
        const d = document.createElement("div");
        d.style.marginBottom = ".15rem";
        if (type === "cmd") {
          d.innerHTML = `<span style="color:#E8192C">$</span> <span style="color:#E2E8F0">${text}</span>`;
        } else if (type === "prompt") {
          d.innerHTML = `<span style="color:#E8192C">$</span> <span class="tcursor"></span>`;
        } else {
          d.innerHTML = `<span style="color:#E2E8F0">${text}</span>`;
        }
        el.appendChild(d);
      }, delay);
    });
  }, []);

  return (
    <section
      className="lg:pt-28"
      style={{
        minHeight: "100vh",
        borderBottom: "3px solid #0D0F14",
        background: "#FFFFFF",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes g1 {
          0%   { transform: translate(-3px); opacity: .7; }
          50%  { transform: translate(3px);  opacity: .7; }
          100% { transform: translate(0);    opacity: 0;  }
        }
        @keyframes g2 {
          0%   { transform: translate(3px,1px);   opacity: .5; }
          50%  { transform: translate(-3px,-1px); opacity: .5; }
          100% { opacity: 0; }
        }
        .name-red {
          color: #E8192C;
          display: block;
          position: relative;
        }
        .name-red::before, .name-red::after {
          content: attr(data-t);
          position: absolute;
          top: 0; left: 0;
          opacity: 0;
          font-family: var(--oxanium);
          font-weight: 800;
        }
        .name-red:hover::before {
          animation: g1 .28s steps(2) forwards;
          color: #00F5D4;
          clip-path: polygon(0 25%, 100% 25%, 100% 55%, 0 55%);
        }
        .name-red:hover::after {
          animation: g2 .28s steps(2) forwards;
          color: #E8192C;
          clip-path: polygon(0 65%, 100% 65%, 100% 80%, 0 80%);
        }
        .btn-red {
          position: relative;
          overflow: hidden;
          transition: border-color .3s;
        }
        .btn-red::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 100%; height: 0;
          background: #0D0F14;
          transition: height .3s;
          z-index: 0;
        }
        .btn-red:hover { border-color: #0D0F14 !important; }
        .btn-red:hover::before { height: 100%; }
        .btn-red-text { position: relative; z-index: 1; }
        .btn-ghost {
          position: relative;
          overflow: hidden;
          transition: background .3s, color .3s, border-color .3s;
        }
        .btn-ghost::before {
          content: '';
          position: absolute;
          inset: 5px;
          border: 2.5px dotted rgba(255,255,255,0.25);
          opacity: 0;
          transition: opacity .3s;
          pointer-events: none;
        }
        .btn-ghost:hover { background: #0D0F14 !important; color: #fff !important; border-color: #0D0F14 !important; }
        .btn-ghost:hover::before { opacity: 1; }
        @keyframes rectPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(232,25,44,0.3); }
          50%      { box-shadow: 0 0 60px 22px rgba(232,25,44,0.1); }
        }
        @keyframes rotateDot {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes cf {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          33%     { transform: translate(5px,-5px) rotate(3deg); }
          66%     { transform: translate(-3px,4px) rotate(-2deg); }
        }
        @keyframes chipf {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-7px); }
        }
        .rect-main-inner {
          position: absolute; inset: 12px;
          border: 3px dotted rgba(255,255,255,0.55);
          animation: rotateDot 9s linear infinite;
          z-index: 2; pointer-events: none;
        }
        .hero-r-panel { display: flex; }
        @media (max-width: 960px) {
          .hero-r-panel { display: none !important; }
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* Animated grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(232,25,44,0.055) 1px,transparent 1px),linear-gradient(90deg,rgba(232,25,44,0.055) 1px,transparent 1px)",
          backgroundSize: "62px 62px",
          animation: "gridDrift 22s linear infinite",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      <div
        className="hero-grid gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:px-14 lg:gap-16"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1400,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 480px",
          alignItems: "center",
        }}
      >
        {/* ── LEFT ── */}
        <div>
          {/* Eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem", animation: "fadeUp .7s .2s both" }}>
            <div style={{ width: 36, height: 3, background: "#E8192C" }} />
            <span
              style={{
                fontFamily: "var(--space-mono)",
                fontSize: ".6rem",
                letterSpacing: ".28em",
                textTransform: "uppercase",
                color: "#E8192C",
              }}
            >
              Backend Systems Engineer
            </span>
          </div>

          {/* Name */}
          <h1
            style={{
              fontFamily: "var(--oxanium)",
              fontWeight: 900,
              fontSize: "clamp(2.8rem,9vw,6rem)",
              lineHeight: 0.98,
              letterSpacing: "-.01em",
              marginBottom: ".5rem",
              color: "#1A1D24",
              animation: "fadeUp .7s .4s both",
            }}
          >
            Ajay<br />
            <span className="name-red" data-t="Mandal">Mandal</span>
          </h1>

          {/* Role */}
          <p
            style={{
              fontFamily: "var(--oxanium)",
              fontWeight: 300,
              fontSize: "clamp(.85rem,1.4vw,1.1rem)",
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "#4A5068",
              marginBottom: "1.8rem",
              animation: "fadeUp .7s .6s both",
            }}
          >
            Backend <span style={{ color: "#E8192C" }}>/</span> Distributed Systems{" "}
            <span style={{ color: "#E8192C" }}>/</span> APIs
          </p>

          {/* Description */}
          <p
            style={{
              fontFamily: "var(--space-mono)",
              fontSize: ".69rem",
              lineHeight: 1.95,
              color: "#4A5068",
              maxWidth: 480,
              marginBottom: "2.5rem",
              animation: "fadeUp .7s .8s both",
            }}
          >
            Architecting high-performance distributed systems, microservices, 
            and APIs that scale to millions. Obsessed with reliability, latency, and elegant code.
          </p>

          {/* Actions */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem", animation: "fadeUp .7s 1s both" }}>
            <a
              href="#projects"
              style={{
                background: "#E8192C",
                color: "#fff",
                border: "3px solid #E8192C",
                padding: ".85rem 2rem",
                fontFamily: "var(--space-mono)",
                fontSize: ".62rem",
                letterSpacing: ".16em",
                textTransform: "uppercase",
                textDecoration: "none",
                cursor: "pointer",
                display: "inline-block",
              }}
              className="btn-red"
            >
              <span className="btn-red-text">View Projects →</span>
            </a>
            <a
              href="#contact"
              style={{
                background: "transparent",
                color: "#1A1D24",
                border: "3px solid #0D0F14",
                padding: ".85rem 2rem",
                fontFamily: "var(--space-mono)",
                fontSize: ".62rem",
                letterSpacing: ".16em",
                textTransform: "uppercase",
                textDecoration: "none",
                cursor: "pointer",
                display: "inline-block",
              }}
              className="btn-ghost"
            >
              Get In Touch
            </a>
          </div>

          {/* Hero terminal */}
          <div
            style={{
              border: "3px solid #0D0F14",
              background: "#1A1D24",
              animation: "fadeUp .7s 1.2s both",
            }}
          >
            <div
              style={{
                background: "#13151C",
                padding: ".55rem 1rem",
                display: "flex",
                alignItems: "center",
                gap: ".45rem",
                borderBottom: "2px solid rgba(255,255,255,.05)",
              }}
            >
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#FF5F57", display: "inline-block" }} />
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#FEBC2E", display: "inline-block" }} />
              <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#28C840", display: "inline-block" }} />
              <span
                style={{
                  fontFamily: "var(--space-mono)",
                  fontSize: ".55rem",
                  color: "rgba(255,255,255,.25)",
                  letterSpacing: ".1em",
                  marginLeft: ".4rem",
                }}
              >
                ajay@portfolio ~ system.status
              </span>
            </div>
            <div
              ref={termRef}
              style={{
                padding: "1.1rem 1.4rem",
                fontFamily: "var(--space-mono)",
                fontSize: ".64rem",
                lineHeight: 2,
                minHeight: 140,
              }}
            />
          </div>
        </div>

        {/* ── RIGHT: animated photo visual ── */}
        <div
          className="hero-r-panel"
          style={{
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* rect-visual wrapper */}
          <div style={{ position: "relative", width: "100%", aspectRatio: "1", maxWidth: 460 }}>

            {/* Floating corner rectangles */}
            <div style={{ position:"absolute", top:0, left:0, width:"28%", height:"28%", border:"3px dotted #E8192C", animation:"cf 6s ease-in-out infinite", zIndex:3 }} />
            <div style={{ position:"absolute", top:0, right:0, width:"20%", height:"20%", background:"rgba(232,25,44,.14)", border:"3px solid #0D0F14", animation:"cf 5s ease-in-out infinite 1s", zIndex:3 }} />
            <div style={{ position:"absolute", bottom:0, left:0, width:"16%", height:"16%", background:"rgba(232,25,44,.12)", border:"3px dashed #0D0F14", animation:"cf 7s ease-in-out infinite 2s", zIndex:3 }} />
            <div style={{ position:"absolute", bottom:0, right:0, width:"26%", height:"26%", border:"3px dotted #E8192C", animation:"cf 4s ease-in-out infinite 0.5s", zIndex:3 }} />

            {/* Main red rectangle with photo */}
            <div
              style={{
                position: "absolute",
                inset: "12%",
                background: "#E8192C",
                border: "3px solid #0D0F14",
                animation: "rectPulse 4s ease-in-out infinite",
                overflow: "hidden",
              }}
            >
              {/* Rotating dotted inner border */}
              <div className="rect-main-inner" />
              {/* Photo */}
              <Image
                src="/pp3.png"
                alt="Ajay Mandal"
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 768px) 200px, 300px"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
              {/* Gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 2,
                  pointerEvents: "none",
                  // background: "linear-gradient(180deg,rgba(232,25,44,0.12) 0%,transparent 35%,rgba(13,15,20,0.4) 100%)",
                }}
              />
            </div>

            {/* Floating chips */}
            <div
              style={{
                position: "absolute",
                top: "6%",
                left: "-8%",
                background: "#FFFFFF",
                border: "3px solid #0D0F14",
                padding: ".45rem .9rem",
                fontFamily: "var(--space-mono)",
                fontSize: ".52rem",
                letterSpacing: ".1em",
                boxShadow: "4px 4px 0 #0D0F14",
                zIndex: 10,
                whiteSpace: "nowrap",
                animation: "chipf 5s ease-in-out infinite",
              }}
            >
              UPTIME: <span style={{ color: "#E8192C", fontWeight: 700 }}>99.99%</span>
            </div>
            <div
              style={{
                position: "absolute",
                bottom: "8%",
                right: "-6%",
                background: "#FFFFFF",
                border: "3px solid #0D0F14",
                padding: ".45rem .9rem",
                fontFamily: "var(--space-mono)",
                fontSize: ".52rem",
                letterSpacing: ".1em",
                boxShadow: "4px 4px 0 #0D0F14",
                zIndex: 10,
                whiteSpace: "nowrap",
                animation: "chipf 6s ease-in-out infinite 1.5s",
              }}
            >
              P99: <span style={{ color: "#E8192C", fontWeight: 700 }}>11ms</span>
            </div>

            {/* Photo badge */}
            <div
              style={{
                position: "absolute",
                bottom: "10%",
                left: "8%",
                background: "#E8192C",
                border: "3px solid #0D0F14",
                padding: ".55rem 1rem",
                zIndex: 10,
                boxShadow: "5px 5px 0 #0D0F14",
              }}
            >
              <div style={{ fontFamily: "var(--oxanium)", fontWeight: 800, fontSize: "1.6rem", color: "#fff", lineHeight: 1 }}>2+</div>
              <div style={{ fontFamily: "var(--space-mono)", fontSize: ".46rem", letterSpacing: ".12em", textTransform: "uppercase", color: "rgba(255,255,255,.75)" }}>Years Eng.</div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
