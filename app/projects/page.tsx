import Link from "next/link";
import { PROJECT } from "@/data/Projects";
import JsonLd from "@/components/global/JsonLd";
import { PERSON_ID, SITE_URL, WEBSITE_ID, absoluteUrl, pageMetadata } from "@/lib/site";

const PROJECTS_DESCRIPTION =
  "Apps and open-source projects by Ajay Mandal: full-stack platforms, edge-native services and backend systems built with Next.js, NestJS, Postgres, Redis and Google Cloud.";

export const metadata = pageMetadata({
  title: "Projects",
  description: PROJECTS_DESCRIPTION,
  path: "/projects",
  ogSubtitle: "Apps & open-source work",
});

const projectsJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/projects#page"),
    url: absoluteUrl("/projects"),
    name: "Projects — Ajay Mandal",
    description: PROJECTS_DESCRIPTION,
    isPartOf: { "@id": WEBSITE_ID },
    author: { "@id": PERSON_ID },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: PROJECT.map((project, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: absoluteUrl(`/projects/${project.slug}`),
        name: project.name,
      })),
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Projects", item: absoluteUrl("/projects") },
    ],
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#F0F2F5]">
      <JsonLd data={projectsJsonLd} />

      <header className="relative bg-white pb-12 sm:pb-16 lg:pt-32 lg:pb-20 border-b-[3px] sm:border-b-[4px] lg:border-b-[6px] border-[#0D0F14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-0">
          <div className="flex items-center gap-2 mb-6 sm:mb-8">
            <span className="w-8 sm:w-12 lg:w-16 h-[2px] bg-[#E8192C]" />
            <span className="font-[family-name:var(--space-mono)] text-[10px] lg:text-[11px] tracking-[0.2em] uppercase text-[#E8192C] font-bold">
              Apps &amp; Open Source
            </span>
          </div>
          <h1 className="font-[family-name:var(--oxanium)] font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] mb-6 text-[#0D0F14]">
            Selected <span className="text-[#E8192C]">Work</span>
          </h1>
          <p className="font-[family-name:var(--space-mono)] text-sm sm:text-base leading-relaxed text-[#4A5068] max-w-2xl">
            {PROJECTS_DESCRIPTION}
          </p>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <ul className="grid gap-6 sm:grid-cols-2">
          {PROJECT.map((project) => (
            <li key={project.slug}>
              <Link
                href={`/projects/${project.slug}`}
                className="group flex h-full flex-col bg-white border-[3px] border-[#0D0F14] p-6 sm:p-8 shadow-[4px_4px_0_#0D0F14] hover:shadow-[6px_6px_0_#E8192C] hover:-translate-x-[2px] hover:-translate-y-[2px] transition-all"
              >
                <span className="font-[family-name:var(--space-mono)] text-[10px] tracking-[0.2em] uppercase text-[#E8192C] mb-3">
                  {project.category} · {project.year}
                </span>
                <h2 className="font-[family-name:var(--oxanium)] font-black text-2xl sm:text-3xl leading-tight text-[#1A1D24] mb-3 group-hover:text-[#E8192C] transition-colors">
                  {project.name}
                </h2>
                <p className="font-[family-name:var(--space-mono)] text-xs sm:text-sm leading-relaxed text-[#4A5068] mb-5">
                  {project.tagline}
                </p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="font-[family-name:var(--space-mono)] text-[9px] tracking-[0.1em] uppercase border-2 border-[rgba(13,15,20,.18)] text-[#4A5068] px-2.5 py-1"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
