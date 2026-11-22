import { JOBS, type JobProps } from "@/data/job";
import { EDUCATIONS } from "@/data/education";
import { PUBLICATIONS } from "@/data/publications";
import { AUTHOR, pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Life so far",
  description:
    "Ajay Mandal's path so far: backend and full-stack work, a computer science degree from Jain University, and an IEEE-published paper on serverless IoT tracking.",
  path: "/life",
  ogSubtitle: "Work, education & publications",
});

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2025-06" → "Jun 2025" */
function monthYear(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

/** "Jun 2025 – now", or "Jan – Apr 2025" when both ends share a year. */
function jobRange(job: JobProps): string {
  if (!job.endDate) return `${monthYear(job.startDate)} – now`;
  const [start, end] = [monthYear(job.startDate), monthYear(job.endDate)];
  return start.slice(-4) === end.slice(-4)
    ? `${start.slice(0, 3)} – ${end}`
    : `${start} – ${end}`;
}

const year = (s: string) => s.match(/\d{4}/)?.[0] ?? s;

export default function LifePage() {
  return (
    <>
      <h1 className="page-title">Life so far</h1>
      <p className="page-lede">From a school in Janakpur to backend systems for AI products. Newest first.</p>

      <section className="section" aria-labelledby="work-h">
        <div className="rule-label" style={{ marginBottom: 28 }}>
          <h2 id="work-h">Work</h2>
        </div>
        <ol className="timeline">
          {JOBS.map((job) => {
            const current = !job.endDate;
            return (
              <li key={job.id}>
                <span className={`tl-date${current ? " now" : ""}`}>{jobRange(job)}</span>
                <div className={`tl-body${current ? " now" : ""}`}>
                  <h3>{job.jobTitle}</h3>
                  <span className="tl-org">
                    {job.url ? <a href={job.url}>{job.name}</a> : job.name}
                  </span>
                  <p>{job.summary ?? job.description}</p>
                  {job.stack && <span className="tl-stack">{job.stack.join(" · ")}</span>}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <section className="section" aria-labelledby="edu-h">
        <div className="rule-label" style={{ marginBottom: 28 }}>
          <h2 id="edu-h">Education</h2>
        </div>
        <ol className="timeline">
          {EDUCATIONS.map((edu) => (
            <li key={edu.id}>
              <span className="tl-date">
                {year(edu.startDate)} – {year(edu.endDate)}
              </span>
              <div className="tl-body">
                <h3>{edu.degree ?? edu.name}</h3>
                <span className="tl-org">
                  <a href={edu.url}>{edu.name}</a>
                  {edu.location ? `, ${edu.location}` : ""} · {edu.CGPA}
                </span>
                <p>{edu.summary ?? edu.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="pub-h">
        <div className="rule-label" style={{ marginBottom: 20 }}>
          <h2 id="pub-h">Publications</h2>
        </div>
        {PUBLICATIONS.map((pub) => (
          <article key={pub.link} className="pub">
            <span className="tl-date">
              {pub.date.charAt(0) + pub.date.slice(1).toLowerCase()}
            </span>
            <div className="pub-body">
              <h3>
                <a href={pub.link}>{pub.name}</a>
              </h3>
              {pub.authors && (
                <p className="pub-authors">
                  {pub.authors.map((name, i) => (
                    <span key={name}>
                      {i > 0 && (i === pub.authors!.length - 1 ? " and " : ", ")}
                      {name.startsWith(AUTHOR.name.split(" ")[0]) ? (
                        <strong>{name}</strong>
                      ) : (
                        name
                      )}
                    </span>
                  ))}
                </p>
              )}
              <p className="pub-venue">
                {pub.venue ? `${pub.venue}. ` : ""}
                {pub.summary ?? pub.description}
              </p>
              <span className="pub-links">
                <a className="link-accent" href={pub.link}>
                  Read the paper ↗
                </a>
                {pub.doi && <span className="mono meta" style={{ fontSize: 12 }}>DOI {pub.doi}</span>}
              </span>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
