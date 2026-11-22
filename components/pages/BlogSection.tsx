import Link from "next/link";
import { getRecentPosts, formatBlogDate } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog";
import { Slide } from "@/components/ui/Slide";

const CATEGORY_COLORS: Record<BlogPost["category"], string> = {
  project: "#E8192C",
  findings: "#E8192C",
};

export default async function BlogSection() {
  const posts = await getRecentPosts(3);

  return (
    <section
      className="px-5 py-16 sm:px-8 sm:py-20 lg:px-14"
      style={{
        borderBottom: "3px solid #0D0F14",
        background: "#FFFFFF",
      }}
    >
      <style>{`
        .blog-card-item {
          position: relative;
          overflow: hidden;
          cursor: default;
          display: flex;
          flex-direction: column;
          transition: color .35s;
        }
        .blog-card-item::after {
          content: '';
          position: absolute;
          inset: 0;
          background: #0D0F14;
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform .4s cubic-bezier(.16,1,.3,1);
          z-index: 0;
        }
        .blog-card-item:hover::after { transform: scaleY(1); }
        .blog-card-item > * { position: relative; z-index: 1; }
        .blog-card-item:hover .bc-dotted { border-color: rgba(255,255,255,.08) !important; }
        .blog-grid {
          display: grid;
        }
        .blog-card-item {
          border-right: none;
        }
        @media (min-width: 768px) {
          .blog-card-item {
            border-right: 3px solid #0D0F14;
          }
          .blog-card-item:nth-child(3n) {
            border-right: none;
          }
        }
      `}</style>
      {/* Section header */}
      <Slide delay={0.05}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "1rem",
          justifyContent: "space-between",
          marginBottom: "3.5rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
          <span
            style={{
              fontFamily: "var(--oxanium)",
              fontWeight: 800,
              fontSize: "4rem",
              color: "rgba(232,25,44,0.07)",
              lineHeight: 1,
            }}
          >
            03
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
            From the <span style={{ color: "#E8192C" }}>Blog</span>
          </h2>
        </div>
        <Link
          href="/blog"
          style={{
            fontFamily: "var(--space-mono)",
            fontSize: ".6rem",
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: "#8892AA",
            textDecoration: "none",
            border: "2px solid #E4E7ED",
            padding: ".5rem 1.2rem",
            transition: "all .2s",
          }}
          className="hover:border-[#E8192C] hover:text-[#E8192C]"
        >
          All Posts →
        </Link>
      </div>
      </Slide>

      <Slide delay={0.15}>
      {posts.length === 0 ? (
        <div
          style={{
            border: "3px solid #0D0F14",
            background: "#F0F2F5",
            padding: "4rem 3rem",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--space-mono)",
              fontSize: ".7rem",
              color: "#8892AA",
              letterSpacing: ".1em",
            }}
          >
            No posts yet — check back soon.
          </p>
        </div>
      ) : (
        <div
          style={{
            border: "3px solid #0D0F14",
            background: "#FFFFFF",
          }}
          className="blog-grid grid-cols-1 md:grid-cols-3"
        >
          {posts.map((post, i) => (
            <div
              key={post.id}
              style={{
                padding: "2.5rem",
              }}
              className="blog-card-item group"
            >
              {/* Dotted inner border */}
              <div
                style={{
                  position: "absolute",
                  inset: 7,
                  border: "2px dotted rgba(232,25,44,.15)",
                  pointerEvents: "none",
                  zIndex: 2,
                  transition: "border-color .35s",
                }}
                className="bc-dotted"
              />

              <span
                style={{
                  display: "inline-block",
                  fontFamily: "var(--space-mono)",
                  fontSize: ".5rem",
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: CATEGORY_COLORS[post.category],
                  border: `2px solid ${CATEGORY_COLORS[post.category]}`,
                  padding: ".25rem .6rem",
                  marginBottom: "1.2rem",
                  position: "relative",
                  zIndex: 1,
                  width: "fit-content",
                  transition: "color .35s, border-color .35s",
                }}
                className="group-hover:!text-white group-hover:!border-[#E8192C]"
              >
                {post.category === "project" ? "Project Blog" : "Findings"}
              </span>

              {post.published_at && (
                <div
                  style={{
                    fontFamily: "var(--space-mono)",
                    fontSize: ".54rem",
                    color: "#8892AA",
                    marginBottom: ".8rem",
                    letterSpacing: ".08em",
                    position: "relative",
                    zIndex: 1,
                    transition: "color .35s",
                  }}
                  className="group-hover:!text-[rgba(255,255,255,.4)]"
                >
                  {formatBlogDate(post.published_at)}
                </div>
              )}

              <h3
                style={{
                  fontFamily: "var(--oxanium)",
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  lineHeight: 1.3,
                  color: "#1A1D24",
                  marginBottom: ".8rem",
                  position: "relative",
                  zIndex: 1,
                  transition: "color .35s",
                }}
                className="group-hover:!text-white"
              >
                {post.title}
              </h3>

              <p
                style={{
                  fontFamily: "var(--space-mono)",
                  fontSize: ".6rem",
                  lineHeight: 1.85,
                  color: "#4A5068",
                  flex: 1,
                  marginBottom: "1.5rem",
                  position: "relative",
                  zIndex: 1,
                  transition: "color .35s",
                }}
                className="group-hover:!text-[rgba(255,255,255,.5)]"
              >
                {post.excerpt}
              </p>

              <Link
                href={`/blog/${post.slug}`}
                style={{
                  fontFamily: "var(--space-mono)",
                  fontSize: ".55rem",
                  letterSpacing: ".15em",
                  textTransform: "uppercase",
                  color: "#8892AA",
                  display: "inline-block",
                  position: "relative",
                  zIndex: 1,
                  transition: "color .35s",
                  textDecoration: "none",
                }}
                className="group-hover:!text-[#E8192C]"
              >
                Read Article →
              </Link>
            </div>
          ))}
        </div>
      )}
      </Slide>
    </section>
  );
}
