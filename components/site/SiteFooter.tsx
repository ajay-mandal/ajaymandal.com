import { AUTHOR } from "@/lib/site";
import { socialLinks } from "@/data/social";

export default function SiteFooter() {
  return (
    <footer className="site-foot">
      <span>© {new Date().getFullYear()} {AUTHOR.name}</span>
      <nav aria-label="Elsewhere">
        <a href={`mailto:${AUTHOR.email}`}>email</a>
        {socialLinks.map((link) => (
          <a key={link.id} href={link.url} rel="me noopener" target="_blank">
            {link.name.toLowerCase()}
          </a>
        ))}
        <a href="/blog/rss.xml">rss</a>
      </nav>
    </footer>
  );
}
