// Crawler reporter (test). Sends AI-crawler requests to an Argus ingest endpoint in
// the background; the visitor's response is never delayed or changed.
// Token list generated from Argus packages/bot-signatures; same matching rule
// (case-insensitive, bounded by a character outside [a-z0-9-]).
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';

const CRAWLER_TOKENS = [
  "meta-externalfetcher",
  "facebookexternalhit",
  "meta-externalagent",
  "GoogleOther-Image",
  "GoogleOther-Video",
  "Claude-SearchBot",
  "Perplexity-User",
  "BingAI-Reader",
  "OAI-SearchBot",
  "PerplexityBot",
  "ChatGPT-User",
  "Claude-User",
  "GoogleOther",
  "GrokCrawler",
  "xAI-GrokBot",
  "ClaudeBot",
  "Googlebot",
  "bingbot",
  "GPTBot",
];
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const CRAWLER = new RegExp(`(^|[^a-z0-9-])(${CRAWLER_TOKENS.map(escape).join('|')})(?=$|[^a-z0-9-])`, 'i');

// Headers recorded during the test to learn which one carries the real client IP.
const PROBE_HEADERS = [
  'x-real-ip', 'x-forwarded-for', 'x-vercel-forwarded-for', 'cf-connecting-ip', 'true-client-ip',
  'x-vercel-ip-country', 'cf-ipcountry', 'cf-ray', 'x-vercel-id', 'x-vercel-cache',
];

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const userAgent = request.headers.get('user-agent') ?? '';
  const endpoint = process.env.ARGUS_STREAM_URL;
  const key = process.env.ARGUS_INGEST_KEY;
  if (endpoint && key && CRAWLER.test(userAgent)) {
    const h = request.headers;
    const record = {
      timestamp: new Date().toISOString(),
      host: h.get('host') ?? request.nextUrl.host,
      method: request.method,
      path: request.nextUrl.pathname + request.nextUrl.search,
      user_agent: userAgent,
      ip: h.get('x-real-ip') ?? undefined,
      country: h.get('x-vercel-ip-country') ?? undefined,
      request_id: h.get('x-vercel-id') ?? undefined,
      referer: h.get('referer') ?? '',
      _probe: Object.fromEntries(PROBE_HEADERS.map((name) => [name, h.get(name)]).filter(([, v]) => v)),
    };
    event.waitUntil(
      fetch(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': key,
          'user-agent': 'argus-reporter/nextjs-proxy',
          'ngrok-skip-browser-warning': '1',
        },
        body: JSON.stringify([record]),
        signal: AbortSignal.timeout(3000),
      }).catch(() => undefined),
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
};
