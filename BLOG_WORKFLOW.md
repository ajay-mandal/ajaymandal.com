# Blog Workflow Guide

> **Writing a new post?** Start with [blog-templates/README.md](blog-templates/README.md). It has the current frontmatter rules, templates and the `--dry-run` check. This file is older background on the Supabase setup and pipeline.

Complete guide for managing your blog posts with Markdown and Supabase.

## Table of Contents

- [Overview](#overview)
- [Setup](#setup)
- [Writing Blog Posts](#writing-blog-posts)
- [Uploading to Supabase](#uploading-to-supabase)
- [Managing Images](#managing-images)
- [Troubleshooting](#troubleshooting)

---

## Overview

Your blog system works as follows:

1. **Write** posts in Markdown with frontmatter
2. **Upload** to Supabase using the upload script
3. **Render** automatically on your website

### Technology Stack

- **Markdown**: For writing content
- **Gray-Matter**: Parse frontmatter
- **Marked**: Convert Markdown to HTML
- **Shiki**: Code syntax highlighting with inline styles
- **Supabase**: PostgreSQL database storage with RLS
- **Next.js 15**: App Router with server/client components

---

## Setup

### 1. Supabase Configuration

First, ensure your Supabase database has the `posts` table created. Run this SQL in your Supabase SQL Editor:

```sql
create table if not exists posts (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  slug          text not null unique,
  excerpt       text not null default '',
  content       text not null default '',
  cover_image   text,
  category      text not null check (category in ('project', 'findings')),
  tags          text[] not null default '{}',
  published     boolean not null default false,
  published_at  timestamptz,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Row-level security: public read for published posts only
alter table posts enable row level security;

create policy "Public can read published posts"
  on posts for select
  using (published = true);

-- (Optional) Full access for authenticated users (you as admin)
create policy "Authenticated full access"
  on posts for all
  using (auth.role() = 'authenticated');
```

### 2. Environment Variables

Ensure your `.env.local` has:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important**: The upload script uses `SUPABASE_SERVICE_ROLE_KEY` to bypass RLS policies and insert posts directly.

### 3. Install Dependencies

Already installed for you:

```bash
npm install marked gray-matter shiki
```

---

## Writing Blog Posts

### Frontmatter Structure

Every blog post must start with YAML frontmatter:

```markdown
---
title: Your Blog Post Title
author: Ajay Mandal
pubDatetime: 2024-11-09T18:09:47.201Z
modDatetime: 2024-12-10T06:29:08.126Z # optional
slug: your-blog-post-slug
featured: true
draft: false
category: project # or 'findings' - NEW FIELD!
tags:
  - nextjs
  - typescript
  - authentication
ogImage: ../../assets/images/your-image.png # optional
description: Brief description of your post (used as excerpt)
---

# Your Content Starts Here

Write your blog content in Markdown...
```

### Field Descriptions

| Field         | Required | Description                                        |
| ------------- | -------- | -------------------------------------------------- |
| `title`       | ✅       | Post title (shown in listings and page header)     |
| `author`      | ✅       | Author name                                        |
| `pubDatetime` | ✅       | Publication date in ISO format                     |
| `modDatetime` | ❌       | Modified date (if updated later)                   |
| `slug`        | ✅       | URL-friendly identifier (must be unique)           |
| `featured`    | ✅       | Whether to feature the post                        |
| `draft`       | ✅       | If `true`, won't be published                      |
| `category`    | ❌       | `project` or `findings` (auto-detected if omitted) |
| `tags`        | ✅       | Array of tags for categorization                   |
| `ogImage`     | ❌       | Social media preview image                         |
| `description` | ✅       | Short description (SEO & preview)                  |

### Category System

**New in v2**: You can now explicitly set the category in frontmatter!

```yaml
category: project # or 'findings'
```

If you don't specify a category, it's automatically determined from tags:

- **Project**: Posts with tags like `nextjs`, `reactjs`, `typescript`, `honojs`, `prisma`, `api`, `nodejs`, `express`, `mongodb`, `docker`
- **Findings**: All other posts (CSS, JavaScript concepts, performance tips, etc.)

**Upload Priority**: The upload script checks for `category` in frontmatter first, then falls back to auto-detection.

You can modify the auto-detection logic in `/scripts/upload-blogs.js`:

```javascript
function determineCategoryFromTags(tags) {
  const projectKeywords = [
    "nextjs",
    "reactjs",
    "typescript",
    "honojs",
    "prisma",
    "api",
    "nodejs",
    "express",
    "mongodb",
    "docker",
  ];
  const hasProjectTag = tags.some((tag) =>
    projectKeywords.includes(tag.toLowerCase()),
  );
  return hasProjectTag ? "project" : "findings";
}
```

### Markdown Features Supported

✅ **Headings**

```markdown
# H1

## H2

### H3
```

✅ **Code Blocks with Syntax Highlighting (Shiki)**

Shiki provides beautiful syntax highlighting with inline styles (no external CSS needed):

````markdown
```typescript
function hello() {
  console.log("Hello World");
}
```
````

Supported languages: JavaScript, TypeScript, Python, Bash, SQL, YAML, JSON, HTML, CSS, and many more.

**Theme**: Uses `github-light` theme with inline `style` attributes for perfect rendering.

✅ **Links**

```markdown
[Link Text](https://example.com)
```

✅ **Images**

```markdown
![Alt Text](/images/blog/your-image.png)
```

✅ **Lists**

```markdown
- Bullet item
- Another item

1. Numbered item
2. Another item
```

✅ **Blockquotes**

```markdown
> This is a quote
```

✅ **Bold & Italic**

```markdown
**bold text**
_italic text_
```

---

## Uploading to Supabase

### Step 1: Organize Your Files

Create a `blog-posts` folder at the root of your project:

```
ajaymandal.me/
├── blog-posts/           ← Create this folder
│   ├── post-one.md
│   ├── post-two.md
│   └── post-three.md
├── app/
├── components/
└── ...
```

### Step 2: Add Your Markdown Files

Move your `.md` files from your old blog into `blog-posts/`:

```bash
# Example: Copy from your old Astro blog
cp ~/Desktop/projects/personal-blog-astro/src/content/blog/*.md ./blog-posts/
```

### Step 3: Run the Upload Script

```bash
npm run upload-blogs
```

**Note**: The upload script is a JavaScript file (`upload-blogs.js`), not TypeScript.

### What Happens During Upload

The script (`scripts/upload-blogs.js`):

1. ✅ Reads all `.md` files from `blog-posts/`
2. ✅ Parses frontmatter and content with gray-matter
3. ✅ Converts Markdown to HTML with marked
4. ✅ Applies Shiki syntax highlighting to code blocks (inline styles)
5. ✅ Processes image paths (`@assets/images/` → `/images/blog/`)
6. ✅ Reads category from frontmatter OR auto-detects from tags
7. ✅ Uses service role key to upsert to Supabase (insert new or update existing)

### Upload Output Example

```
🚀 Starting blog upload process...

Found 6 markdown file(s)

📄 Processing: google-oauth.md
✅ Inserted: Google OAuth Service

📄 Processing: noteme-app.md
✅ Inserted: NoteMe APP

📄 Processing: zustand-for-state-management-in-reactjs.md
✅ Updated: Zustand for state management in React.js

==================================================
📊 Upload Summary:
   ✅ Success: 6
   ❌ Errors: 0
==================================================
```

---

## Managing Images

### Image Path Convention

Your old blog used `@assets/images/` paths. The script automatically converts these to `/images/blog/`.

**In your Markdown files:**

```markdown
![Alt text](@assets/images/google-oauth/oauth-consent-screen.jpeg)
```

**Converted to:**

```html
<img src="/images/blog/google-oauth/oauth-consent-screen.jpeg" alt="Alt text" />
```

### Setting Up Image Directory

Create the public images folder:

```bash
mkdir -p public/images/blog
```

Copy your images:

```bash
# From old blog
cp -r ~/Desktop/projects/personal-blog-astro/src/assets/images/* ./public/images/blog/
```

### Using Cover Images

To add a cover image to a post:

1. Place image in `public/images/blog/`
2. Add to frontmatter:

```yaml
ogImage: ../../assets/images/your-image.png
```

The system will handle the path conversion automatically.

---

## Blog Features

### Search & Filtering

The blog page includes powerful client-side filtering:

- **Search Bar**: Filter by title, excerpt, or tags
- **Category Filter**: Show all posts, only projects, or only findings
- **Tag Filter**: Multi-select tags to filter posts
- **Clear Filters**: Reset all filters with one click

### Pagination

- **10 posts per page** to keep page load fast
- **Previous/Next buttons** for navigation
- **Page numbers** with ellipsis for long lists
- **Auto-scroll to top** when changing pages
- **Resets to page 1** when filters change

### Related Posts

Each blog post shows related articles based on:

- **Category match**: +3 points
- **Shared tags**: +1 point per tag
- Shows top 3 most relevant posts

### Navigation

- **Previous/Next post buttons** for sequential reading
- **Sticky sidebar** with related posts and quick links
- **Breadcrumb navigation** back to blog list

---

## Workflow Summary

### Creating a New Blog Post

1. **Write** a new `.md` file in `blog-posts/`:

   ```bash
   touch blog-posts/my-new-post.md
   ```

2. **Add frontmatter and content**:

   ```markdown
   ---
   title: My Awesome New Post
   author: Ajay Mandal
   pubDatetime: 2024-12-15T10:00:00.000Z
   slug: my-awesome-new-post
   featured: false
   draft: false
   category: project
   tags:
     - nextjs
     - typescript
   description: This is my new blog post about Next.js
   ---

   # Introduction

   Your content here...
   ```

3. **Upload to Supabase**:

   ```bash
   npm run upload-blogs
   ```

4. **Verify**: Visit `https://your-site.com/blog/my-awesome-new-post`

### Updating an Existing Post

1. **Edit** the `.md` file in `blog-posts/`
2. **Update** `modDatetime` in frontmatter (optional)
3. **Re-run** the upload script:
   ```bash
   npm run upload-blogs
   ```
4. The script will detect the existing slug and **update** the post

### Unpublishing a Post

Set `draft: true` in frontmatter and re-upload:

```yaml
draft: true
```

---

## Troubleshooting

### ❌ "Supabase credentials not found"

**Problem**: Environment variables missing or incorrectly named

**Solution**:

```bash
# Check .env.local exists
cat .env.local

# Should contain:
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...  # Required for uploads!
```

**Important**: The `SUPABASE_SERVICE_ROLE_KEY` is needed to bypass Row Level Security and insert posts.

---

### ❌ "blog-posts directory not found"

**Problem**: Folder doesn't exist

**Solution**:

```bash
mkdir blog-posts
```

---

### ❌ "Error inserting post: duplicate key value violates unique constraint"

**Problem**: Post with same `slug` already exists

**Solution**:

- Change the `slug` in frontmatter to a unique value
- Or delete the existing post in Supabase dashboard

---

### ❌ Images not showing

**Problem**: Image paths incorrect

**Solution**:

1. Ensure images are in `public/images/blog/`
2. Check image paths in markdown use `@assets/images/` (will be converted)
3. Or use direct paths: `![Alt](/images/blog/your-image.png)`

---

### ❌ Code highlighting not working

**Problem**: Missing language specification or Shiki not running

**Solution**:

1. Always specify language in code blocks:

````markdown
```typescript ← Add language here
const x = 5;
```
````

2. Ensure the upload script processed correctly - check for "✅ Inserted" message
3. Shiki generates inline styles, so highlighting should work without external CSS

---

### ❌ Post not showing on website

**Problem**: Post is in draft mode or not published

**Solution**:

- Check `draft: false` in frontmatter
- Check `published: true` in Supabase database
- Clear Next.js cache: `rm -rf .next && npm run dev`

---

## Advanced: Custom Styling

### Prose Styles

The individual post page uses Tailwind Typography with custom styling:

```tsx
className="prose prose-sm max-w-none
  prose-headings:font-oxanium prose-headings:text-ink
  prose-a:text-[#E8192C] prose-a:no-underline hover:prose-a:underline
  prose-code:text-[#E8192C] prose-code:bg-[rgba(232,25,44,.08)]
  prose-pre:bg-[#1A1D24] prose-pre:border-[3px]
  prose-blockquote:border-l-[3px] prose-blockquote:border-[#E8192C]"
```

Modify in `/app/blog/[slug]/page.tsx` to customize appearance.

### Code Block Styling

Shiki generates inline styles for syntax highlighting:

```html
<pre class="shiki github-light" style="background-color:#ffffff;color:#24292e">
  <code>
    <span style="color:#D73A49">const</span>
    <span style="color:#005CC5"> greeting</span>
    <!-- ... -->
  </code>
</pre>
```

No external CSS needed! Additional styling in `globals.css`:

```css
pre.shiki {
  @apply border-[3px] border-[#0D0F14] overflow-x-auto;
}
```

---

## NPM Scripts

Configured in `package.json`:

```json
{
  "scripts": {
    "upload-blogs": "node scripts/upload-blogs.js",
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  }
}
```

**Note**: The upload script is plain JavaScript (not TypeScript) to avoid compilation issues.

---

## Quick Reference

```bash
# Create blog post
touch blog-posts/new-post.md

# Upload all posts
npm run upload-blogs

# Copy images
cp -r old-blog/images/* public/images/blog/

# Check Supabase
# Visit: https://app.supabase.com/project/YOUR_PROJECT/editor

# Clear cache
rm -rf .next

# Restart dev server
npm run dev

# Check Supabase posts
# Visit: Supabase Dashboard → Table Editor → posts
```

---

## File Structure

```
ajaymandal.me/
├── app/
│   ├── blog/
│   │   ├── page.tsx           # Blog listing (server component)
│   │   └── [slug]/
│   │       └── page.tsx       # Individual post (server component)
│   ├── not-found.tsx          # Custom 404 page
│   ├── error.tsx              # Error boundary
│   └── global-error.tsx       # Critical error handler
├── components/
│   └── pages/
│       └── BlogList.tsx       # Client component (search/filter)
├── lib/
│   ├── blog.ts                # Supabase query functions
│   ├── markdown.js            # Markdown → HTML (for upload script)
│   └── supabase.ts            # Supabase client
├── scripts/
│   └── upload-blogs.js        # Upload markdown to Supabase
├── blog-posts/                # Your markdown files
│   ├── post-one.md
│   └── post-two.md
├── public/
│   └── images/
│       └── blog/              # Blog post images
└── .env.local                 # Environment variables
```

---

## Support

For issues or questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review Supabase logs in the dashboard
3. Check browser console for frontend errors
4. Verify environment variables are set correctly
5. Ensure `SUPABASE_SERVICE_ROLE_KEY` is present for uploads

---

## Key Technologies Summary

| Technology            | Purpose                                | Location                         |
| --------------------- | -------------------------------------- | -------------------------------- |
| **Shiki**             | Syntax highlighting with inline styles | `/lib/markdown.js`               |
| **Marked**            | Markdown → HTML conversion             | `/lib/markdown.js`               |
| **Gray-Matter**       | Parse YAML frontmatter                 | `/scripts/upload-blogs.js`       |
| **Supabase**          | PostgreSQL database with RLS           | `/lib/supabase.ts`               |
| **Next.js 15**        | App Router, React Server Components    | `/app/blog/`                     |
| **Client Components** | Search/filter interactivity            | `/components/pages/BlogList.tsx` |

### Architecture Overview

```
┌─────────────────┐
│ Markdown Files  │  Write posts in blog-posts/*.md
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Upload Script   │  scripts/upload-blogs.js
│ (Node.js)       │  • Parse frontmatter
│                 │  • marked + Shiki
│                 │  • Service role key
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Supabase DB     │  PostgreSQL with RLS
│ posts table     │  • Anon key for reads
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Next.js App     │  App Router
│                 │  • Server: Fetch data
│ Server: blog/   │  • Client: Search/filter
│ Client: List    │  • Pagination: 10/page
└─────────────────┘
```

---

**Happy Blogging! 🚀**

**Last Updated**: February 2026 | **Version**: 2.0
