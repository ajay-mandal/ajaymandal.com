import HeroSection from "@/components/pages/HeroSection";
import TickerBanner from "@/components/pages/TickerBanner";
import StatsBar from "@/components/pages/StatsBar";
import Skills from "@/components/pages/Skills";
import Project from "@/components/pages/projects";
import BlogSection from "@/components/pages/BlogSection";
import InteractiveTerminal from "@/components/pages/InteractiveTerminal";
import ContactForm from "@/components/pages/contact";
import JsonLd from "@/components/global/JsonLd";
import { JOBS } from "@/data/job";
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

const currentJob = JOBS.find((job) => !job.endDate);

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
      jobTitle: currentJob?.jobTitle ?? AUTHOR.jobTitle,
      ...(currentJob
        ? { worksFor: { "@type": "Organization", name: currentJob.name, url: currentJob.url } }
        : {}),
      alumniOf: { "@type": "CollegeOrUniversity", name: AUTHOR.alumniOf },
      knowsAbout: AUTHOR.knowsAbout,
      sameAs: AUTHOR.sameAs,
    },
  },
];

export default function Home() {
  return (
    <>
      <JsonLd data={homeJsonLd} />
      <HeroSection />
      <TickerBanner />
      <StatsBar />
      <div id="skills">
        <Skills />
      </div>
      <div id="projects">
        <Project />
      </div>
      <div id="blog">
        <BlogSection />
      </div>
      <InteractiveTerminal />
      <div id="contact">
        <ContactForm />
      </div>
    </>
  );
}
