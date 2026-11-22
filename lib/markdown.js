import { marked } from "marked";
import matter from "gray-matter";
import { codeToHtml } from "shiki";

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: true,
});

function slugifyHeading(text) {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z0-9#]+;/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function escapeAttr(value) {
  return String(value).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

// Heading ids already used in the post being parsed; reset per parseMarkdown().
let usedHeadingIds = new Map();

// SEO: heading ids give Google "jump to" anchors; images get lazy loading
// and always carry alt text.
marked.use({
  renderer: {
    heading({ tokens, depth }) {
      const inner = this.parser.parseInline(tokens);
      const base = slugifyHeading(inner);
      const seen = usedHeadingIds.get(base) || 0;
      usedHeadingIds.set(base, seen + 1);
      const id = base && (seen === 0 ? base : `${base}-${seen + 1}`);
      // The post page already renders the title as the only <h1>.
      const level = Math.max(depth, 2);
      return id
        ? `<h${level} id="${id}">${inner}</h${level}>\n`
        : `<h${level}>${inner}</h${level}>\n`;
    },
    image({ href, title, text }) {
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : "";
      return `<img src="${escapeAttr(href)}" alt="${escapeAttr(text || "")}"${titleAttr} loading="lazy" decoding="async" />`;
    },
  },
});

/** Plain-text summary for meta descriptions: ~155 chars, cut on a word boundary. */
function buildExcerpt(markdown) {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/^\s{0,3}(#{1,6}|>|[-*+]|\d+\.)\s+/gm, "")
    .replace(/[*_~#|]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= 160) return plain;
  const cut = plain.slice(0, 155);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 100 ? cut.lastIndexOf(" ") : 155).trimEnd()}...`;
}

/**
 * Parse markdown file with frontmatter
 * @param {string} markdownContent - Raw markdown string with frontmatter
 * @returns {Promise<Object>} Parsed frontmatter and HTML content
 */
export async function parseMarkdown(markdownContent) {
  // Parse frontmatter
  const { data, content } = matter(markdownContent);
  const frontmatter = data;

  // Convert markdown to HTML
  usedHeadingIds = new Map();
  let htmlContent = await marked.parse(content);

  // Post-process code blocks with Shiki (multi-theme support)
  const codeBlockRegex =
    /<pre><code class="language-(\w+)">([\s\S]*?)<\/code><\/pre>/g;
  const matches = [...htmlContent.matchAll(codeBlockRegex)];

  for (const match of matches) {
    const [fullMatch, lang, code] = match;
    try {
      // Decode HTML entities
      const decodedCode = code
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      // Render with multiple themes for light/navy/sepia modes
      const highlighted = await codeToHtml(decodedCode, {
        lang,
        themes: {
          light: "github-light",
          navy: "github-dark",
          sepia: "min-light",
        },
        defaultColor: false,
      });
      htmlContent = htmlContent.replace(fullMatch, highlighted);
    } catch (err) {
      console.error(`Shiki highlight error for ${lang}:`, err);
      // Keep original code block on error
    }
  }

  // Fallback meta description when frontmatter has no `description`
  const excerpt = buildExcerpt(content);

  return {
    frontmatter,
    content,
    htmlContent,
    excerpt,
  };
}

/**
 * Process image paths in markdown content to handle your @assets convention
 * @param {string} htmlContent - HTML content from markdown
 * @returns {string} HTML with updated image paths
 */
export function processImagePaths(htmlContent) {
  // Replace @assets/images/ paths with /images/blog/
  return htmlContent.replace(/@assets\/images\//g, "/images/blog/");
}

/**
 * Determine category from tags
 * @param {string[]} tags - Array of tags
 * @returns {"project" | "findings"}
 */
export function determineCategoryFromTags(tags) {
  const projectKeywords = [
    "nextjs",
    "reactjs",
    "typescript",
    "honojs",
    "prisma",
    "api",
  ];
  const hasProjectTag = tags.some((tag) =>
    projectKeywords.includes(tag.toLowerCase()),
  );
  return hasProjectTag ? "project" : "findings";
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Returns [errors, warnings] for a post's frontmatter. Errors fail the build. */
export function validateFrontmatter(frontmatter, category) {
  const errors = [];
  const warnings = [];
  if (!frontmatter.title) errors.push("missing `title`");
  if (!frontmatter.slug) errors.push("missing `slug`");
  else if (!SLUG_PATTERN.test(frontmatter.slug))
    errors.push(`slug "${frontmatter.slug}" must be lowercase words joined by hyphens`);
  if (!frontmatter.pubDatetime) errors.push("missing `pubDatetime`");
  else if (Number.isNaN(new Date(frontmatter.pubDatetime).getTime()))
    errors.push("`pubDatetime` is not a valid date");
  if (!["project", "findings"].includes(category))
    errors.push(`category "${category}" must be "project" or "findings"`);

  const titleLength = (frontmatter.title || "").length + " — Ajay Mandal".length;
  if (titleLength > 60) warnings.push(`title is ${titleLength} chars with the site suffix; Google cuts off around 60`);
  if (!frontmatter.description) warnings.push("no `description`; an excerpt will be generated from the body");
  else if (frontmatter.description.length > 160)
    warnings.push(`description is ${frontmatter.description.length} chars; keep it under 160`);
  if (!frontmatter.tags || frontmatter.tags.length === 0) warnings.push("no `tags`");
  return [errors, warnings];
}

/** Convert an `ogImage` path (Astro-style relative or @assets) to a public URL path. */
function coverImagePath(ogImage) {
  if (!ogImage) return undefined;
  return ogImage
    .replace(/^\.\.\/\.\.\/assets\/images\//, "/images/blog/")
    .replace(/^\.\.\/assets\/images\//, "/images/blog/")
    .replace(/^assets\/images\//, "/images/blog/")
    .replace(/@assets\/images\//, "/images/blog/");
}

/**
 * Turn one Markdown file into a blog post.
 * @param {string} markdownContent - Raw markdown string with frontmatter
 * @returns {Promise<{post: object, errors: string[], warnings: string[]}>}
 */
export async function buildPost(markdownContent) {
  const { frontmatter, htmlContent, excerpt } = await parseMarkdown(markdownContent);
  const category =
    frontmatter.category || determineCategoryFromTags(frontmatter.tags || []);
  const [errors, warnings] = validateFrontmatter(frontmatter, category);
  if (errors.length > 0) return { post: null, errors, warnings };

  // pubDatetime is the original publish date and must not move when a post
  // is edited; modDatetime only feeds updated_at (dateModified).
  const publishedAt = new Date(frontmatter.pubDatetime).toISOString();
  const post = {
    id: frontmatter.slug,
    title: frontmatter.title,
    slug: frontmatter.slug,
    excerpt: frontmatter.description || excerpt,
    content: processImagePaths(htmlContent),
    cover_image: coverImagePath(frontmatter.ogImage),
    category,
    tags: frontmatter.tags || [],
    published: !frontmatter.draft,
    published_at: publishedAt,
    created_at: publishedAt,
    updated_at: frontmatter.modDatetime
      ? new Date(frontmatter.modDatetime).toISOString()
      : publishedAt,
  };
  return { post, errors, warnings };
}
