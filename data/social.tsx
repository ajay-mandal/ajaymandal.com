import {
  BiLogoGithub,
  BiLogoLinkedinSquare,
  BiLogoYoutube,
  BiLogoDocker
} from "react-icons/bi";
import { FaSquareXTwitter } from "react-icons/fa6";

import Image from "next/image";

const CustomLogo = () => (
  <Image src="/logo-dark.png" alt="Custom Logo" width={24} height={24} style={{ filter: 'brightness(0.5)' }} />
);
export const socialLinks = [
  {
    id: 1,
    name: "GitHub",
    url: "https://github.com/ajay-mandal",
    icon: BiLogoGithub,
    status: "social",
  },
  {
    id: 2,
    name: "X",
    url: "https://x.com/ajaymandal01",
    icon: FaSquareXTwitter,
    status: "social",
  },
  {
    id: 3,
    name: "LinkedIn",
    url: "https://linkedin.com/in/ajay-mandal",
    icon: BiLogoLinkedinSquare,
    status: "social",
  },
  {
    id: 4,
    name: "YouTube",
    url: "https://youtube.com/@zexa_yt",
    icon: BiLogoYoutube,
    status: "social",
  }
];
