import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPosts, formatBlogDate } from "@/lib/blog";
import type { Metadata } from "next";
import type { BlogPost } from "@/lib/supabase";
import { SharePost } from "@/components/global/SharePost";
import JsonLd from "@/components/global/JsonLd";
import { AUTHOR, PERSON_ID, SITE_NAME, SITE_URL, absoluteUrl, ogImageUrl } from "@/lib/site";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post Not Found", robots: { index: false, follow: true } };

  const postUrl = absoluteUrl(`/blog/${slug}`);
  const imageUrl = postImageUrl(post);

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: AUTHOR.name, url: absoluteUrl("/about") }],
    alternates: { canonical: postUrl },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at || post.published_at,
      authors: [absoluteUrl("/about")],
      section: CATEGORY_LABEL[post.category],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
      creator: AUTHOR.twitter,
    },
  };
}

function postImageUrl(post: BlogPost): string {
  return post.cover_image
    ? absoluteUrl(post.cover_image)
    : ogImageUrl(post.title, post.category === "project" ? "Project deep-dive" : "Engineering findings");
}

function postJsonLd(post: BlogPost) {
  const postUrl = absoluteUrl(`/blog/${post.slug}`);
  const wordCount = post.content.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${postUrl}#article`,
      headline: post.title,
      description: post.excerpt,
      image: [postImageUrl(post)],
      datePublished: post.published_at,
      dateModified: post.updated_at || post.published_at,
      url: postUrl,
      mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
      author: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR.name, url: SITE_URL },
      publisher: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR.name },
      keywords: post.tags?.join(", "),
      articleSection: CATEGORY_LABEL[post.category],
      wordCount,
      inLanguage: "en-US",
      isPartOf: { "@type": "Blog", "@id": absoluteUrl("/blog#blog") },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
        { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
      ],
    },
  ];
}

const CATEGORY_LABEL: Record<BlogPost["category"], string> = {
  project: "PROJECT",
  findings: "FINDINGS",
};

const CATEGORY_COLOR: Record<BlogPost["category"], string> = {
  project: "#E8192C",
  findings: "#4A5068",
};

async function getRelatedPosts(currentPost: BlogPost): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();

  const related = allPosts
    .filter((p) => p.id !== currentPost.id)
    .map((p) => {
      let score = 0;
      if (p.category === currentPost.category) score += 3;
      const sharedTags =
        p.tags?.filter((tag) => currentPost.tags?.includes(tag)).length || 0;
      score += sharedTags;
      return { post: p, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(({ post }) => post);

  if (related.length < 3) {
    return allPosts.filter((p) => p.id !== currentPost.id).slice(0, 3);
  }

  return related;
}

async function getAdjacentPosts(currentSlug: string) {
  const allPosts = await getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === currentSlug);

  return {
    previous: currentIndex > 0 ? allPosts[currentIndex - 1] : null,
    next:
      currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null,
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(post);
  const { previous, next } = await getAdjacentPosts(slug);
  
  return (
    <article className="blog-post-editorial">
      <JsonLd data={postJsonLd(post)} />
      {/* HERO SECTION */}
      <header className="relative bg-[#FAFAFA] pb-10 sm:pb-14 lg:pt-32 lg:pb-16 overflow-hidden border-b-[3px] sm:border-b-[4px] lg:border-b-[6px] border-[#0D0F14]">
        {/* Animated background grid */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(0deg, #E8192C 1px, transparent 1px),
              linear-gradient(90deg, #E8192C 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            animation: "gridSlide 60s linear infinite",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Back button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 sm:gap-3 text-[#4A5068] text-xs sm:text-sm tracking-wider uppercase font-[family-name:var(--space-mono)] hover:text-[#E8192C] transition-all mb-6 sm:mb-8 lg:mb-12 group"
          >
            <span className="w-6 sm:w-10 lg:w-12 h-[2px] bg-[#E8192C] group-hover:w-12 sm:group-hover:w-16 transition-all" />
            <span>BACK TO BLOG</span>
          </Link>

          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-[1fr,360px] lg:gap-8 xl:gap-12 items-start">
            {/* Title Section */}
            <div className="order-2 lg:order-1">
              {/* Category and Tags */}
              <div className="flex flex-wrap items-center gap-2 mb-4 sm:mb-6">
                <span
                  className="px-3 py-1.5 text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase border-[2px] font-[family-name:var(--oxanium)]"
                  style={{
                    color: CATEGORY_COLOR[post.category],
                    borderColor: CATEGORY_COLOR[post.category],
                    backgroundColor: `${CATEGORY_COLOR[post.category]}10`,
                  }}
                >
                  {CATEGORY_LABEL[post.category]}
                </span>
                {post.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-[8px] sm:text-[9px] tracking-[0.1em] uppercase text-[#8892AA] border border-[#E4E7ED] font-[family-name:var(--space-mono)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.1] mb-4 sm:mb-6 font-[family-name:var(--oxanium)] break-words">
                <span className="bg-clip-text text-transparent bg-gradient-to-br from-[#1A1D24] to-[#4A5068]">
                  {post.title}
                </span>
              </h1>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs">
                <time
                  className="font-[family-name:var(--space-mono)] text-[#8892AA] tracking-wide"
                  dateTime={post.published_at}
                >
                  {formatBlogDate(post.published_at)}
                </time>
                <div className="w-1 h-1 rounded-full bg-[#E8192C]" />
                <span className="text-[#8892AA] font-[family-name:var(--space-mono)] text-[10px] sm:text-xs tracking-wider">
                  {Math.ceil(post.content.split(" ").length / 200)} MIN READ
                </span>
              </div>
            </div>

            {/* Excerpt box */}
            <div className="order-1 lg:order-2 bg-white border-[3px] border-[#0D0F14] p-4 sm:p-5 lg:p-6 shadow-[4px_4px_0_#E8192C] sm:shadow-[6px_6px_0_#E8192C]">
              <p className="font-[family-name:var(--space-mono)] text-xs sm:text-sm leading-relaxed text-[#4A5068]">
                {post.excerpt}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="lg:grid lg:grid-cols-[1fr,300px] lg:gap-8 xl:gap-12">
            {/* Article Content */}
            <div className="max-w-3xl mb-10 lg:mb-0">
              <div
                className="article-content
                  prose prose-sm sm:prose-base max-w-none
                  prose-headings:font-[family-name:var(--oxanium)] prose-headings:font-black prose-headings:tracking-tight prose-headings:break-words
                  prose-h2:text-xl sm:prose-h2:text-2xl lg:prose-h2:text-3xl prose-h2:mt-8 sm:prose-h2:mt-10 lg:prose-h2:mt-12 prose-h2:mb-4 sm:prose-h2:mb-5 prose-h2:pb-2 sm:prose-h2:pb-3 prose-h2:border-b-[3px] prose-h2:border-[#E8192C]
                  prose-h3:text-lg sm:prose-h3:text-xl lg:prose-h3:text-2xl prose-h3:mt-6 sm:prose-h3:mt-8 prose-h3:mb-3 sm:prose-h3:mb-4
                  prose-p:font-[family-name:var(--space-mono)] prose-p:text-sm sm:prose-p:text-[15px] prose-p:leading-[1.75] prose-p:text-[#1A1D24] prose-p:mb-4 sm:prose-p:mb-5
                  prose-a:text-[#E8192C] prose-a:no-underline prose-a:font-semibold prose-a:border-b-2 prose-a:border-[#E8192C] hover:prose-a:bg-[#E8192C] hover:prose-a:text-white prose-a:transition-all prose-a:px-1 prose-a:break-words
                  prose-code:font-[family-name:var(--space-mono)] prose-code:text-[#E8192C] prose-code:bg-[#FFF5F6] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-sm prose-code:text-[13px] prose-code:border prose-code:border-[#FFE0E3] prose-code:break-words
                  prose-pre:!bg-[#1A1D24] prose-pre:border-[3px] prose-pre:border-[#0D0F14] prose-pre:rounded-none prose-pre:shadow-[4px_4px_0_#E8192C] prose-pre:my-6 sm:prose-pre:my-8 prose-pre:p-0 prose-pre:overflow-x-auto prose-pre:mx-0
                  prose-blockquote:border-l-[4px] prose-blockquote:border-[#E8192C] prose-blockquote:bg-[#FFF5F6] prose-blockquote:py-3 sm:prose-blockquote:py-4 prose-blockquote:px-4 sm:prose-blockquote:px-6 prose-blockquote:italic prose-blockquote:text-[#4A5068] prose-blockquote:text-sm sm:prose-blockquote:text-base
                  prose-ul:my-4 sm:prose-ul:my-5 prose-ol:my-4 sm:prose-ol:my-5
                  prose-li:my-1.5 prose-li:font-[family-name:var(--space-mono)] prose-li:text-[#1A1D24] prose-li:text-sm sm:prose-li:text-[15px]
                  prose-strong:text-[#E8192C] prose-strong:font-black
                  prose-img:my-6 sm:prose-img:my-8 prose-img:w-full
                  [&_pre]:!p-4 [&_pre]:sm:!p-5
                  [&_pre_code]:!bg-transparent [&_pre_code]:!border-0 [&_pre_code]:!p-0 [&_pre_code]:!text-[13px] [&_pre_code]:sm:!text-sm
                  [&_pre]:scrollbar-thin [&_pre]:scrollbar-track-[#0D0F14] [&_pre]:scrollbar-thumb-[#E8192C]
                "
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Sticky Sidebar */}
            <aside className="lg:sticky lg:top-20 space-y-6 self-start">
              {/* Related Posts */}
              {relatedPosts.length > 0 && (
                <div className="bg-[#FAFAFA] border-[3px] border-[#0D0F14] p-5 sm:p-6">
                  <h3 className="font-[family-name:var(--oxanium)] font-black text-base sm:text-lg tracking-tight mb-5 sm:mb-6 flex items-center gap-2">
                    <span className="w-6 h-[2px] bg-[#E8192C]" />
                    RELATED
                  </h3>
                  <div className="space-y-4 sm:space-y-5">
                    {relatedPosts.map((related) => (
                      <Link
                        key={related.id}
                        href={`/blog/${related.slug}`}
                        className="block group pb-4 border-b-2 border-[#E4E7ED] last:border-0 last:pb-0 hover:border-[#E8192C] transition-colors"
                      >
                        <span
                          className="text-[8px] sm:text-[9px] font-bold tracking-[0.15em] uppercase mb-1.5 block font-[family-name:var(--space-mono)]"
                          style={{ color: CATEGORY_COLOR[related.category] }}
                        >
                          {CATEGORY_LABEL[related.category]}
                        </span>
                        <h4 className="font-[family-name:var(--oxanium)] font-bold text-sm sm:text-base leading-tight mb-1.5 group-hover:text-[#E8192C] transition-colors line-clamp-2">
                          {related.title}
                        </h4>
                        <time className="text-[9px] sm:text-[10px] text-[#8892AA] font-[family-name:var(--space-mono)] tracking-wider">
                          {formatBlogDate(related.published_at)}
                        </time>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Links */}
              <div className="bg-[#0D0F14] text-white p-5 sm:p-6 border-[3px] border-[#0D0F14] shadow-[4px_4px_0_#E8192C]">
                <h3 className="font-[family-name:var(--oxanium)] font-black text-xs sm:text-sm tracking-[0.15em] uppercase mb-4">
                  QUICK LINKS
                </h3>
                <div className="space-y-2.5">
                  <Link
                    href="/blog"
                    className="block text-xs font-[family-name:var(--space-mono)] tracking-wide hover:text-[#E8192C] transition-colors"
                  >
                    → ALL ARTICLES
                  </Link>
                  <Link
                    href="/#contact"
                    className="block text-xs font-[family-name:var(--space-mono)] tracking-wide hover:text-[#E8192C] transition-colors"
                  >
                    → GET IN TOUCH
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* SHARE POST SECTION */}
      <SharePost 
        title={post.title}
        url={absoluteUrl(`/blog/${post.slug}`)}
      />

      {/* NAVIGATION */}
      {(previous || next) && (
        <nav className="bg-[#F0F2F5] border-t-[3px] sm:border-t-[4px] border-b-[3px] sm:border-b-[4px] border-[#0D0F14] py-10 sm:py-14 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Previous Post */}
              {previous ? (
                <Link
                  href={`/blog/${previous.slug}`}
                  className="group relative bg-white border-[3px] border-[#0D0F14] p-4 sm:p-6 hover:shadow-[4px_4px_0_#E8192C] transition-all overflow-hidden min-h-[100px] flex flex-col justify-between"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E8192C] to-transparent" />
                  <span className="text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-[#8892AA] font-[family-name:var(--space-mono)] mb-2 block">
                    ← PREVIOUS
                  </span>
                  <h3 className="font-[family-name:var(--oxanium)] font-bold text-base sm:text-lg lg:text-xl leading-tight group-hover:text-[#E8192C] transition-colors line-clamp-2">
                    {previous.title}
                  </h3>
                </Link>
              ) : (
                <div />
              )}

              {/* Next Post */}
              {next && (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group relative bg-white border-[3px] border-[#0D0F14] p-4 sm:p-6 hover:shadow-[4px_4px_0_#E8192C] transition-all overflow-hidden text-right min-h-[100px] flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-[#E8192C] to-transparent" />
                  <span className="text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-[#8892AA] font-[family-name:var(--space-mono)] mb-2 block">
                    NEXT →
                  </span>
                  <h3 className="font-[family-name:var(--oxanium)] font-bold text-base sm:text-lg lg:text-xl leading-tight group-hover:text-[#E8192C] transition-colors line-clamp-2">
                    {next.title}
                  </h3>
                </Link>
              )}
            </div>
          </div>
        </nav>
      )}

      {/* CTA SECTION */}
      <section className="bg-[#0D0F14] text-white py-12 sm:py-16 lg:py-20 border-t-[4px] sm:border-t-[5px] lg:border-t-[6px] border-[#E8192C]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-16 items-center">
            {/* Left - Content */}
            <div className="text-center lg:text-left">
              <h2 className="font-[family-name:var(--oxanium)] font-black text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-5 sm:mb-6 lg:mb-8 leading-[1.1] text-white">
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
    </article>
  );
}
