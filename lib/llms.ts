import type { BlogPost } from "./blog-shared";
import { PROJECT, projectSummary } from "@/data/Projects";
import { AUTHOR, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl, absolutizeHtml } from "./site";

/**
 * Plain-Markdown views of the site for LLMs and agents (llmstxt.org):
 * /llms.txt (index), /llms-full.txt (every post), /blog/<slug>.md (one post).
 */

const FENCE = /^(\s*)(`{3,}|~{3,})/;

/**
 * Make root-relative links and images absolute so they still work when the
 * Markdown is read outside the site. Code blocks are left untouched.
 */
export function absolutizeMarkdown(markdown: string): string {
  let fence: string | null = null;
  return markdown
    .split("\n")
    .map((line) => {
      const m = line.match(FENCE);
      if (m) {
        if (fence === null) fence = m[2][0].repeat(m[2].length);
        else if (line.trim().startsWith(fence)) fence = null;
        return line;
      }
      if (fence !== null) return line;
      return absolutizeHtml(
        line
          .replace(/@assets\/images\//g, `${SITE_URL}/images/blog/`)
          .replace(/\]\(\//g, `](${SITE_URL}/`),
      );
    })
    .join("\n");
}

const isoDate = (iso: string) => iso.slice(0, 10);

/** One post as a self-contained Markdown document. */
export function postMarkdown(post: BlogPost): string {
  const updated = post.updated_at !== post.published_at ? ` · Updated: ${isoDate(post.updated_at)}` : "";
  return [
    `# ${post.title}`,
    "",
    `> ${post.excerpt}`,
    "",
    `Author: ${AUTHOR.name} (${AUTHOR.jobTitle})`,
    `Published: ${isoDate(post.published_at)}${updated}`,
    `URL: ${absoluteUrl(`/blog/${post.slug}`)}`,
    ...(post.tags.length ? [`Tags: ${post.tags.join(", ")}`] : []),
    "",
    "---",
    "",
    absolutizeMarkdown(post.markdown),
    "",
  ].join("\n");
}

/** The /llms.txt index. */
export function llmsIndex(posts: BlogPost[]): string {
  return [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `Personal site of ${AUTHOR.name}, ${AUTHOR.jobTitle.toLowerCase()}. Every post has a Markdown version: add \`.md\` to its URL. Contact: ${AUTHOR.email}.`,
    "",
    "## Writing",
    "",
    ...posts.map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}.md`)}): ${p.excerpt}`),
    "",
    "## Projects",
    "",
    ...PROJECT.map(
      (p) => `- [${p.name}](${absoluteUrl(`/projects/${p.slug}`)}): ${projectSummary(p)} Source: ${p.github}`,
    ),
    "",
    "## About",
    "",
    `- [About](${absoluteUrl("/about")}): background, current work, stack and skills`,
    `- [Life so far](${absoluteUrl("/life")}): work history, education and publications`,
    "",
    "## Optional",
    "",
    `- [Full text of every post](${absoluteUrl("/llms-full.txt")}): all posts in one Markdown file`,
    `- [RSS feed](${absoluteUrl("/blog/rss.xml")}): posts with full content`,
    "",
  ].join("\n");
}

/** The /llms-full.txt document: every published post, newest first. */
export function llmsFull(posts: BlogPost[]): string {
  const header = [
    `# ${SITE_NAME}: all posts`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    `${posts.length} posts, newest first. Index: ${absoluteUrl("/llms.txt")}`,
    "",
  ].join("\n");
  return [header, ...posts.map(postMarkdown)].join("\n\n---\n\n");
}

export const MARKDOWN_HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  "Cache-Control": "public, max-age=3600, s-maxage=86400",
};
