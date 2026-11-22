# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal portfolio + blog for Ajay Mandal (ajaymandal.com). Next.js 16 App Router, React 19, TypeScript, Tailwind 3 with shadcn/ui (new-york, `@/*` path alias to repo root). Deployed on Vercel. Default branch is `development`.

## Commands

```bash
npm run dev            # dev server on :3000
npm run build          # production build (also the main type-check — there is no test suite)
npm run lint           # next lint (eslint-config-next)
npm run check-posts    # validate ./blog-posts/*.md frontmatter (the build fails on the same errors)
```

Env vars live in `.env.local` (template: `.env.example`). None are required; `NEXT_PUBLIC_SITE_URL` is optional and used for OG/canonical URLs.

## Architecture

**Two halves:** a static single-page portfolio (`app/page.tsx` stacks section components from `components/pages/`, anchored by `#skills`, `#projects`, `#blog`, `#contact`) and a Markdown blog (`app/blog`, `app/blog/[slug]`) rendered from files in the repo.

**Portfolio content is data, not CMS.** Projects, jobs, education, publications and social links are hard-coded typed arrays in `data/*.tsx`. Edit those files to change what appears on the site.

**Blog pipeline (write → commit → build):**
1. Posts are Markdown files with Astro-style frontmatter (`title`, `slug`, `pubDatetime`, `modDatetime`, `draft`, `tags`, `category`, `ogImage`, `description`) in the committed `/blog-posts` folder. Publishing a post is committing its file; Vercel rebuilds the site.
2. `lib/blog.ts` reads every file at build time and renders it through `buildPost()` in `lib/markdown.js`: gray-matter → marked → Shiki. A frontmatter error or a duplicate slug fails the build. Drafts (`draft: true`) are skipped. `lib/blog-shared.ts` holds the `BlogPost` type and `formatBlogDate()` for client components, which must not import `lib/blog.ts` (it uses `fs`).
3. Shiki runs with three named themes (`light`, `navy`, `sepia`) and `defaultColor: false`, so code colors come from CSS variables that `app/globals.css` switches via `[data-theme=...]`. These three theme names must stay in sync across `lib/markdown.js`, `app/globals.css`, and `components/global/ReadingModeToggle.tsx` (which persists the choice in `localStorage["app-theme"]`; `app/blog/[slug]/layout.tsx` restores it).
4. Image paths `@assets/images/...` and `ogImage` relative paths are rewritten to `/images/blog/...`, so post images must exist under `public/images/blog/`.
5. Category is the frontmatter `category` if present, else `determineCategoryFromTags()` in `lib/markdown.js`. BLOG_WORKFLOW.md's keyword list is out of date; the code is authoritative.

**Caching:** all blog routes are static. `[slug]` uses `generateStaticParams` from `getAllPosts()` with `dynamicParams = false`, so unknown slugs 404, and the RSS route is `force-static`. New or edited posts go live with the next deploy.

**Styling:** much of the UI uses inline Tailwind arbitrary values and scoped `<style>` blocks with a fixed palette (`#E8192C` red, `#0D0F14` ink, `#4A5068`/`#8892AA` greys) and fonts exposed as CSS variables in `app/layout.tsx` (`--oxanium`, `--space-mono`, `--inter`, plus local `incognito`/`gitlabmono` from `components/fonts`). Match this neo-brutalist style (thick borders, hard offset shadows) when adding UI. Rendered article HTML is styled through `.article-content` in `globals.css`.

`blog-templates/` holds the author guide (README.md: frontmatter rules, writing quirks, SEO checklist) and post templates. Copy a template into `blog-posts/` to write a post; `npm run check-posts` validates it. BLOG_WORKFLOW.md describes the retired Supabase pipeline.

## Search rule

Every code search in this repo goes through the code-review-graph MCP tools first (`semantic_search_nodes`, `query_graph`, `get_impact_radius`, etc.). This covers finding a symbol, tracing usages, scoping a change, and answering "where is X". Use Grep/Glob/Read only for what the graph can't answer: non-code files (Markdown, CSS, JSON config), string literals, or reading a file the graph already pointed you to. When delegating a search to a subagent, tell it to use the graph tools too. If results look stale, run `code-review-graph update` (or `build` for a full re-parse) before falling back.

<!-- code-review-graph MCP tools -->
## MCP Tools: code-review-graph

**IMPORTANT: This project has a knowledge graph. ALWAYS use the
code-review-graph MCP tools BEFORE using Grep/Glob/Read to explore
the codebase.** The graph is faster, cheaper (fewer tokens), and gives
you structural context (callers, dependents, test coverage) that file
scanning cannot.

### When to use graph tools FIRST

- **Exploring code**: `semantic_search_nodes` or `query_graph` instead of Grep
- **Understanding impact**: `get_impact_radius` instead of manually tracing imports
- **Code review**: `detect_changes` + `get_review_context` instead of reading entire files
- **Finding relationships**: `query_graph` with callers_of/callees_of/imports_of/tests_for
- **Architecture questions**: `get_architecture_overview` + `list_communities`

Fall back to Grep/Glob/Read **only** when the graph doesn't cover what you need.

### Key Tools

| Tool | Use when |
| ------ | ---------- |
| `detect_changes` | Reviewing code changes — gives risk-scored analysis |
| `get_review_context` | Need source snippets for review — token-efficient |
| `get_impact_radius` | Understanding blast radius of a change |
| `get_affected_flows` | Finding which execution paths are impacted |
| `query_graph` | Tracing callers, callees, imports, tests, dependencies |
| `semantic_search_nodes` | Finding functions/classes by name or keyword |
| `get_architecture_overview` | Understanding high-level codebase structure |
| `refactor_tool` | Planning renames, finding dead code |

### Workflow

1. The graph auto-updates on file changes (via hooks).
2. Use `detect_changes` for code review.
3. Use `get_affected_flows` to understand impact.
4. Use `query_graph` pattern="tests_for" to check coverage.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
