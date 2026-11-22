import type { MetadataRoute } from "next";
import { AI_CRAWLERS, SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Vercel preview deployments must never be indexed, or they compete with
  // the real site as duplicate content.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // Named explicitly so AI search and answer engines know they may read
      // and cite the site. /llms.txt is the index written for them.
      { userAgent: AI_CRAWLERS, allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
