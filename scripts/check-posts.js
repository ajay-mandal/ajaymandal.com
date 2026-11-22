/**
 * Validate every blog post in blog-posts/ without building the site.
 *
 * Posts are rendered at build time from blog-posts/*.md, so publishing is just
 * committing the file. Run this first to catch frontmatter mistakes:
 *
 *   npm run check-posts
 *
 * Errors here also fail `npm run build`; warnings are SEO hints only.
 */

import fs from "fs";
import path from "path";
import { buildPost } from "../lib/markdown.js";

async function checkAllPosts() {
  const blogPostsDir = path.join(process.cwd(), "blog-posts");

  if (!fs.existsSync(blogPostsDir)) {
    console.error(`❌ Error: blog-posts directory not found at ${blogPostsDir}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(blogPostsDir)
    .filter((file) => file.endsWith(".md"));

  if (files.length === 0) {
    console.log("⚠️  No markdown files found in blog-posts directory");
    process.exit(0);
  }

  console.log(`🔍 Checking ${files.length} post(s)\n`);

  let errorCount = 0;
  for (const file of files) {
    console.log(`📄 ${file}`);
    const raw = fs.readFileSync(path.join(blogPostsDir, file), "utf-8");
    const { post, errors, warnings } = await buildPost(raw);
    warnings.forEach((w) => console.warn(`   ⚠️  ${w}`));
    if (errors.length > 0) {
      errors.forEach((e) => console.error(`   ❌ ${e}`));
      errorCount++;
      continue;
    }
    console.log(
      `   ✅ Valid: "${post.title}" → /blog/${post.slug} [${post.category}${post.published ? "" : ", draft"}]`,
    );
  }

  console.log(`\n${errorCount === 0 ? "✅ All posts valid" : `❌ ${errorCount} post(s) with errors`}`);
  if (errorCount > 0) process.exit(1);
}

checkAllPosts().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
