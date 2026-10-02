import Image from "next/image";
import { EDUCATIONS } from "@/data/education";
import { JOBS } from "@/data/job";
import { PUBLICATIONS } from "@/data/publications";
import { pageMetadata } from "@/lib/site";

export const metadata = pageMetadata({
  title: "About",
  description:
    "About Ajay Mandal: backend engineer working on AI platforms, distributed systems and APIs. Experience, education, publications and the stack behind the work.",
  path: "/about",
  ogSubtitle: "Experience, education & publications",
});

export default function About() {
  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 pb-16 sm:px-6 md:px-8 lg:pt-24">
      <div className="mx-auto max-w-5xl">
        {/* Hero Section */}
        <section className="mb-12 md:mb-20">
          <div className="relative bg-white p-6 sm:p-8 md:p-12" style={{ border: "3px solid #0D0F14" }}>
            <div
              className="hidden sm:block"
              style={{
                position: "absolute",
                inset: 10,
                border: "2px dotted rgba(232,25,44,.18)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="mb-4 flex items-center gap-2 sm:mb-6 sm:gap-3">
                <div className="h-0.5 w-8 sm:h-[3px] sm:w-10" style={{ background: "#E8192C" }} />
                <span className="font-mono text-[0.65rem] uppercase tracking-[.2em] text-brand sm:text-[0.58rem] sm:tracking-[.28em]">
                  About Me
                </span>
              </div>
              
              <h1 className="mb-4 font-oxanium text-3xl font-bold leading-tight text-ink sm:mb-6 sm:text-4xl md:text-5xl">
                From Zero to <span className="text-brand">Production</span>
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>
                One Commit at a Time
              </h1>
              
              <div className="space-y-3 font-mono text-[0.75rem] leading-relaxed text-ink2 sm:space-y-4 sm:text-[0.70rem] text-justify">
                <p>
                  Hey! I'm a backend engineer specializing in building scalable, high-performance systems. I architect distributed architectures, 
                  design robust APIs, and optimize infrastructure to handle millions of requests. My expertise lies in transforming complex 
                  business requirements into reliable, production-grade backend solutions.
                </p>
                <p>
                  My playground includes orchestrating AI agent workflows, implementing RAG pipelines for intelligent context retrieval, 
                  and designing microservices architectures. Currently working with NestJS, Prisma, PostgreSQL, and Google Cloud infrastructure, 
                  I specialize in building systems that handle real-world complexity—from multi-channel communication flows to high-concurrency 
                  data processing and event-driven architectures.
                </p>
                <p>
                  I'm passionate about system design, database optimization, API architecture, and cloud infrastructure. When not building backend 
                  systems, you'll find me exploring distributed systems patterns, solving HackTheBox challenges, or riding through Bengaluru's 
                  streets. Originally from Nepal, I believe in learning by building and sharing knowledge with fellow developers.
                </p>
                <p className="italic text-brand">
                  Spot me in the wild? Let's grab a drink and geek out over distributed systems, database design, microservices, or the latest 
                  in backend infrastructure! ✨
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section className="mb-12 md:mb-20">
          <div className="mb-6 flex items-center gap-2 sm:mb-8 sm:gap-3">
            <div className="h-0.5 w-8 sm:h-[3px] sm:w-10" style={{ background: "#E8192C" }} />
            <h2 className="font-oxanium text-xl font-bold uppercase tracking-wider text-ink sm:text-2xl">
              Experience
            </h2>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {JOBS.map((job, idx) => (
              <div
                key={job.id}
                className="group relative bg-white p-4 transition-all duration-300 hover:translate-x-1 sm:p-6 md:p-8"
                style={{ border: "3px solid #0D0F14" }}
              >
                <div
                  className="absolute inset-0 hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block"
                  style={{
                    border: "2px dotted rgba(232,25,44,.18)",
                    margin: "8px",
                    pointerEvents: "none",
                  }}
                />
                
                <div className="relative z-10">
                  {/* Header: Logo + Title/Company/Dates in one line on mobile, grid on desktop */}
                  <div className="mb-3 flex items-start gap-3 sm:mb-4 sm:grid sm:grid-cols-[auto_1fr] sm:gap-6">
                    <div className="flex items-start">
                      <div
                        className="relative h-12 w-12 flex-shrink-0 overflow-hidden bg-white sm:h-14 sm:w-14 md:h-16 md:w-16"
                        style={{ border: "2px solid #0D0F14" }}
                      >
                        <Image
                          src={job.logo}
                          alt={job.name}
                          fill
                          sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
                          className="object-contain p-2"
                        />
                      </div>
                    </div>
                  
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                        <div className="min-w-0">
                          <h3 className="font-oxanium text-base font-bold leading-tight text-ink sm:text-lg md:text-xl">
                            {job.jobTitle}
                          </h3>
                          {job.url && job.url !== "#" ? (
                            <a
                              href={job.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[0.68rem] uppercase tracking-wider text-brand transition-colors hover:text-site-black sm:text-[0.62rem]"
                            >
                              {job.name} ↗
                            </a>
                          ) : (
                            <span className="font-mono text-[0.68rem] uppercase tracking-wider text-ink3 sm:text-[0.62rem]">
                              {job.name}
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[0.62rem] uppercase tracking-wider text-ink3 sm:text-[0.58rem]">
                          {job.startDate} — {job.endDate || "Present"}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description: Full width below */}
                  <p className="whitespace-pre-line text-justify font-mono text-[0.75rem] leading-relaxed text-ink2 sm:text-[0.68rem]">
                    {job.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education Section */}
        <section className="mb-12 md:mb-20">
          <div className="mb-6 flex items-center gap-2 sm:mb-8 sm:gap-3">
            <div className="h-0.5 w-8 sm:h-[3px] sm:w-10" style={{ background: "#E8192C" }} />
            <h2 className="font-oxanium text-xl font-bold uppercase tracking-wider text-ink sm:text-2xl">
              Education
            </h2>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {EDUCATIONS.map((edu) => (
              <div
                key={edu.id}
                className="group relative bg-white p-4 transition-all duration-300 hover:translate-x-1 sm:p-6 md:p-8"
                style={{ border: "3px solid #0D0F14" }}
              >
                <div
                  className="absolute inset-0 hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block"
                  style={{
                    border: "2px dotted rgba(232,25,44,.18)",
                    margin: "8px",
                    pointerEvents: "none",
                  }}
                />
                
                <div className="relative z-10">
                  {/* Header: Logo + Title/Dates in one line on mobile, grid on desktop */}
                  <div className="mb-3 flex items-start gap-3 sm:mb-4 sm:grid sm:grid-cols-[auto_1fr] sm:gap-6">
                    <div className="flex items-start">
                      <div
                        className="relative h-12 w-12 flex-shrink-0 overflow-hidden bg-white sm:h-14 sm:w-14 md:h-16 md:w-16"
                        style={{ border: "2px solid #0D0F14" }}
                      >
                        <Image
                          src={edu.logo}
                          alt={edu.name}
                          fill
                          sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                        <div className="min-w-0">
                          <h3 className="font-oxanium text-base font-bold leading-tight text-ink sm:text-lg md:text-xl">
                            {edu.name}
                          </h3>
                          {edu.url && edu.url !== "#" && (
                            <a
                              href={edu.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-mono text-[0.68rem] uppercase tracking-wider text-brand transition-colors hover:text-site-black sm:text-[0.62rem]"
                            >
                              Visit Website ↗
                            </a>
                          )}
                          <div className="mt-1 font-mono text-[0.64rem] uppercase tracking-wider text-brand sm:text-[0.60rem]">
                            {edu.CGPA}
                          </div>
                        </div>
                        <div className="font-mono text-[0.62rem] uppercase tracking-wider text-ink3 sm:text-[0.58rem]">
                          {edu.startDate} — {edu.endDate}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description: Full width below */}
                  <p className="whitespace-pre-line text-justify font-mono text-[0.75rem] leading-relaxed text-ink2 sm:text-[0.68rem]">
                    {edu.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Publications Section */}
        <section>
          <div className="mb-6 flex items-center gap-2 sm:mb-8 sm:gap-3">
            <div className="h-0.5 w-8 sm:h-[3px] sm:w-10" style={{ background: "#E8192C" }} />
            <h2 className="font-oxanium text-xl font-bold uppercase tracking-wider text-ink sm:text-2xl">
              Publications
            </h2>
          </div>
          
          <div className="space-y-4 sm:space-y-6">
            {PUBLICATIONS.map((pub, idx) => (
              <div
                key={idx}
                className="group relative bg-white p-4 transition-all duration-300 hover:translate-x-1 sm:p-6 md:p-8"
                style={{ border: "3px solid #0D0F14" }}
              >
                <div
                  className="absolute inset-0 hidden opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block"
                  style={{
                    border: "2px dotted rgba(232,25,44,.18)",
                    margin: "8px",
                    pointerEvents: "none",
                  }}
                />
                
                <div className="relative z-10">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2 sm:mb-4 sm:gap-3">
                    <div className="flex-1">
                      <div className="mb-2 inline-block bg-brand px-2.5 py-1 sm:px-3">
                        <span className="font-mono text-[0.67rem] font-bold uppercase tracking-wider text-white sm:text-[0.60rem]">
                          {pub.tagline}
                        </span>
                      </div>
                      <h3 className="font-oxanium text-lg font-bold leading-tight text-ink sm:text-xl">
                        {pub.name}
                      </h3>
                    </div>
                    <div className="font-mono text-[0.65rem] uppercase tracking-wider text-ink3 sm:text-[0.58rem]">
                      {pub.date}
                    </div>
                  </div>
                  
                  <p className="mb-3 whitespace-pre-line text-justify font-mono text-[0.75rem] leading-relaxed text-ink2 sm:mb-4 sm:text-[0.68rem]">
                    {pub.description}
                  </p>
                  
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block border-3 border-brand bg-brand px-4 py-2 font-mono text-[0.68rem] uppercase tracking-wider text-white transition-all hover:border-site-black hover:bg-site-black sm:px-5 sm:text-[0.62rem]"
                  >
                    View Publication ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
