import fs from "node:fs/promises";
import path from "node:path";
import { buildPost } from "./markdown";
import type { BlogPost } from "./blog-shared";

// Client components import from ./blog-shared directly; this file reads the disk.
export type { BlogPost } from "./blog-shared";
export { formatBlogDate } from "./blog-shared";

const POSTS_DIR = path.join(process.cwd(), "blog-posts");

let postsPromise: Promise<BlogPost[]> | null = null;

/** Parse every post once per process; Shiki highlighting is the slow part. */
async function loadPosts(): Promise<BlogPost[]> {
  const files = (await fs.readdir(POSTS_DIR)).filter((f) => f.endsWith(".md"));
  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fs.readFile(path.join(POSTS_DIR, file), "utf-8");
      const { post, errors } = await buildPost(raw);
      if (errors.length > 0) {
        throw new Error(`[blog] blog-posts/${file}: ${errors.join("; ")}`);
      }
      return post as BlogPost;
    }),
  );

  const seen = new Map<string, string>();
  for (const [i, post] of posts.entries()) {
    const other = seen.get(post.slug);
    if (other) {
      throw new Error(`[blog] blog-posts/${files[i]} and ${other} share the slug "${post.slug}"`);
    }
    seen.set(post.slug, `blog-posts/${files[i]}`);
  }

  return posts
    .filter((post) => post.published)
    .sort((a, b) => b.published_at.localeCompare(a.published_at));
}

/** All published posts, newest first */
export async function getAllPosts(): Promise<BlogPost[]> {
  postsPromise ??= loadPosts();
  return postsPromise;
}

/** Published posts in one category, newest first */
export async function getPostsByCategory(
  category: BlogPost["category"],
): Promise<BlogPost[]> {
  return (await getAllPosts()).filter((post) => post.category === category);
}

/** A single published post by slug */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return (await getAllPosts()).find((post) => post.slug === slug) ?? null;
}

/** The n most recent published posts (for homepage preview) */
export async function getRecentPosts(limit = 3): Promise<BlogPost[]> {
  return (await getAllPosts()).slice(0, limit);
}
