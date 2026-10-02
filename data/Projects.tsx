export type Metric = {
  value: string;
  label: string;
};

export type ProjectProps = {
  /** URL segment for /projects/[slug]. Keep stable once published: changing it breaks indexed links. */
  slug: string;
  name: string;
  tagline: string;
  /** Long-form paragraphs shown on the project page. More real detail here = more search queries it can rank for. */
  overview?: string[];
  /** Bullet list of key features shown on the project page. */
  features?: string[];
  /** Optional screenshot under /public, used for the project page and its share image. */
  image?: string;
  blogLink?: string;
  github: string;
  live?: string;
  category: string;
  year: string;
  stack: string[];
  metrics?: Metric[];
};


export const PROJECT: ProjectProps[] = [
    {
        slug: 'drymdf',
        name: 'DryMDF',
        tagline: 'Production-grade Markdown-to-PDF platform with Next.js and NestJS. Features a rich editor, live PDF preview, async export, Mermaid diagrams, and scalable job queue — engineered for high-quality document workflows.',
        github: 'https://github.com/ajay-mandal/DryMDF',
        category: 'FULL-STACK',
        year: '2026',
        stack: ['NEXT.JS', 'NESTJS', 'REDIS', 'TAILWIND', 'CODEMIRROR', 'BULL', 'SOCKET.IO', 'PUPPETEER'],
        metrics: [
            { value: 'Markdown', label: 'EDITOR' },
            { value: 'PDF/HTML', label: 'EXPORT' },
            { value: 'Mermaid', label: 'DIAGRAMS' },
            { value: 'Live', label: 'PREVIEW' },
        ],
    },
 {
        slug: 'youtube-clone',
        name: 'Youtube Clone',
        tagline: 'Full-stack video platform built with Next.js, Firebase, and Google Cloud. Features chunked video uploads, adaptive streaming, user authentication, and a recommendation feed — engineered to handle large media pipelines at scale.',
        blogLink: '/blog/youtube-clone-backend',
        github: 'https://github.com/ajay-mandal/youtube-clone',
        category: 'BACKEND',
        year: '2024',
        stack: ['NEXT.JS', 'FIREBASE', 'GOOGLE CLOUD', 'FFMPEG'],
    },
    {
        slug: 'noteme-app',
        name: 'NoteMe App',
        tagline: 'Edge-native blog publishing platform powered by Next.js, Hono, and Cloudflare Workers. Delivers sub-50ms response times globally with zero cold starts, Markdown rendering, and a clean authoring experience.',
        blogLink: '/blog/noteme-app',
        github: 'https://github.com/ajay-mandal/NoteMe-App',
        live: 'https://noteme.ajaymandal.com/',
        category: 'EDGE PLATFORM',
        year: '2024',
        stack: ['NEXT.JS', 'HONO.JS', 'CF WORKERS', 'EDGE RUNTIME'],
    },
    {
        slug: 'ecommerce-admin-dashboard',
        name: 'E-Commerce and Admin Dashboard',
        tagline: 'Production-grade e-commerce system with a decoupled storefront and a custom admin dashboard. Built on Next.js, Typescript, and PostgreSQL — with Stripe integration, real-time order tracking, analytics, and full product lifecycle management.',
        github: 'https://github.com/ajay-mandal/cms_ecommerce_store',
        live: 'https://ecommerce.ajaymandal.com/',
        category: 'E-COMMERCE',
        year: '2025',
        stack: ['NEXT.JS', 'PRISMA ORM', 'POSTGRES', 'STRIPE', 'ZUSTAND', 'TAILWINDCSS'],
    }
]

export function getProjectBySlug(slug: string): ProjectProps | undefined {
  return PROJECT.find((p) => p.slug === slug);
}
