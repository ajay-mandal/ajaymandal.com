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

export const SITE_TITLE = "Ajay Mandal — Backend & Full-Stack Engineer";

export const SITE_DESCRIPTION =
  "Ajay Mandal is a backend and full-stack engineer building AI platforms, distributed systems and open-source tools with TypeScript, NestJS, Next.js, Postgres and Google Cloud. Read project deep-dives and engineering write-ups.";

export const SITE_KEYWORDS = [
  "Ajay Mandal",
  "backend engineer",
  "full-stack engineer",
  "software engineer portfolio",
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
  jobTitle: "Backend Engineer",
  twitter: "@ajaymandal01",
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
  ],
};

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
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
