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

/** First sentence of a tagline, for the one-line summary in the list. */
function firstSentence(text: string): string {
  return text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;
}

export default function ProjectsPage() {
  const projects = [...PROJECT].sort((a, b) => Number(b.year) - Number(a.year));
  return (
    <>
      <JsonLd data={projectsJsonLd} />
      <h1 className="page-title">Projects</h1>
      <p className="page-lede">Things I built to learn something or because I wanted to use them. Newest first.</p>

      <section aria-labelledby="projects-h">
        <div className="rule-label">
          <h2 id="projects-h">All projects</h2>
          <span className="mono">{projects.length}</span>
        </div>
        {projects.map((project) => (
          <div key={project.slug} className="project-row">
            <div className="project-row-head">
              <h3>
                <Link href={`/projects/${project.slug}`}>{project.name}</Link>
              </h3>
              <span className="mono meta" style={{ fontSize: 12 }}>
                {project.year}
              </span>
            </div>
            <p className="post-excerpt">{firstSentence(project.tagline)}</p>
            <div className="project-foot">
              <span className="mono meta">{project.stack.slice(0, 5).join(" · ")}</span>
              <span className="links">
                {project.blogLink && <Link href={project.blogLink}>write-up →</Link>}
                <a href={project.github}>github ↗</a>
              </span>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
