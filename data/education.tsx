export type EducationProps = {
    id: string;
    name: string;
    url: string;
    startDate: string;
    endDate: string;
    description: string;
    CGPA: string;
    /** Short fields for the life-so-far timeline. */
    degree?: string;
    location?: string;
    summary?: string;
};


export const EDUCATIONS: EducationProps[] = [
    {
        id: "JGI",
        name: "Jain University",
        url: "https://www.jainuniversity.ac.in/",
        startDate: "Oct 2020",
        endDate: "May 2024",
        description: "Bachelor of Engineering in Computer Science and Engineering\n\nRelevant Coursework: Artificial Intelligence, Internet of Things (IoT), Cloud Computing, Data Structures & Algorithms, Database Management Systems (DBMS), Operating Systems, Software Engineering\n\nCapstone Project: AWS Serverless Luggage Tracking System Integrating IoT – Designed a cloud-native solution replacing RFID legacy systems.",
        CGPA: "GPA 8.74 / 10.0",
        degree: "B.E. Computer Science and Engineering",
        location: "Bangalore",
        summary: "AI, IoT, cloud computing, data structures and algorithms, databases and operating systems. Capstone: an AWS serverless luggage tracking system with IoT, built to replace legacy RFID tracking.",
    },
    {
        id: "KTM",
        name: "Kathmandu Model Higher Secondary School",
        url: "https://ktmmodelcollege.edu.np/",
        startDate: "Mar 2018",
        endDate: "Apr 2020",
        description: "Higher Education in Mathematics and Physics\n\nKey Focus: Specialized in the Physical Sciences track with a concentration in Computer Science, building a foundational understanding of algorithms, logic, and calculus.",
        CGPA: "GPA 3.41 / 4.0",
        degree: "Higher Secondary, Mathematics and Physics",
        location: "Kathmandu",
        summary: "Physical sciences with a computer science focus: algorithms, logic and calculus.",
    },
    {
        id: "MTPS",
        name: "Mother Teresa Public School",
        url: "https://www.facebook.com/mtpsjanakpur",
        startDate: "2009",
        endDate: "2018",
        description: "Primary Education\n\nCompleted foundational education covering core subjects including mathematics, science, and English with a focus on academic excellence and holistic development.",
        CGPA: "GPA 3.70 / 4.0",
        degree: "School",
        location: "Janakpur",
        summary: "Where it started: mathematics, science and English.",
    },

]
