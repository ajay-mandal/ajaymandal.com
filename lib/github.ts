/**
 * Public GitHub data for project pages. Fetched at build time and refreshed
 * at most once a day; any failure (rate limit, network) returns null and the
 * page simply leaves the stats out. Set GITHUB_TOKEN to raise the rate limit.
 */

export type RepoStats = {
  fullName: string;
  url: string;
  stars: number;
  forks: number;
  openIssues: number;
  language: string | null;
  license: string | null;
  pushedAt: string;
};

const DAY = 60 * 60 * 24;

/** "https://github.com/owner/repo" → "owner/repo" */
export function repoSlug(githubUrl: string): string | null {
  return githubUrl.match(/github\.com\/([^/\s]+\/[^/\s#?]+)/)?.[1].replace(/\.git$/, "") ?? null;
}

export async function getRepoStats(githubUrl: string): Promise<RepoStats | null> {
  const slug = repoSlug(githubUrl);
  if (!slug) return null;
  try {
    const res = await fetch(`https://api.github.com/repos/${slug}`, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "ajaymandal.com",
        ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
      },
      next: { revalidate: DAY },
    });
    if (!res.ok) return null;
    const r = await res.json();
    return {
      fullName: r.full_name,
      url: r.html_url,
      stars: r.stargazers_count,
      forks: r.forks_count,
      openIssues: r.open_issues_count,
      language: r.language,
      license: r.license?.spdx_id && r.license.spdx_id !== "NOASSERTION" ? r.license.spdx_id : null,
      pushedAt: r.pushed_at,
    };
  } catch {
    return null;
  }
}
