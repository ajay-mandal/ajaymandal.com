import Link from "next/link";
import { PROJECT } from "@/data/Projects";
import { getRepoStats, repoSlug } from "@/lib/github";
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

export default async function ProjectsPage() {
  const projects = [...PROJECT].sort((a, b) => Number(b.year) - Number(a.year));
  const stats = await Promise.all(projects.map((p) => getRepoStats(p.github)));

  return (
    <>
      <JsonLd data={projectsJsonLd} />
      <h1 className="page-title">Projects</h1>
      <p className="page-lede">
        Things I&apos;ve built and maintain. Each one is open source on GitHub.
      </p>

      <section aria-labelledby="projects-h">
        <div className="rule-label">
          <h2 id="projects-h">
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </h2>
        </div>
        {projects.map((project, i) => {
          const repo = stats[i];
          return (
            <article key={project.slug} className="project-card">
              {project.image && (
                <Link href={`/projects/${project.slug}`} className="figure-frame project-shot" tabIndex={-1} aria-hidden="true">
                  {/* eslint-disable-next-line @next/next/no-img-element -- static image from /public */}
                  <img src={project.image} alt="" loading="lazy" />
                </Link>
              )}
              <h3 className="project-name">
                <Link href={`/projects/${project.slug}`}>{project.name}</Link>
              </h3>
              <p className="project-desc">{project.tagline}</p>
              <div className="project-foot">
                <span className="repo-inline">
                  {repo ? (
                    <>
                      <span><b>{repo.stars}</b> stars</span>
                      <span><b>{repo.forks}</b> forks</span>
                      {repo.language && <span>{repo.language}</span>}
                    </>
                  ) : (
                    <span className="mono meta">{project.stack.slice(0, 4).join(" · ")}</span>
                  )}
                </span>
                <a className="mono repo-link" href={project.github}>
                  {repoSlug(project.github) ?? "GitHub"} ↗
                </a>
              </div>
            </article>
          );
        })}
      </section>
    </>
  );
}
