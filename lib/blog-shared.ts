// Blog post type and helpers that are safe to import from client components.

/**
 * A blog post rendered from blog-posts/<file>.md at build time.
 * `content` is the final HTML (Markdown → marked → Shiki); `markdown` is the source.
 */
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  /** The post body as written (Markdown, without frontmatter). */
  markdown: string;
  cover_image?: string;
  /** "project" | "findings" */
  category: "project" | "findings";
  tags: string[];
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
};

/** "17 Nov 2026". UTC so the build machine's timezone can't shift the day. */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatBlogDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getUTCDate()).padStart(2, "0")} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/**
 * Words in the rendered HTML. Inline <span>s (Shiki wraps every code token in
 * one) are removed without a space so highlighting doesn't change the count.
 */
export function wordCount(html: string): number {
  return html
    .replace(/<\/?span[^>]*>/g, "")
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

/** Reading time at ~230 words per minute, at least 1. */
export function readingMinutes(html: string): number {
  return Math.max(1, Math.round(wordCount(html) / 230));
}

/** List thumbnail: the frontmatter ogImage, else the first image in the post. */
export function postThumbnail(post: Pick<BlogPost, "cover_image" | "content">): string | undefined {
  return post.cover_image ?? post.content.match(/<img[^>]+src="([^"]+)"/)?.[1];
}
