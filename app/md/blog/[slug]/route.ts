import { getAllPosts, getPostBySlug } from "@/lib/blog";
import { MARKDOWN_HEADERS, postMarkdown } from "@/lib/llms";
import { absoluteUrl } from "@/lib/site";

// Served at /blog/<slug>.md through a rewrite in next.config.mjs.
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getAllPosts()).map((post) => ({ slug: post.slug }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const post = await getPostBySlug((await params).slug);
  if (!post) return new Response("Not found", { status: 404 });
  return new Response(postMarkdown(post), {
    headers: {
      ...MARKDOWN_HEADERS,
      // The HTML page is the canonical version for search engines.
      Link: `<${absoluteUrl(`/blog/${post.slug}`)}>; rel="canonical"`,
    },
  });
}
