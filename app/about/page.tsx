import Link from "next/link";
import { NOW, SKILLS, STACK } from "@/data/about";
import { socialLinks } from "@/data/social";
import { formatBlogDate } from "@/lib/blog-shared";
import GitHubActivity from "@/components/site/GitHubActivity";
import JsonLd from "@/components/global/JsonLd";
import { AUTHOR, WEBSITE_ID, absoluteUrl, pageMetadata, personJsonLd } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About",
  description:
    "About Ajay Mandal: a backend engineer building the agents, retrieval pipelines and job queues behind AI products. Stack, skills and current work.",
  path: "/about",
  ogSubtitle: AUTHOR.jobTitle,
});

const GITHUB_USER = AUTHOR.sameAs.find((u) => u.includes("github.com"))?.split("/").pop() ?? "";

const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": absoluteUrl("/about#page"),
  url: absoluteUrl("/about"),
  name: `About ${AUTHOR.name}`,
  isPartOf: { "@id": WEBSITE_ID },
  mainEntity: personJsonLd({
    knowsAbout: [...new Set([...AUTHOR.knowsAbout, ...SKILLS])],
  }),
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={aboutJsonLd} />
      <h1 className="page-title" style={{ marginBottom: 32 }}>
        About me
      </h1>

      <div className="prose">
        <div className="block">
          <h2>TL;DR</h2>
          <p>
            I&apos;m Ajay. I build backends for AI products: the agents, retrieval pipelines and job
            queues that sit behind the chat box. I grew up in Nepal, studied computer science in
            Bangalore, and write here about what I learn along the way.
          </p>
        </div>

        <div className="block">
          <h3>I make AI do boring, reliable work</h3>
          <p>
            The interesting part of an AI product is rarely the model. It&apos;s the orchestration
            around it: which agent runs next, what context it gets from retrieval, and what happens
            when a job fails halfway. That&apos;s the part I work on, mostly in TypeScript and NestJS
            on Postgres and Redis.
          </p>
        </div>

        <div className="block">
          <h3>Claude Code is my most-used tool</h3>
          <p>
            Most of what I write lately is about it:{" "}
            <Link href="/blog/claude-code-hooks-guide">hooks</Link> that enforce rules the model might
            forget, <Link href="/blog/claude-code-loop-engineering">loops</Link> that don&apos;t stop
            before the build is green, and how to keep the bill down with the{" "}
            <Link href="/blog/claude-advisor-tool">advisor tool</Link>.
          </p>
        </div>

        <div className="block">
          <h3>I build the tools I want to use</h3>
          <p>
            <Link href="/projects/drymdf">DryMDF</Link>, a Markdown-to-PDF platform with live preview
            and Mermaid diagrams, is the latest. Right now I&apos;m trying desktop app development.
            Everything is on <a href="https://github.com/ajay-mandal">GitHub</a>.
          </p>
        </div>

        <div className="block">
          <h3>My capstone became a paper</h3>
          <p>
            My final-year project, a serverless luggage tracker built on AWS and IoT, was published
            in <a href="https://ieeexplore.ieee.org/document/10730973">IEEE Xplore</a>. The full path
            from school to now is on <Link href="/life">life so far</Link>.
          </p>
        </div>

        <div className="block">
          <h2>What you&apos;ll find here</h2>
          <p>
            Write-ups of what I learn: backend architecture, AI agents, cloud infrastructure and
            developer tools, usually with the config included.
          </p>
        </div>

        <div className="block" style={{ marginBottom: 56 }}>
          <h2>Say hi</h2>
          <p>
            If a post helped you, or something in it is wrong, email me at{" "}
            <a href={`mailto:${AUTHOR.email}`}>{AUTHOR.email}</a>. I read everything.
          </p>
        </div>
      </div>

      <section className="section" aria-labelledby="stack-h">
        <h2 id="stack-h" className="section-label">
          Stack
        </h2>
        <ul className="chips">
          {STACK.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="skills-h">
        <h2 id="skills-h" className="section-label">
          Skills
        </h2>
        <ul className="chips muted">
          {SKILLS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section" aria-labelledby="now-h">
        <h2 id="now-h" className="section-label">
          Now
        </h2>
        <p className="prose" style={{ margin: "0 0 6px", fontSize: 16, lineHeight: 1.6 }}>
          {NOW.text}
        </p>
        <span className="mono meta" style={{ fontSize: 12 }}>
          updated {formatBlogDate(NOW.updated)}
        </span>
      </section>

      <section aria-labelledby="else-h">
        <h2 id="else-h" className="section-label">
          Elsewhere
        </h2>
        <p className="elsewhere">
          {socialLinks.map((link) => (
            <a key={link.id} href={link.url} rel="me noopener">
              {link.name}
            </a>
          ))}
          <a href="/blog/rss.xml">RSS</a>
        </p>
      </section>

      <section className="section" style={{ paddingTop: 44, paddingBottom: 0 }} aria-labelledby="github-h">
        <h2 id="github-h" className="section-label">
          GitHub activity
        </h2>
        <GitHubActivity username={GITHUB_USER} />
      </section>
    </>
  );
}
