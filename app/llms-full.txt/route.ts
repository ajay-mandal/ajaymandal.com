import { getAllPosts } from "@/lib/blog";
import { MARKDOWN_HEADERS, llmsFull } from "@/lib/llms";

// Built once at deploy time from blog-posts/*.md.
export const dynamic = "force-static";

export async function GET() {
  return new Response(llmsFull(await getAllPosts()), { headers: MARKDOWN_HEADERS });
}
