/**
 * Script to upload blog posts from markdown files to Supabase
 * 
 * Usage:
 *   1. Place your markdown files in a 'blog-posts' folder at the root
 *      (start from a template in blog-templates/)
 *   2. Set SUPABASE environment variables in .env.local
 *   3. Check first: npm run upload-blogs -- --dry-run
 *   4. Upload:      npm run upload-blogs
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import {
  parseMarkdown,
  processImagePaths,
  determineCategoryFromTags,
} from "../lib/markdown.js";

// Load environment variables from .env.local
config({ path: ".env.local" });

// --dry-run parses and validates every post without touching Supabase
const DRY_RUN = process.argv.includes("--dry-run");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase client with service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key for uploads (bypasses RLS), fall back to anon key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

if (!DRY_RUN && (!supabaseUrl || !supabaseKey)) {
  console.error("❌ Error: Supabase credentials not found in environment variables");
  console.error("Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local");
  console.error("Or add an insert policy to allow anon key uploads");
  process.exit(1);
}

const supabase = DRY_RUN ? null : createClient(supabaseUrl, supabaseKey);

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Returns [errors, warnings] for a post's frontmatter. Errors block the upload. */
function validateFrontmatter(frontmatter, category) {
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

async function uploadBlogPost(filePath) {
  try {
    console.log(`\n📄 Processing: ${path.basename(filePath)}`);

    // Read markdown file
    const markdownContent = fs.readFileSync(filePath, "utf-8");

    // Parse markdown
    const { frontmatter, htmlContent, excerpt } = await parseMarkdown(markdownContent);

    // Process image paths
    const processedContent = processImagePaths(htmlContent);

    // Determine category from frontmatter or auto-detect from tags
    const category =
      frontmatter.category || determineCategoryFromTags(frontmatter.tags || []);

    const [errors, warnings] = validateFrontmatter(frontmatter, category);
    warnings.forEach((w) => console.warn(`   ⚠️  ${w}`));
    if (errors.length > 0) {
      errors.forEach((e) => console.error(`   ❌ ${e}`));
      return { success: false, error: errors.join("; ") };
    }

    // Process ogImage path to cover_image URL
    let coverImage = null;
    if (frontmatter.ogImage) {
      // Convert relative path like "../../assets/images/..." to "/images/blog/..."
      coverImage = frontmatter.ogImage
        .replace(/^\.\.\/\.\.\/assets\/images\//, '/images/blog/')
        .replace(/^\.\.\/assets\/images\//, '/images/blog/')
        .replace(/^assets\/images\//, '/images/blog/')
        .replace(/@assets\/images\//, '/images/blog/');
    }

    // Prepare blog post data
    const blogPost = {
      title: frontmatter.title,
      slug: frontmatter.slug,
      excerpt: frontmatter.description || excerpt,
      content: processedContent,
      cover_image: coverImage,
      category: category,
      tags: frontmatter.tags || [],
      published: !frontmatter.draft,
      // pubDatetime is the original publish date and must not move when a
      // post is edited; modDatetime only feeds updated_at (dateModified).
      published_at: new Date(frontmatter.pubDatetime).toISOString(),
    };

    if (DRY_RUN) {
      console.log(
        `   ✅ Valid: "${blogPost.title}" → /blog/${blogPost.slug} [${category}${blogPost.published ? "" : ", draft"}]`,
      );
      return { success: true };
    }

    // Check if post already exists
    const { data: existingPost } = await supabase
      .from("posts")
      .select("id")
      .eq("slug", blogPost.slug)
      .single();

    if (existingPost) {
      // Update existing post
      const { error } = await supabase
        .from("posts")
        .update({
          ...blogPost,
          updated_at: frontmatter.modDatetime
            ? new Date(frontmatter.modDatetime).toISOString()
            : new Date().toISOString(),
        })
        .eq("slug", blogPost.slug);

      if (error) {
        console.error(`❌ Error updating post "${blogPost.title}":`, error.message);
        return { success: false, error };
      }
      console.log(`✅ Updated: ${blogPost.title}`);
    } else {
      // Insert new post
      const { error } = await supabase.from("posts").insert([
        frontmatter.modDatetime
          ? { ...blogPost, updated_at: new Date(frontmatter.modDatetime).toISOString() }
          : blogPost,
      ]);

      if (error) {
        console.error(`❌ Error inserting post "${blogPost.title}":`, error.message);
        return { success: false, error };
      }
      console.log(`✅ Inserted: ${blogPost.title}`);
    }

    return { success: true };
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return { success: false, error };
  }
}

async function uploadAllBlogs() {
  console.log(DRY_RUN ? "🔍 Dry run: validating posts, nothing will be uploaded\n" : "🚀 Starting blog upload process...\n");

  // Get all markdown files from blog-posts directory
  const blogPostsDir = path.join(process.cwd(), "blog-posts");

  if (!fs.existsSync(blogPostsDir)) {
    console.error(`❌ Error: blog-posts directory not found at ${blogPostsDir}`);
    console.log("Please create a 'blog-posts' folder and add your markdown files");
    process.exit(1);
  }

  const files = fs
    .readdirSync(blogPostsDir)
    .filter((file) => file.endsWith(".md"));

  if (files.length === 0) {
    console.log("⚠️  No markdown files found in blog-posts directory");
    process.exit(0);
  }

  console.log(`Found ${files.length} markdown file(s)\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const file of files) {
    const filePath = path.join(blogPostsDir, file);
    const result = await uploadBlogPost(filePath);

    if (result.success) {
      successCount++;
    } else {
      errorCount++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("📊 Upload Summary:");
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log("=".repeat(50));
}

// Run the upload process
uploadAllBlogs().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
