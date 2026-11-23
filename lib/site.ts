import type { Metadata } from "next";

/**
 * Single source of truth for SEO: canonical origin, author identity and
 * default copy. Everything that emits an absolute URL (metadata, sitemap,
 * robots, RSS, JSON-LD) should go through `absoluteUrl()`.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.ajaymandal.com"
).replace(/\/$/, "");

export const SITE_NAME = "Ajay Mandal";

export const SITE_TITLE = "Ajay Mandal — Software Engineer & Architect";

export const SITE_DESCRIPTION =
  "Ajay Mandal is a software engineer and architect who builds backends for AI products. Technical write-ups on backend systems, AI agents, cloud and developer tools.";

export const SITE_KEYWORDS = [
  "Ajay Mandal",
  "software engineer",
  "software architect",
  "backend engineer",
  "AI agents",
  "multi-agent systems",
  "RAG pipelines",
  "Claude Code",
  "TypeScript",
  "NestJS",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Google Cloud",
  "system design",
  "open source",
  "engineering blog",
];

export const AUTHOR = {
  name: "Ajay Mandal",
  /** The brand line: header tagline, site title, share-image subtitle, Person.jobTitle. */
  jobTitle: "Software Engineer & Architect",
  twitter: "@ajaymandal01",
  email: "ajaymandal.work07@gmail.com",
  /** Profiles Google uses to connect this site to the same person (Person.sameAs). */
  sameAs: [
    "https://github.com/ajay-mandal",
    "https://linkedin.com/in/ajay-mandal",
    "https://x.com/ajaymandal01",
    "https://youtube.com/@zexa_yt",
  ],
  alumniOf: "Jain University",
  knowsAbout: [
    "TypeScript",
    "NestJS",
    "Next.js",
    "PostgreSQL",
    "Redis",
    "Google Cloud",
    "Distributed systems",
    "RAG pipelines",
    "Multi-agent systems",
    "Claude Code",
    "Backend architecture",
    "Event-driven architecture",
  ],
};

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Rewrite root-relative src/href attributes in HTML to absolute URLs. */
export function absolutizeHtml(html: string): string {
  return html.replace(/\b(src|href)="\//g, `$1="${SITE_URL}/`);
}

/** Generated 1200×630 share image (see app/og/route.tsx). */
export function ogImageUrl(title: string, subtitle?: string): string {
  const params = new URLSearchParams({ title });
  if (subtitle) params.set("subtitle", subtitle);
  return absoluteUrl(`/og?${params.toString()}`);
}

/**
 * Per-page metadata with canonical, Open Graph and Twitter in sync. Next.js
 * replaces (not merges) `openGraph`/`twitter` objects from the root layout,
 * so every page needs the full set.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  ogSubtitle,
}: {
  /** Page title; the root layout template appends " — Ajay Mandal". Omit for the homepage. */
  title?: string;
  description: string;
  path: string;
  image?: string;
  ogSubtitle?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = image ? absoluteUrl(image) : ogImageUrl(title ?? SITE_NAME, ogSubtitle);
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_TITLE;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": [{ url: "/blog/rss.xml", title: `${SITE_NAME} — Blog` }],
        "text/markdown": [{ url: "/llms.txt", title: "llms.txt" }],
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      url,
      title: fullTitle,
      description,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      site: AUTHOR.twitter,
      creator: AUTHOR.twitter,
      title: fullTitle,
      description,
      images: [imageUrl],
    },
  };
}

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * AI crawlers and answer-engine agents named in robots.txt so they are
 * explicitly allowed (some tools only trust an explicit group). Includes
 * robots-only tokens such as Google-Extended that never appear as a UA.
 */
export const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "meta-externalagent",
  "Amazonbot",
  "DuckAssistBot",
  "MistralAI-User",
  "CCBot",
];

/**
 * The one Person entity every page's JSON-LD refers to (by @id). The current
 * employer is deliberately left out: it is named only on /life.
 */
export function personJsonLd(extra: Record<string, unknown> = {}) {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: AUTHOR.name,
    url: SITE_URL,
    image: absoluteUrl("/pp3.png"),
    jobTitle: AUTHOR.jobTitle,
    description: SITE_DESCRIPTION,
    email: `mailto:${AUTHOR.email}`,
    alumniOf: { "@type": "CollegeOrUniversity", name: AUTHOR.alumniOf },
    knowsAbout: AUTHOR.knowsAbout,
    sameAs: AUTHOR.sameAs,
    ...extra,
  };
}
