import JsonLd from "@/components/global/JsonLd";
import WritingList, { type WritingItem } from "@/components/site/WritingList";
import { getAllPosts } from "@/lib/blog";
import { formatBlogDate, postThumbnail, readingMinutes } from "@/lib/blog-shared";
import {
  AUTHOR,
  PERSON_ID,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  WEBSITE_ID,
  absoluteUrl,
  pageMetadata,
} from "@/lib/site";

export const metadata = pageMetadata({
  description: SITE_DESCRIPTION,
  path: "/",
  ogSubtitle: "Backend & Full-Stack Engineer",
});

const homeJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "en-US",
    publisher: { "@id": PERSON_ID },
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${SITE_URL}/#profile`,
    url: SITE_URL,
    name: SITE_NAME,
    isPartOf: { "@id": WEBSITE_ID },
    mainEntity: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: AUTHOR.name,
      url: SITE_URL,
      image: absoluteUrl("/pp3.png"),
      jobTitle: AUTHOR.jobTitle,
      alumniOf: { "@type": "CollegeOrUniversity", name: AUTHOR.alumniOf },
      knowsAbout: AUTHOR.knowsAbout,
      sameAs: AUTHOR.sameAs,
    },
  },
];

/** Tags used by at least two posts, most used first: the filter row stays short. */
function filterTags(posts: { tags: string[] }[], max = 6): string[] {
  const counts = new Map<string, number>();
  for (const post of posts) for (const tag of post.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  return [...counts]
    .filter(([, n]) => n >= 2)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, max)
    .map(([tag]) => tag);
}

export default async function Home() {
  const posts = await getAllPosts();
  const items: WritingItem[] = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: formatBlogDate(post.published_at),
    dateIso: post.published_at,
    minutes: readingMinutes(post.content),
    tags: post.tags,
    thumbnail: postThumbnail(post),
  }));

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": absoluteUrl("/blog#blog"),
    url: SITE_URL,
    name: `${AUTHOR.name} — Writing`,
    description: SITE_DESCRIPTION,
    inLanguage: "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    author: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR.name, url: SITE_URL },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      "@id": `${absoluteUrl(`/blog/${post.slug}`)}#article`,
      headline: post.title,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.published_at,
      dateModified: post.updated_at || post.published_at,
    })),
  };

  return (
    <>
      <JsonLd data={[...homeJsonLd, blogJsonLd]} />
      <section className="intro">
        <h1 className="lede-title">
          I build the backend for AI products, and write down what I learn shipping them.
        </h1>
        <p className="lede-body">
          I work on multi-agent systems and RAG pipelines with TypeScript, NestJS, Postgres and
          Google Cloud. Lately I mostly write about Claude Code and the agent tooling around it.
        </p>
      </section>

      <section aria-labelledby="writing-h">
        <div className="rule-label">
          <h2 id="writing-h">Writing</h2>
          <span className="mono">{posts.length} posts</span>
        </div>
        <WritingList posts={items} tags={filterTags(posts)} />
      </section>
    </>
  );
}
