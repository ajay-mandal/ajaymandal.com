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
    ];
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
