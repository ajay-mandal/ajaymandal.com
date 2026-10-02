import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import BlogList from "@/components/pages/BlogList";
import JsonLd from "@/components/global/JsonLd";
import { AUTHOR, PERSON_ID, SITE_URL, WEBSITE_ID, absoluteUrl, pageMetadata } from "@/lib/site";

const BLOG_DESCRIPTION =
  "Engineering blog by Ajay Mandal: project deep-dives, backend architecture, Next.js, NestJS, authentication, cloud infrastructure and lessons from building real systems.";

export const metadata = pageMetadata({
  title: "Blog",
  description: BLOG_DESCRIPTION,
  path: "/blog",
  ogSubtitle: "Project deep-dives & engineering findings",
});

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getAllPosts();

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": absoluteUrl("/blog#blog"),
    url: absoluteUrl("/blog"),
    name: `${AUTHOR.name} — Blog`,
    description: BLOG_DESCRIPTION,
    inLanguage: "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    author: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR.name, url: SITE_URL },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": `${absoluteUrl(`/blog/${post.slug}`)}#article`,
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.published_at,
      dateModified: post.updated_at || post.published_at,
    })),
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA]">
      <JsonLd data={blogJsonLd} />
      {/* HERO SECTION */}
      <header className="relative bg-white pb-12 sm:pb-16 lg:pt-32 lg:pb-20 overflow-hidden border-b-[3px] sm:border-b-[4px] lg:border-b-[6px] border-[#0D0F14]">
        {/* Animated background grid */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(0deg, #E8192C 1px, transparent 1px),
              linear-gradient(90deg, #E8192C 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            animation: "gridSlide 60s linear infinite",
          }}
        />

        {/* Decorative elements */}
        <div className="hidden sm:block absolute top-20 right-10 w-32 sm:w-40 h-32 sm:h-40 border-[4px] sm:border-[6px] border-[#E8192C] transform rotate-12 opacity-30" />
        <div className="hidden sm:block absolute bottom-10 left-20 w-20 sm:w-24 h-20 sm:h-24 bg-[#E8192C] opacity-20 transform -rotate-6" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 sm:mb-8 lg:mb-12">
            <span className="w-8 sm:w-12 lg:w-16 h-[2px] bg-[#E8192C]" />
            <span className="font-[family-name:var(--space-mono)] text-[9px] sm:text-[10px] lg:text-[11px] tracking-[0.2em] uppercase text-[#E8192C] font-bold">
              Technical Writing
            </span>
          </div>

          {/* Title */}
          <div className="max-w-5xl">
            <h1 className="font-[family-name:var(--oxanium)] font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-4 sm:mb-6 lg:mb-8">
              <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#0D0F14] to-[#4A5068]">
                Engineering
              </span>
              <br />
              <span className="text-[#E8192C]">Chronicles</span>
            </h1>

            <p className="font-[family-name:var(--space-mono)] text-xs sm:text-sm text-[#4A5068] leading-relaxed max-w-2xl mb-6 sm:mb-8">
              Deep technical explorations, project breakdowns, and engineering
              insights from the trenches of modern web development. Each article
              is a journey through code, architecture, and problem-solving.
            </p>
          </div>
        </div>
      </header>

      {/* CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {posts.length === 0 ? (
          <div className="max-w-2xl mx-auto bg-white border-[5px] border-[#0D0F14] p-16 text-center shadow-[12px_12px_0_#E8192C]">
            <div className="w-20 h-20 border-[4px] border-[#E8192C] mx-auto mb-8 flex items-center justify-center">
              <span className="text-4xl">📝</span>
            </div>
            <h2 className="font-[family-name:var(--oxanium)] font-black text-3xl mb-4 text-[#1A1D24]">
              No Articles Yet
            </h2>
            <p className="font-[family-name:var(--space-mono)] text-sm text-[#8892AA] leading-relaxed mb-8">
              The archive is empty, but great things are coming. Check back soon
              for technical deep-dives and engineering insights.
            </p>
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-[#E8192C] border-[3px] border-[#E8192C] text-white font-[family-name:var(--space-mono)] text-[11px] tracking-[0.2em] uppercase hover:bg-transparent hover:text-[#E8192C] transition-all"
            >
              ← Back Home
            </Link>
          </div>
        ) : (
          <BlogList posts={posts} />
        )}
      </div>

      {/* CTA SECTION */}
      <section className="bg-[#0D0F14] text-white py-12 sm:py-16 lg:py-20 border-t-[4px] sm:border-t-[5px] lg:border-t-[6px] border-[#E8192C]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left">
              <h2 className="font-[family-name:var(--oxanium)] font-black text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-5 sm:mb-6 lg:mb-8 leading-[1.1]">
                Never Miss
                <br />
                <span className="text-[#E8192C]">A Post</span>
              </h2>
              <p className="font-[family-name:var(--space-mono)] text-sm sm:text-base text-[#8892AA] leading-relaxed mb-8 sm:mb-10 lg:mb-12 max-w-xl mx-auto lg:mx-0">
                Get notified when new technical articles drop. From authentication to state management, I share real-world insights.
              </p>
              <div className="flex flex-col gap-4">
                <Link
                  href="https://x.com/ajaymandal01"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center px-8 py-4 bg-[#E8192C] border-[3px] border-[#E8192C] text-white font-[family-name:var(--space-mono)] text-xs tracking-[0.2em] uppercase hover:bg-transparent transition-all shadow-[4px_4px_0_rgba(232,25,44,0.4)]"
                >
                  FOLLOW ON X
                </Link>
                <Link
                  href="/#contact"
                  className="w-full text-center px-8 py-4 bg-transparent border-[3px] border-white text-white font-[family-name:var(--space-mono)] text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-[#0D0F14] transition-all"
                >
                  GET IN TOUCH
                </Link>
              </div>
            </div>

            {/* Right - Decorative Stack */}
            <div className="hidden lg:block">
              <div className="relative h-80 flex items-center justify-center">
                {/* Stacked Article Cards Effect */}
                <div className="absolute top-0 right-12 w-72 h-40 bg-[#8892AA] opacity-10 border-[5px] border-white transform rotate-3" />
                <div className="absolute top-8 right-8 w-72 h-40 bg-white opacity-20 border-[5px] border-white transform -rotate-2" />
                <div className="absolute top-16 right-4 w-72 h-40 bg-[#E8192C] border-[5px] border-white transform rotate-1 shadow-[8px_8px_0_rgba(0,0,0,0.3)]">
                  <div className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <div className="w-16 h-1 bg-white mb-3" />
                      <div className="w-32 h-1 bg-white opacity-70 mb-2" />
                      <div className="w-24 h-1 bg-white opacity-70" />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="w-20 h-1 bg-white opacity-50" />
                      <div className="w-12 h-12 border-[3px] border-white flex items-center justify-center">
                        <span className="font-[family-name:var(--oxanium)] font-black text-2xl text-white">
                          &#8594;
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
