import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import { formatBlogDate, readingMinutes, wordCount } from "@/lib/blog-shared";
import type { Metadata } from "next";
import type { BlogPost } from "@/lib/blog";
import CopyCodeButtons from "@/components/site/CopyCodeButtons";
import JsonLd from "@/components/global/JsonLd";
import { AUTHOR, PERSON_ID, SITE_NAME, SITE_URL, absoluteUrl, ogImageUrl } from "@/lib/site";

// Posts come from blog-posts/*.md at build time; any other slug is a 404.
export const dynamicParams = false;

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
    alternates: {
      canonical: postUrl,
      // Markdown copy for agents and LLM tools (lib/llms.ts).
      types: {
        "text/markdown": absoluteUrl(`/blog/${slug}.md`),
        "application/rss+xml": [{ url: "/blog/rss.xml", title: `${SITE_NAME} — Blog` }],
      },
    },
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
      wordCount: wordCount(post.content),
      inLanguage: "en-US",
      isPartOf: { "@type": "Blog", "@id": absoluteUrl("/blog#blog") },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Writing", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: post.title, item: postUrl },
      ],
    },
  ];
}

const CATEGORY_LABEL: Record<BlogPost["category"], string> = {
  project: "PROJECT",
  findings: "FINDINGS",
};

/** Posts are sorted newest first, so the neighbour before is newer. */
async function getAdjacentPosts(currentSlug: string) {
  const allPosts = await getAllPosts();
  const i = allPosts.findIndex((p) => p.slug === currentSlug);
  return {
    newer: i > 0 ? allPosts[i - 1] : null,
    older: i >= 0 && i < allPosts.length - 1 ? allPosts[i + 1] : null,
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

  const { newer, older } = await getAdjacentPosts(slug);

  return (
    <article>
      <JsonLd data={postJsonLd(post)} />
      <Link href="/" className="back-link">
        ← all writing
      </Link>

      <div className="post-head-meta">
        <time dateTime={post.published_at}>{formatBlogDate(post.published_at)}</time>
        <span aria-hidden="true">·</span>
        <span>{readingMinutes(post.content)} min read</span>
        {post.tags.length > 0 && <span aria-hidden="true">·</span>}
        {post.tags.slice(0, 3).map((tag) => (
          <Link key={tag} href={`/?tag=${encodeURIComponent(tag)}`}>
            {tag}
          </Link>
        ))}
      </div>

      <h1 className="page-title">{post.title}</h1>
      <p className="post-lead">{post.excerpt}</p>
      <hr className="divider" />

      <div
        id="post-body"
        className="article-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <CopyCodeButtons selector="#post-body" />

      {(newer || older) && (
        <nav className="post-nav" aria-label="More posts">
          {older && (
            <Link href={`/blog/${older.slug}`}>
              <small>← older</small>
              <span>{older.title}</span>
            </Link>
          )}
          {newer && (
            <Link href={`/blog/${newer.slug}`} className="next">
              <small>newer →</small>
              <span>{newer.title}</span>
            </Link>
          )}
        </nav>
      )}

      <p className="post-contact">
        Questions or corrections?{" "}
        <a className="link-accent" href={`mailto:${AUTHOR.email}`}>
          {AUTHOR.email}
        </a>
      </p>
    </article>
  );
}
