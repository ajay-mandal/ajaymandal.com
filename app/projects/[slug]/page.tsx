import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROJECT, getProjectBySlug, type ProjectProps } from "@/data/Projects";
import JsonLd from "@/components/global/JsonLd";
import { AUTHOR, PERSON_ID, SITE_URL, absoluteUrl, pageMetadata } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROJECT.map((project) => ({ slug: project.slug }));
}

function projectDescription(project: ProjectProps): string {
  return project.tagline.length > 160 ? `${project.tagline.slice(0, 157).trimEnd()}...` : project.tagline;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found", robots: { index: false, follow: true } };

  return {
    ...pageMetadata({
      title: project.name,
      description: projectDescription(project),
      path: `/projects/${project.slug}`,
      image: project.image,
      ogSubtitle: `${project.category} · ${project.stack.slice(0, 3).join(" · ")}`,
    }),
    keywords: [project.name, ...project.stack.map((s) => s.toLowerCase()), "open source", AUTHOR.name],
  };
}

function projectJsonLd(project: ProjectProps) {
  const url = absoluteUrl(`/projects/${project.slug}`);
  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      "@id": `${url}#software`,
      name: project.name,
      description: project.tagline,
      url,
      codeRepository: project.github,
      ...(project.live ? { targetProduct: { "@type": "WebApplication", name: project.name, url: project.live, applicationCategory: "DeveloperApplication", operatingSystem: "Web" } } : {}),
      ...(project.image ? { image: absoluteUrl(project.image) } : {}),
      keywords: project.stack.join(", "),
      dateCreated: project.year,
      author: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR.name, url: SITE_URL },
      ...(project.blogLink ? { subjectOf: { "@type": "BlogPosting", url: absoluteUrl(project.blogLink) } } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Projects", item: absoluteUrl("/projects") },
        { "@type": "ListItem", position: 3, name: project.name, item: url },
      ],
    },
  ];
}

const LINK_CLASS =
  "inline-flex items-center px-5 py-3 border-[3px] border-[#0D0F14] font-[family-name:var(--space-mono)] text-[11px] tracking-[0.18em] uppercase transition-all shadow-[4px_4px_0_#0D0F14] hover:shadow-[4px_4px_0_#E8192C]";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const others = PROJECT.filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <article className="min-h-screen bg-[#F0F2F5]">
      <JsonLd data={projectJsonLd(project)} />

      <header className="bg-white pb-12 sm:pb-16 lg:pt-32 lg:pb-20 border-b-[3px] sm:border-b-[4px] lg:border-b-[6px] border-[#0D0F14]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 lg:pt-0">
          <nav aria-label="Breadcrumb" className="mb-8 font-[family-name:var(--space-mono)] text-[10px] sm:text-xs tracking-[0.15em] uppercase text-[#8892AA]">
            <Link href="/" className="hover:text-[#E8192C]">Home</Link>
            <span className="mx-2 text-[#E8192C]">/</span>
            <Link href="/projects" className="hover:text-[#E8192C]">Projects</Link>
            <span className="mx-2 text-[#E8192C]">/</span>
            <span className="text-[#4A5068]">{project.name}</span>
          </nav>

          <span className="font-[family-name:var(--space-mono)] text-[10px] sm:text-[11px] tracking-[0.2em] uppercase text-[#E8192C] font-bold">
            {project.category} · {project.year}
          </span>
          <h1 className="mt-3 mb-6 font-[family-name:var(--oxanium)] font-black text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-[#0D0F14] break-words">
            {project.name}
          </h1>
          <p className="font-[family-name:var(--space-mono)] text-sm sm:text-base leading-relaxed text-[#4A5068] max-w-3xl mb-8">
            {project.tagline}
          </p>

          <div className="flex flex-wrap gap-4">
            <a href={project.github} target="_blank" rel="noopener" className={`${LINK_CLASS} bg-[#0D0F14] text-white`}>
              Source on GitHub →
            </a>
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener" className={`${LINK_CLASS} bg-[#E8192C] border-[#E8192C] text-white`}>
                Live App →
              </a>
            )}
            {project.blogLink && (
              <Link href={project.blogLink} className={`${LINK_CLASS} bg-white text-[#0D0F14]`}>
                Read the Case Study →
              </Link>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
        {project.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image}
            alt={`${project.name} screenshot`}
            className="w-full border-[3px] border-[#0D0F14] shadow-[6px_6px_0_#E8192C]"
          />
        )}

        {project.overview && project.overview.length > 0 && (
          <section className="bg-white border-[3px] border-[#0D0F14] p-6 sm:p-8">
            <h2 className="font-[family-name:var(--oxanium)] font-black text-2xl sm:text-3xl mb-5 pb-3 border-b-[3px] border-[#E8192C]">
              Overview
            </h2>
            <div className="space-y-4 font-[family-name:var(--space-mono)] text-sm sm:text-[15px] leading-[1.75] text-[#1A1D24]">
              {project.overview.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        {project.features && project.features.length > 0 && (
          <section className="bg-white border-[3px] border-[#0D0F14] p-6 sm:p-8">
            <h2 className="font-[family-name:var(--oxanium)] font-black text-2xl sm:text-3xl mb-5 pb-3 border-b-[3px] border-[#E8192C]">
              Key Features
            </h2>
            <ul className="space-y-3 font-[family-name:var(--space-mono)] text-sm sm:text-[15px] leading-relaxed text-[#1A1D24]">
              {project.features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 bg-[#E8192C]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="bg-white border-[3px] border-[#0D0F14] p-6 sm:p-8">
          <h2 className="font-[family-name:var(--oxanium)] font-black text-2xl sm:text-3xl mb-5 pb-3 border-b-[3px] border-[#E8192C]">
            Tech Stack
          </h2>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="font-[family-name:var(--space-mono)] text-[11px] tracking-[0.1em] uppercase border-2 border-[#0D0F14] text-[#1A1D24] px-3 py-1.5"
              >
                {tech}
              </li>
            ))}
          </ul>

          {project.metrics && (
            <dl className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-[3px] bg-[#0D0F14] border-[3px] border-[#0D0F14]">
              {project.metrics.map((m) => (
                <div key={m.label} className="bg-white p-4">
                  <dt className="font-[family-name:var(--space-mono)] text-[10px] tracking-[0.1em] uppercase text-[#8892AA]">{m.label}</dt>
                  <dd className="font-[family-name:var(--oxanium)] font-black text-xl text-[#E8192C]">{m.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        {others.length > 0 && (
          <section>
            <h2 className="font-[family-name:var(--oxanium)] font-black text-2xl sm:text-3xl mb-5">
              More <span className="text-[#E8192C]">Projects</span>
            </h2>
            <ul className="grid gap-4 sm:grid-cols-3">
              {others.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/projects/${p.slug}`}
                    className="group block h-full bg-white border-[3px] border-[#0D0F14] p-5 hover:shadow-[4px_4px_0_#E8192C] transition-all"
                  >
                    <span className="font-[family-name:var(--space-mono)] text-[9px] tracking-[0.2em] uppercase text-[#E8192C]">
                      {p.category}
                    </span>
                    <h3 className="mt-2 font-[family-name:var(--oxanium)] font-bold text-lg leading-tight group-hover:text-[#E8192C] transition-colors">
                      {p.name}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
