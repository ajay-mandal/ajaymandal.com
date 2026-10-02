import type { Metadata } from "next";
import { Inter, Oxanium, Space_Mono } from "next/font/google";
import "./globals.css";
import { incognito, gitlabmono } from "@/components/fonts/fonts";
import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import CursorGlow from "@/components/global/CursorGlow";
import ScrollToTop from "@/components/global/ScrollToTop";
import {
  AUTHOR,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  ogImageUrl,
} from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--inter",
});

const oxanium = Oxanium({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  display: "swap",
  variable: "--oxanium",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
  variable: "--space-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  applicationName: SITE_NAME,
  authors: [{ name: AUTHOR.name, url: SITE_URL }],
  creator: AUTHOR.name,
  publisher: AUTHOR.name,
  // canonical and openGraph.url are set per page: child segments inherit
  // these from the root, so a root canonical would point every page at "/".
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/blog/rss.xml", title: `${SITE_NAME} — Blog` }],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [{ url: ogImageUrl(SITE_NAME, "Backend & Full-Stack Engineer"), width: 1200, height: 630, alt: SITE_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    site: AUTHOR.twitter,
    creator: AUTHOR.twitter,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [ogImageUrl(SITE_NAME, "Backend & Full-Stack Engineer")],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
      : undefined,
  },
  icons: {
    icon: [
      {
        url: "/logo.svg",
        type: "image/svg+xml",
      },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${incognito.variable} ${inter.className} ${gitlabmono.variable} ${oxanium.variable} ${spaceMono.variable} font-mono text-ink`}
      >
        <CursorGlow />
        <Navbar />
        <main className="pb-0">
          {children}
        </main>
        <ScrollToTop />
        <Footer />
      </body>
    </html>
  );
}
