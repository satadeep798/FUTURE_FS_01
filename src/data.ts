import { 
  Github, 
  Linkedin, 
  Instagram,
  Mail, 
  Code2, 
  Globe, 
  Smartphone, 
  MapPin, 
  GraduationCap, 
  Terminal,
  Layers
} from 'lucide-react';
import React from 'react';

export const PORTFOLIO_DATA = {
  name: "DEEP SATA",
  role: "Digital Architect",
  bio: "I'm Deep Sata, a Computer Engineering student crafting high-performance digital experiences.",
  location: "Rajkot, India",
  subLocation: "Gujarat State",
  age: 20,
  profileImage: "/assets/profile/profile.jpeg",
  education: {
    degree: "Computer Eng.",
    status: "Student Developer",
    details: [
      "7.5 CPI Diploma",
      "4th Semester B.Tech"
    ],
    university: "Marwadi University"
  },
  socials: {
    github: "https://github.com/satadeep798",
    linkedin: "https://www.linkedin.com/in/satadeep798/",
    email: "satadeep798@gmail.com",
    instagram: "https://www.instagram.com/deep_m207"
  },
  hero: {
    words: ['ARCHITECT', 'DESIGNER', 'DEVELOPER'],
    description: "I'm Deep Sata, a Computer Engineering student crafting high-performance digital experiences."
  },
  skills: [
    { name: "Java", icon: React.createElement(Terminal, { size: 20 }), color: "from-blue-500 to-cyan-500" },
    { name: "JavaScript", icon: React.createElement(Code2, { size: 20 }), color: "from-blue-400 to-blue-600" },
    { name: "Node.js", icon: React.createElement(Layers, { size: 20 }), color: "from-blue-600 to-indigo-600" },
    { name: "Flutter", icon: React.createElement(Smartphone, { size: 20 }), color: "from-cyan-400 to-blue-500" },
    { name: "DBMS", icon: React.createElement(Globe, { size: 20 }), color: "from-blue-700 to-indigo-800" },
    { name: ".NET", icon: React.createElement(Code2, { size: 20 }), color: "from-blue-400 to-indigo-500" },
    { name: "C", icon: React.createElement(Terminal, { size: 20 }), color: "from-blue-800 to-blue-900" },
    { name: "HTML/CSS", icon: React.createElement(Globe, { size: 20 }), color: "from-blue-300 to-blue-500" },
  ],
  projects: [
    {
      slug: "game-store",
      title: "Game Store App",
      description: "An immersive e-commerce platform for gamers with high-end design, secure transactions, and a personal game library.",
      longDescription: "The Game Store App is a premium e-commerce platform designed with a focus on high-end aesthetics and seamless user interactions. It allows users to browse a curated collection of new and trending games, perform secure purchases, and manage their personal library. The goal was to create a digital store that feels as immersive as the games it sells, providing a central hub for gamers to explore and play whenever they want.",
      features: [
        "User Authentication & Profile",
        "Real-time Game Discovery",
        "Seamless Purchase Experience",
        "Personal Game Library Storage",
        "Immersive Visual Design"
      ],
      tech: ["Node.js", "Express", "JS", "CSS"],
      image: "/assets/project1/main.png",
      gallery: [
        "/assets/project1/login.png",
        "/assets/project1/product.png",
        "/assets/project1/lib.png"
      ],
      link: "/project/game-store"
    },
    {
      slug: "ums-portal",
      title: "Student UMS Portal",
      description: "A multi-purpose student life management tool that centralizes academic data, schedules, and daily utilities in one place.",
      longDescription: "This Student UMS is more than just a portal; it's a personal digital assistant for university life. It addresses the common student problem of having data scattered across multiple apps and files. By centralizing reminders, notes, daily timetables, and even bus passes, it allows students to access everything they need in one place. It also links with exam schedules and supports quizzes, making it the ultimate tool for academic organization and efficiency.",
      features: [
        "Centralized File & Note Storage",
        "Daily & Exam Timetable Linking",
        "Interactive Reminders & Quizzes",
        "Digital Bus Pass Tracking",
        "Simplified Data Management"
      ],
      tech: ["HTML", "CSS", "JavaScript"],
      image: "/assets/project2/home.png",
      gallery: [
        "/assets/project2/home.png",
        "/assets/project2/login.png",
        "/assets/project2/profile.png"
      ],
      link: "/project/ums-portal"
    }
  ]
};
