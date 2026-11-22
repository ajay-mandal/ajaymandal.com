import { getAllPosts } from "@/lib/blog";
import { MARKDOWN_HEADERS, llmsIndex } from "@/lib/llms";

// Built once at deploy time from blog-posts/*.md and data/.
export const dynamic = "force-static";

export async function GET() {
  return new Response(llmsIndex(await getAllPosts()), { headers: MARKDOWN_HEADERS });
}
