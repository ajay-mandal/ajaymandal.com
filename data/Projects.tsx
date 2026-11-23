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
  /** More screenshots shown on the project page after the description. */
  gallery?: { src: string; alt: string }[];
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
        image: '/images/projects/drymdf.jpg',
        gallery: [
            { src: '/images/projects/drymdf-editor.jpg', alt: 'DryMDF editor with Markdown on the left and the live preview, including a Mermaid diagram, on the right' },
        ],
        category: 'FULL-STACK',
        year: '2026',
        stack: ['Next.js', 'NestJS', 'Redis', 'Tailwind', 'CodeMirror', 'Bull', 'Socket.IO', 'Puppeteer'],
        metrics: [
            { value: 'Markdown', label: 'EDITOR' },
            { value: 'PDF/HTML', label: 'EXPORT' },
            { value: 'Mermaid', label: 'DIAGRAMS' },
            { value: 'Live', label: 'PREVIEW' },
        ],
    }
]

/** One-line summary: the first sentence of the tagline. */
export function projectSummary(project: Pick<ProjectProps, "tagline">): string {
  return project.tagline.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? project.tagline;
}

export function getProjectBySlug(slug: string): ProjectProps | undefined {
  return PROJECT.find((p) => p.slug === slug);
}
