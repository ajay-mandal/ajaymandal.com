import Link from "next/link";
import { PROJECT } from "@/data/Projects";
import { Slide } from "@/components/ui/Slide";

const PJ_STYLE = `
  @keyframes slideFromBottom {
    from { transform: translateY(20px); opacity: .7; }
    to   { transform: translateY(0);    opacity: 1;  }
  }
  .pj-card {
    position: relative;
    overflow: hidden;
    background: #FFFFFF;
    padding: 2.5rem 2.8rem;
    cursor: default;
    transition: background .35s;
  }
  .pj-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: #0D0F14;
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform .4s cubic-bezier(.16,1,.3,1);
    z-index: 0;
  }
  .pj-card:hover::before { transform: scaleY(1); }
  .pj-card-inner {
    position: relative;
    z-index: 1;
    transition: none;
  }
  .pj-card:hover .pj-card-inner {
    animation: slideFromBottom .4s cubic-bezier(.16,1,.3,1) both;
  }
  .pj-featured {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 3rem;
    padding: 3rem;
  }
  .pj-rest-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .pj-featured-dotted {
    position: absolute;
    inset: 14px;
    border: 2px dotted rgba(255,255,255,0.08);
    pointer-events: none;
  }
  .pj-featured-metrics {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 900px) {
    .pj-featured {
      grid-template-columns: 1fr;
      gap: 2rem;
      padding: 2rem 1.5rem;
    }
    .pj-featured-dotted {
      inset: 10px;
    }
    .pj-rest-grid {
      grid-template-columns: 1fr;
    }
    .pj-card-wrap {
      border-right: none !important;
    }
    .pj-card {
      padding: 2rem 1.8rem;
    }
  }
  @media (max-width: 640px) {
    .pj-featured {
      gap: 1.5rem;
      padding: 1.5rem 1rem;
    }
    .pj-featured-dotted {
      inset: 8px;
    }
  }
`;

export default function Project() {
  const [featured, ...rest] = PROJECT;

  return (
    <section
      className="px-5 py-16 sm:px-8 sm:py-20 lg:px-14"
      style={{
        borderBottom: "3px solid #0D0F14",
        background: "#F0F2F5",
      }}
    >
      <style>{PJ_STYLE}</style>
      {/* Section header */}
      <Slide delay={0.05}>
      <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginBottom: "3.5rem" }}>
        <span
          style={{
            fontFamily: "var(--oxanium)",
            fontWeight: 800,
            fontSize: "4rem",
            color: "rgba(232,25,44,0.07)",
            lineHeight: 1,
          }}
        >
          02
        </span>
        <h2
          style={{
            fontFamily: "var(--oxanium)",
            fontWeight: 800,
            fontSize: "clamp(2rem,3.8vw,3.2rem)",
            lineHeight: 1,
            color: "#1A1D24",
          }}
        >
          Selected <span style={{ color: "#E8192C" }}>Work</span>
        </h2>
        <Link
          href="/projects"
          style={{
            marginLeft: "auto",
            fontFamily: "var(--space-mono)",
            fontSize: ".6rem",
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "#4A5068",
            textDecoration: "none",
            borderBottom: "2px solid #E8192C",
            paddingBottom: 2,
            whiteSpace: "nowrap",
          }}
          className="hover:!text-[#E8192C]"
        >
          All Projects →
        </Link>
      </div>
      </Slide>

      <div style={{ border: "3px solid #0D0F14" }}>

        {/* ── FEATURED PROJECT ── */}
        <Slide delay={0.15}>
        <div
          className="pj-featured"
          style={{
            background: "#1A1D24",
            borderBottom: "3px solid #0D0F14",
            alignItems: "center",
            position: "relative",
            overflow: "hidden",
            cursor: "default",
          }}
        >
          {/* dotted inset border */}
          <div className="pj-featured-dotted" />

          {/* Left: info */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".75rem", marginBottom: "1rem" }}>
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#E8192C",
                  flexShrink: 0,
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--space-mono)",
                  fontSize: "clamp(.48rem, 1.2vw, .52rem)",
                  letterSpacing: ".22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,.4)",
                }}
              >
                FEATURED · {featured.year}
              </span>
            </div>

            <h3
              style={{
                fontFamily: "var(--oxanium)",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                lineHeight: 1.1,
                color: "#FFFFFF",
                marginBottom: "1rem",
              }}
            >
              <Link href={`/projects/${featured.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                {featured.name}
              </Link>
            </h3>

            <p
              style={{
                fontFamily: "var(--space-mono)",
                fontSize: "clamp(.58rem, 1.4vw, .62rem)",
                lineHeight: 1.8,
                color: "rgba(255,255,255,.5)",
                marginBottom: "clamp(1.2rem, 3vw, 1.5rem)",
                maxWidth: 460,
              }}
            >
              {featured.tagline}
            </p>

            {/* Tech pills */}
            <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginBottom: "clamp(1.5rem, 3.5vw, 1.8rem)" }}>
              {featured.stack.map((tech) => (
                <span
                  key={tech}
                  style={{
                    fontFamily: "var(--space-mono)",
                    fontSize: "clamp(.45rem, 1.1vw, .48rem)",
                    letterSpacing: ".1em",
                    textTransform: "uppercase",
                    border: "2px solid rgba(255,255,255,.14)",
                    color: "rgba(255,255,255,.55)",
                    padding: ".28rem .7rem",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Links */}
            <div style={{ display: "flex", gap: "clamp(.8rem, 2vw, 1.5rem)", flexWrap: "wrap" }}>
              <Link
                href={`/projects/${featured.slug}`}
                style={{
                  fontFamily: "var(--space-mono)",
                  fontSize: "clamp(.52rem, 1.3vw, .56rem)",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "#E8192C",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(232,25,44,.5)",
                  paddingBottom: 2,
                  transition: "color .3s, border-color .3s",
                }}
                className="hover:!text-white hover:!border-white"
              >
                Details →
              </Link>
              {featured.blogLink && (
                <Link
                  href={featured.blogLink}
                  target="_blank"
                  style={{
                    fontFamily: "var(--space-mono)",
                    fontSize: "clamp(.52rem, 1.3vw, .56rem)",
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,.4)",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(255,255,255,.15)",
                    paddingBottom: 2,
                    transition: "color .3s, border-color .3s",
                  }}
                  className="hover:!text-white hover:!border-white"
                >
                  View Case Study →
                </Link>
              )}
              <Link
                href={featured.github}
                target="_blank"
                style={{
                  fontFamily: "var(--space-mono)",
                  fontSize: "clamp(.52rem, 1.3vw, .56rem)",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,.4)",
                  textDecoration: "none",
                  borderBottom: "1px solid rgba(255,255,255,.15)",
                  paddingBottom: 2,
                  transition: "color .3s, border-color .3s",
                }}
                className="hover:!text-white hover:!border-white"
              >
                GitHub →
              </Link>
              {featured.live && (
                <Link
                  href={featured.live}
                  target="_blank"
                  style={{
                    fontFamily: "var(--space-mono)",
                    fontSize: "clamp(.52rem, 1.3vw, .56rem)",
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,.4)",
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(255,255,255,.15)",
                    paddingBottom: 2,
                    transition: "color .3s, border-color .3s",
                  }}
                  className="hover:!text-white hover:!border-white"
                >
                  Live →
                </Link>
              )}
            </div>
          </div>

          {/* Right: metrics 2×2 grid */}
          {featured.metrics && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                border: "1.5px solid rgba(255,255,255,.06)",
                position: "relative",
                zIndex: 1,
              }}
            >
              {featured.metrics.map((m, i) => (
                <div
                  key={m.label}
                  style={{
                    padding: "clamp(1.1rem, 2.8vw, 1.3rem) clamp(1rem, 2.8vw, 1.5rem)",
                    position: "relative",
                    borderRight: i % 2 === 0 ? "2px solid rgba(255,255,255,.06)" : undefined,
                    borderBottom: i < 2 ? "2px solid rgba(255,255,255,.06)" : undefined,
                  }}
                >
                  {/* dotted inset */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 5,
                      border: "2px dotted rgba(232,25,44,.2)",
                      pointerEvents: "none",
                    }}
                  />
                  <div
                    style={{
                      fontFamily: "var(--oxanium)",
                      fontWeight: 800,
                      fontSize: "clamp(1.2rem, 3vw, 1.4rem)",
                      color: "#E8192C",
                      lineHeight: 1,
                      marginBottom: ".3rem",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {m.value}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--space-mono)",
                      fontSize: "clamp(.46rem, 1.15vw, .48rem)",
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,.3)",
                      position: "relative",
                      zIndex: 1,
                      lineHeight: 1.3,
                    }}
                  >
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </Slide>

        {/* ── REST: 2-column card grid ── */}
        <div
          className="pj-rest-grid"
          style={{
            borderTop: "3px solid #0D0F14",
          }}
        >
          {rest.map((project, idx) => {
            const isLast = idx === rest.length - 1;
            const oddCount = rest.length % 2 !== 0;
            const spanFull = isLast && oddCount;
            const showRightBorder = !spanFull && idx % 2 === 0;
            const showBottomBorder = idx < rest.length - 1;

            return (
              <div
                key={project.name}
                className="pj-card-wrap"
                style={{
                  gridColumn: spanFull ? "1 / -1" : undefined,
                  borderRight: showRightBorder ? "3px solid #0D0F14" : undefined,
                  borderBottom: showBottomBorder ? "3px solid #0D0F14" : undefined,
                }}
              >
                <Slide delay={0.1 + idx * 0.08} className="h-full">
                  <div className="pj-card group h-full">
                    <div className="pj-card-inner">
                    {/* Category + year */}
                    <div style={{ display: "flex", alignItems: "center", gap: ".6rem", marginBottom: ".9rem" }}>
                      <span
                        style={{
                          width: 6, height: 6, borderRadius: "50%",
                          background: "#E8192C", display: "inline-block", flexShrink: 0,
                          transition: "background .3s",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--space-mono)", fontSize: ".5rem",
                          letterSpacing: ".2em", textTransform: "uppercase",
                          color: "#E8192C", transition: "color .3s",
                        }}
                      >
                        {project.category} · {project.year}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--oxanium)", fontWeight: 800,
                          fontSize: "3.2rem", color: "rgba(13,15,20,.04)",
                          lineHeight: 1, userSelect: "none",
                          marginLeft: "auto", transition: "color .3s",
                        }}
                        className="group-hover:!text-[rgba(255,255,255,.07)]"
                      >
                        0{idx + 2}
                      </span>
                    </div>

                    {/* Name */}
                    <h3
                      style={{
                        fontFamily: "var(--oxanium)", fontWeight: 800,
                        fontSize: "clamp(1.4rem,2.2vw,2rem)", lineHeight: 1.1,
                        color: "#1A1D24", marginBottom: ".9rem", transition: "color .3s",
                      }}
                      className="group-hover:!text-white"
                    >
                      <Link href={`/projects/${project.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                        {project.name}
                      </Link>
                    </h3>

                    {/* Tagline */}
                    <p
                      style={{
                        fontFamily: "var(--space-mono)", fontSize: ".6rem",
                        lineHeight: 1.9, color: "#4A5068",
                        marginBottom: "1.2rem", transition: "color .3s",
                      }}
                      className="group-hover:!text-[rgba(255,255,255,.75)]"
                    >
                      {project.tagline}
                    </p>

                    {/* Tech pills */}
                    <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap", marginBottom: "1.4rem" }}>
                      {project.stack.map((tech) => (
                        <span
                          key={tech}
                          style={{
                            fontFamily: "var(--space-mono)", fontSize: ".48rem",
                            letterSpacing: ".1em", textTransform: "uppercase",
                            border: "2px solid rgba(13,15,20,.18)", color: "#4A5068",
                            padding: ".28rem .7rem", transition: "border-color .3s, color .3s",
                          }}
                          className="group-hover:!border-[rgba(255,255,255,.3)] group-hover:!text-[rgba(255,255,255,.75)]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Links */}
                    <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
                      <Link
                        href={`/projects/${project.slug}`}
                        style={{
                          fontFamily: "var(--space-mono)", fontSize: ".55rem",
                          letterSpacing: ".14em", textTransform: "uppercase",
                          color: "#E8192C", textDecoration: "none",
                          borderBottom: "1px solid rgba(232,25,44,.4)", paddingBottom: 2,
                          transition: "color .3s, border-color .3s",
                        }}
                        className="group-hover:!text-white group-hover:!border-[rgba(255,255,255,.35)]"
                      >
                        Details →
                      </Link>
                      <Link
                        href={project.github} target="_blank"
                        style={{
                          fontFamily: "var(--space-mono)", fontSize: ".55rem",
                          letterSpacing: ".14em", textTransform: "uppercase",
                          color: "#8892AA", textDecoration: "none",
                          borderBottom: "1px solid rgba(13,15,20,.15)", paddingBottom: 2,
                          transition: "color .3s, border-color .3s",
                        }}
                        className="group-hover:!text-white group-hover:!border-[rgba(255,255,255,.35)]"
                      >
                        GitHub →
                      </Link>
                      {project.live && (
                        <Link
                          href={project.live} target="_blank"
                          style={{
                            fontFamily: "var(--space-mono)", fontSize: ".55rem",
                            letterSpacing: ".14em", textTransform: "uppercase",
                            color: "#8892AA", textDecoration: "none",
                            borderBottom: "1px solid rgba(13,15,20,.15)", paddingBottom: 2,
                            transition: "color .3s, border-color .3s",
                          }}
                          className="group-hover:!text-white group-hover:!border-[rgba(255,255,255,.35)]"
                        >
                          Live →
                        </Link>
                      )}
                      {project.blogLink && (
                        <Link
                          href={project.blogLink} target="_blank"
                          style={{
                            fontFamily: "var(--space-mono)", fontSize: ".55rem",
                            letterSpacing: ".14em", textTransform: "uppercase",
                            color: "#8892AA", textDecoration: "none",
                            borderBottom: "1px solid rgba(13,15,20,.15)", paddingBottom: 2,
                            transition: "color .3s, border-color .3s",
                          }}
                          className="group-hover:!text-white group-hover:!border-[rgba(255,255,255,.35)]"
                        >
                          Blog →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </Slide>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
