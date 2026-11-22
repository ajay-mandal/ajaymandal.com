export type PublicationProps = {
    name: string;
    description: string;
    link: string;
    tagline: string;
    date: string;
    image: string;
    /** Structured fields for the life-so-far page. */
    authors?: string[];
    venue?: string;
    doi?: string;
    summary?: string;
  };
  
  
  export const PUBLICATIONS: PublicationProps[] = [
    {
    name: "AWS Serverless Luggage Tracking System Integrating IoT",
    description: 'Authors: Ajay Kumar Mandal, P. Yadav, A. Maharjan, C. Rai, and B. D.R\n\nPublished in 2024 2nd International Conference on Networking, Embedded and Wireless Systems (ICNEWS), Bangalore, India, August 2024. This paper presents a cloud-native solution designed to replace legacy RFID-based luggage tracking systems with a modern AWS serverless architecture.\n\nStatus: Published in IEEE Xplore | DOI: 10.1109/ICNEWS60873.2024.10730973',
    link: 'https://ieeexplore.ieee.org/document/10730973',
    tagline: "IEEE XPLORE",
    date: "AUG 2024",
    image: '/edu/ieee-certificate.png',
    authors: ['Ajay Kumar Mandal', 'P. Yadav', 'A. Maharjan', 'C. Rai', 'B. D.R'],
    venue: '2nd International Conference on Networking, Embedded and Wireless Systems (ICNEWS), Bangalore',
    doi: '10.1109/ICNEWS60873.2024.10730973',
    summary: 'A cloud-native AWS serverless design to replace RFID-based luggage tracking.',
    },
]
  