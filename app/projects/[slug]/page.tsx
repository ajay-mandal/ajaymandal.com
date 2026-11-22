import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PROJECT, getProjectBySlug, type ProjectProps } from "@/data/Projects";
import JsonLd from "@/components/global/JsonLd";
import { formatBlogDate } from "@/lib/blog-shared";
import { getRepoStats, repoSlug } from "@/lib/github";
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

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();
  const repo = await getRepoStats(project.github);

  const stats = repo
    ? [
        ["Stars", String(repo.stars)],
        ["Forks", String(repo.forks)],
        ["Issues & PRs", String(repo.openIssues)],
        ["Language", repo.language ?? "–"],
        ["Last push", formatBlogDate(repo.pushedAt)],
      ]
    : [];

  return (
    <article>
      <JsonLd data={projectJsonLd(project)} />
      <Link href="/projects" className="back-link">
        ← projects
      </Link>

      <h1 className="page-title" style={{ marginBottom: 24 }}>{project.name}</h1>

      {stats.length > 0 && (
        <dl className="repo-stats">
          {stats.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <p className="repo-links">
        <a className="mono" href={project.github}>
          {repoSlug(project.github) ?? "GitHub"} ↗
        </a>
        {project.live && <a href={project.live}>{project.live.replace(/^https?:\/\//, "").replace(/\/$/, "")} ↗</a>}
        {project.blogLink && <Link href={project.blogLink}>read the write-up →</Link>}
      </p>

      {project.image && (
        <div className="figure-frame" style={{ margin: "36px 0" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static image from /public */}
          <img src={project.image} alt={`${project.name} home page`} />
        </div>
      )}

      <div className="prose" style={{ marginTop: project.image ? 0 : 36 }}>
        <p>{project.tagline}</p>
        {project.overview?.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
        {project.features && project.features.length > 0 && (
          <>
            <h2 style={{ marginTop: 36 }}>Features</h2>
            <ul>
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      {project.gallery?.map((shot) => (
        <figure key={shot.src} className="figure-frame" style={{ margin: "8px 0 36px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static image from /public */}
          <img src={shot.src} alt={shot.alt} loading="lazy" />
        </figure>
      ))}

      {project.metrics && project.metrics.length > 0 && (
        <section className="section" style={{ marginTop: 12 }} aria-labelledby="highlights-h">
          <h2 id="highlights-h" className="section-label">
            Highlights
          </h2>
          <ul className="chips muted">
            {project.metrics.map((m) => (
              <li key={m.label}>
                {m.value} <span className="meta">{m.label.toLowerCase()}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="stack-h">
        <h2 id="stack-h" className="section-label">
          Stack · {project.category.toLowerCase()} · {project.year}
          {repo?.license ? ` · ${repo.license} license` : ""}
        </h2>
        <ul className="chips">
          {project.stack.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
