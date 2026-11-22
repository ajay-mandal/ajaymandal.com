/** @type {import('next').NextConfig} */
const nextConfig = {
  // The production *.vercel.app alias serves the same pages as the real
  // domain; send it (and the bare domain's crawl budget) to one canonical host.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "ajaymandal.vercel.app" }],
        destination: "https://www.ajaymandal.com/:path*",
        permanent: true,
      },
      // The writing list is the homepage now; post URLs stay under /blog/.
      { source: "/blog", destination: "/", permanent: true },
    ];
  },
  // Markdown copy of each post for agents (see lib/llms.ts).
  async rewrites() {
    return [{ source: "/blog/:slug.md", destination: "/md/blog/:slug" }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.microlink.io",
        port: ''
      }
    ],
  },
}

export default nextConfig
