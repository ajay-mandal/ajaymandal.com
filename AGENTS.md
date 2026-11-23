# Repository Guidelines

## Project Structure & Module Organization

This personal portfolio and blog uses Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 3.

- `app/`: pages, layouts, route handlers, metadata, and `globals.css`.
- `components/site/`: shared interface components; `components/global/`: cross-site helpers such as JSON-LD.
- `lib/`: Markdown rendering, blog loading, SEO, and utility functions.
- `data/`: portfolio content, including projects, employment, and education.
- `blog-posts/`: committed Markdown posts; `public/`: static assets, including `images/blog/`.
- `scripts/check-posts.js`: post validation. No automated test suite is configured.

## Build, Test, and Development Commands

- `npm ci`: install dependencies from `package-lock.json`.
- `npm run dev`: start local development at `http://localhost:3000`.
- `npm run build`: create the production build and validate TypeScript and blog content.
- `npm start`: serve an existing production build.
- `npm run check-posts`: validate Markdown frontmatter and render posts without building the site.

`npm run lint` currently invokes the obsolete `next lint` command and fails under the installed Next.js version. ESLint configuration exists in `.eslintrc.json`; migrate the lint setup before relying on this script.

## Coding Style & Naming Conventions

Match existing code: two-space indentation, double quotes, and semicolons. Use TypeScript for new application modules, PascalCase component filenames, and camelCase functions. Follow App Router names such as `page.tsx`, `layout.tsx`, and `route.ts`. Use `@/` imports for repository-root paths.

Reuse classes and theme tokens in `app/globals.css`. Keep filesystem-backed `lib/blog.ts` out of client components; import shared types and helpers from `lib/blog-shared.ts` instead.

## Testing Guidelines

Run `npm run build` for application changes and `npm run check-posts` for content changes. Manually check affected routes, responsive layouts, and interactive behavior. There are no configured coverage thresholds or test filename conventions.

## Commit & Pull Request Guidelines

Follow the existing Conventional Commits style: `feat(blog): add sharing links`, `fix(build): correct font loading`, or `chore: remove unused assets`. Keep changes focused.

For pull requests, describe the resulting behavior, list validation performed, link relevant issues, and include screenshots for visual changes. Target `development` unless the task specifies another branch.

## Security & Configuration

Use `.env.example` as the configuration reference and keep secrets in ignored `.env.local`. Never commit credentials or generated `.next/` output. Review `CLAUDE.md` for additional architecture and content guidance.
