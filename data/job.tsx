export type JobProps = {
    id: string;
    name: string;
    url?: string;
    jobTitle: string;
    startDate: string;
    endDate: string;
    description: string;
    /** One or two sentences for the life-so-far timeline. */
    summary?: string;
    stack?: string[];
};


export const JOBS: JobProps[] = [
    {
        id: "juteq",
        name: "JUTEQ Inc",
        url: "https://juteq.ca/",
        jobTitle: "Backend Engineer",
        startDate: "2025-06",
        endDate: "",
        summary: "Multi-agent orchestration and RAG pipelines. Scalable NestJS and Prisma microservices, email, SMS and CRM integrations on event-driven patterns, Redis caching, and BullMQ job queues for background workflows.",
        stack: ["NestJS", "Prisma", "Redis", "BullMQ", "Cloud Run", "Vertex AI", "Docker"],
        description: `Architecting AI-powered platforms with focus on multi-agent orchestration systems and RAG (Retrieval-Augmented Generation) pipelines for intelligent context retrieval. Designing scalable backend systems using NestJS with object-oriented programming principles, leveraging Prisma ORM for distributed microservices architecture. Building multi-platform integration systems connecting email, SMS, and CRM channels with event-driven patterns for real-time data processing. Implementing Redis caching layers and session management to optimize performance and scalability. Working with Google Cloud infrastructure including Cloud Run for containerized deployments, GCS buckets for file storage, and Vertex AI for ML operations. Utilizing Docker for consistent development environments and implementing intelligent job queueing with BullMQ for workflow automation and background task processing.`,
    },
    {
        id: "stealth",
        name: "Stealth Startup",
        jobTitle: "Full-Stack Engineer",
        startDate: "2025-01",
        endDate: "2025-04",
        summary: "Built the MVP in React with Clerk auth and email verification, a FastAPI backend tuned for high-traffic concurrency, agent workflows with careful prompt design, and the company's SEO-focused Next.js website.",
        stack: ["React", "FastAPI", "Clerk", "Next.js", "TypeScript"],
        description: `Developed the MVP mobile design using React.js and Tailwind CSS, integrating user authentication and email verification with Clerk for seamless auth flows. Engineered a scalable FastAPI backend with optimized concurrency handling through async/await patterns and connection pooling to efficiently manage high-traffic user requests. Implemented agent automation workflows with sophisticated prompt engineering techniques to enhance AI response quality and consistency. Built the organization's SEO-optimized website using Next.js, React, and TypeScript, collaborating with senior developers on architecture decisions and API integration patterns.`,
    },
    {
        id: "kyndryl",
        name: "Kyndryl",
        url: "https://www.kyndryl.com/in/en",
        jobTitle: "Project Intern",
        startDate: "2024-04",
        endDate: "2024-07",
        summary: "Improved Python scripts, used Azure and SQL for data collection and visualisation, wrote progress reports for project managers, and managed devices with Aternity and Jamf.",
        stack: ["Python", "Azure", "SQL", "Jamf"],
        description: `Proactively assisted seniors to enhance service delivery and improve Python scripts. Worked with Azure and SQL for data accumulation and visualization. Kept projects on track by supporting project managers with progress reports, docs, and more. Used analytic tools such as Aternity and Jamf to monitor and manage devices and resolve issues.`,
    }

]
