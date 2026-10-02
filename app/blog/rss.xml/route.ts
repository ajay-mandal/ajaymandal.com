import { getAllPosts } from "@/lib/blog";
import { AUTHOR, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/site";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await getAllPosts();

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);
      const categories = (post.tags ?? [])
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("");
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.published_at).toUTCString()}</pubDate>
      <description>${escapeXml(post.excerpt ?? "")}</description>
      <dc:creator>${escapeXml(AUTHOR.name)}</dc:creator>${categories}
    </item>`;
    })
    .join("");

  const lastBuild = posts[0]?.updated_at ?? posts[0]?.published_at ?? new Date().toISOString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(`${SITE_NAME} — Blog`)}</title>
    <link>${SITE_URL}/blog</link>
    <description>Project deep-dives and engineering findings by ${escapeXml(AUTHOR.name)}.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
