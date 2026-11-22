"use client";

import dynamic from "next/dynamic";

// Browser only: the calendar's loading state depends on today's date, so a
// server render would not match the client (React hydration error #418).
const GitHubCalendar = dynamic(() => import("react-github-calendar").then((m) => m.GitHubCalendar), {
  ssr: false,
  loading: () => <div style={{ height: 128 }} aria-hidden="true" />,
});

/** Plum scale, empty → busiest, matching the site tokens. */
const PLUM = ["#ede6ef", "#d3bcdd", "#b08bc0", "#8b5fa0", "#6a3d7c"];

/** Last year of public GitHub contributions (fetched in the browser). */
export default function GitHubActivity({ username }: { username: string }) {
  return (
    <div className="contrib">
      <GitHubCalendar
        username={username}
        year="last"
        colorScheme="light"
        theme={{ light: PLUM }}
        blockSize={10}
        blockMargin={3}
        blockRadius={2}
        fontSize={12}
        labels={{ totalCount: "{{count}} contributions in the last year" }}
        errorMessage="GitHub activity couldn't be loaded right now."
      />
    </div>
  );
}
