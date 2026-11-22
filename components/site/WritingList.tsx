"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type WritingItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateIso: string;
  minutes: number;
  tags: string[];
  thumbnail?: string;
};

/**
 * Post list with a tag filter. The selected tag lives in `?tag=` so post
 * pages can link to a filtered list; read after mount to keep the page static.
 */
export default function WritingList({ posts, tags }: { posts: WritingItem[]; tags: string[] }) {
  const [tag, setTag] = useState<string | null>(null);

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("tag");
    if (fromUrl && posts.some((p) => p.tags.includes(fromUrl))) setTag(fromUrl);
  }, [posts]);

  function choose(next: string | null) {
    setTag(next);
    const url = new URL(window.location.href);
    if (next) url.searchParams.set("tag", next);
    else url.searchParams.delete("tag");
    window.history.replaceState(null, "", url);
  }

  const shown = tag ? posts.filter((p) => p.tags.includes(tag)) : posts;
  // A post page can link to a tag outside the short list; show it while it's selected.
  const buttons = tag && !tags.includes(tag) ? [...tags, tag] : tags;

  return (
    <>
      <div className="tag-filter" role="group" aria-label="Filter posts by tag">
        <button type="button" aria-pressed={tag === null} onClick={() => choose(null)}>
          all
        </button>
        {buttons.map((t) => (
          <button key={t} type="button" aria-pressed={tag === t} onClick={() => choose(t)}>
            {t}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="empty">No posts yet.</p>
      ) : (
        <ol className="post-list">
          {shown.map((post) => (
            <li key={post.slug} className={`post-row${post.thumbnail ? "" : " no-thumb"}`}>
              <time className="post-date" dateTime={post.dateIso}>
                {post.date}
              </time>
              <div className="post-body">
                <h3 className="post-title">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="post-excerpt">{post.excerpt}</p>
                <span className="post-info">
                  {post.minutes} min read
                  {post.tags[0] ? ` · ${post.tags[0]}` : ""}
                </span>
              </div>
              {post.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element -- small decorative thumb, mixes SVG and raster
                <img className="post-thumb" src={post.thumbnail} alt="" loading="lazy" decoding="async" />
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
