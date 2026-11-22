// Blog post type and helpers that are safe to import from client components.

/**
 * A blog post rendered from blog-posts/<file>.md at build time.
 * `content` is the final HTML (Markdown → marked → Shiki).
 */
export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  /** "project" | "findings" */
  category: "project" | "findings";
  tags: string[];
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
};

/** Format date for display */
export function formatBlogDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
