"use client";

import { useEffect, useState } from "react";
import type { IconType } from "react-icons";
import {
  FaCheck,
  FaEnvelope,
  FaHackerNews,
  FaLink,
  FaLinkedinIn,
  FaRedditAlien,
  FaShareNodes,
  FaWhatsapp,
  FaXTwitter,
} from "react-icons/fa6";
import { SiBluesky } from "react-icons/si";
import { AUTHOR } from "@/lib/site";

type Target = { name: string; icon: IconType; href: (url: string, title: string) => string };

const enc = encodeURIComponent;

/** Each platform's own share URL; nothing is loaded from third parties until clicked. */
const TARGETS: Target[] = [
  { name: "X", icon: FaXTwitter, href: (u, t) => `https://x.com/intent/post?text=${enc(t)}&url=${enc(u)}&via=${AUTHOR.twitter.replace(/^@/, "")}` },
  { name: "LinkedIn", icon: FaLinkedinIn, href: (u) => `https://www.linkedin.com/sharing/share-offsite/?url=${enc(u)}` },
  { name: "Reddit", icon: FaRedditAlien, href: (u, t) => `https://www.reddit.com/submit?url=${enc(u)}&title=${enc(t)}` },
  { name: "Hacker News", icon: FaHackerNews, href: (u, t) => `https://news.ycombinator.com/submitlink?u=${enc(u)}&t=${enc(t)}` },
  { name: "Bluesky", icon: SiBluesky, href: (u, t) => `https://bsky.app/intent/compose?text=${enc(`${t} ${u}`)}` },
  { name: "WhatsApp", icon: FaWhatsapp, href: (u, t) => `https://wa.me/?text=${enc(`${t} ${u}`)}` },
  { name: "Email", icon: FaEnvelope, href: (u, t) => `mailto:?subject=${enc(t)}&body=${enc(`${t}\n${u}`)}` },
];

/** Share row at the end of a post: platform links, copy link, and the system share sheet where supported. */
export default function SharePost({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  // navigator.share only exists in the browser (mostly on phones); check after mount.
  useEffect(() => setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function"), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  return (
    <section className="share" aria-labelledby="share-h">
      <h2 id="share-h" className="section-label">
        Share this post
      </h2>
      <ul className="share-links">
        {TARGETS.map(({ name, icon: Icon, href }) => (
          <li key={name}>
            <a
              href={href(url, title)}
              target={name === "Email" ? undefined : "_blank"}
              rel="noopener noreferrer"
              aria-label={`Share on ${name}`}
            >
              <Icon aria-hidden="true" />
              <span>{name}</span>
            </a>
          </li>
        ))}
        <li>
          <button type="button" onClick={copy} aria-live="polite">
            {copied ? <FaCheck aria-hidden="true" /> : <FaLink aria-hidden="true" />}
            <span>{copied ? "Link copied" : "Copy link"}</span>
          </button>
        </li>
        {canShare && (
          <li>
            <button type="button" onClick={() => navigator.share({ title, url }).catch(() => undefined)}>
              <FaShareNodes aria-hidden="true" />
              <span>More…</span>
            </button>
          </li>
        )}
      </ul>
    </section>
  );
}
