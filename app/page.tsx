'use client';

import Image from "next/image";
import Hero from "./components/Hero";
import Testimonial from "./components/Testimonial";
import { AtSymbolIcon, UserIcon } from "@heroicons/react/24/outline";

// Create an array for skills using data from icons folder in public, the data will be an array of objects with name and image properties
const skills = [
  {
    name: "NextJS",
    image: "/icons/next-js.svg",
  },
  // add flutter, nodejs, and dart to the skills array
  {
    name: "Flutter",
    image: "/icons/flutter.svg",
  },
  {
    name: "Dart",
    image: "/icons/dart.svg",
  },
  {
    name: "Firebase",
    image: "/icons/firebase.svg",
  },
  {
    name: "HTML",
    image: "/icons/html.svg",
  },
  {
    name: "CSS",
    image: "/icons/css.svg",
  },
  {
    name: "Javascript",
    image: "/icons/js.svg",
  },
  {
    name: "React",
    image: "/icons/react.svg",
  },
  {
    name: "Figma",
    image: "/icons/figma.svg",
  },
  {
    name: "Java",
    image: "/icons/java.svg",
  },

  {
    name: "MySql",
    image: "/icons/mysql.svg",
  },
  {
    name: "Node.js",
    image: "/icons/nodejs.svg",
  },
  {
    name: "Python",
    image: "/icons/python.svg",
  },
  {
    name: "Illustrator",
    image: "/icons/illustrator.svg",
  },
  {
    name: "Photoshop",
    image: "/icons/photoshop.svg",
  },
];

interface Project {
  title: string;
  description: string;
  imageUrl: string; // URL or path to the project image
  projectUrl: string; // Link to the live project
  githubUrl?: string; // Optional: Link to the GitHub repository
  technologies: string[]; // List of technologies used
}

const projects: Project[] = [
  {
    title: "Elirod Soccer Accademy",
    description: "At EliRod Soccer Academy, we are passionate about helping young athletes unlock their full potential.",
    imageUrl: "/images/elirodacademy.jpeg",
    projectUrl: "https://elirodsocceracademy.com",
    technologies: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    title: "Awurade Ne Yenhwfo",
    description: "Awurade ne yɛn hwɛfoɔ is an organization dedicated to advocating for the interests of Ghanaians and fostering community engagement.",
    imageUrl: "/images/awuradeneyenhwefo.jpeg",
    projectUrl: "https://awuradeneyenhwefo.org",
    technologies: ["Next.js,", "Tailwind", "Typescript"],
  },
  {
    title: "WhisperNews",
    description: "WhisperNews is a news platform that provides users with the latest news and updates.",
    imageUrl: "/images/whispernews.jpeg",
    projectUrl: "https://whispernews.vercel.app/",
    technologies: ["Vue.js", "Firebase", "SASS"],
  },
];

export default function Home() {
  return (
    <main>
      <Hero />
      {/* About Section */}
      <section id="about" className="w-full bg-[#010F1A] text-white py-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="px-10">
              <Image
                src="/images/mujahid1.jpg"
                alt="About Image"
                width={500}
                height={500}
                className="rounded-lg"
              />
            </div>
            <div className="flex flex-col gap-10 justify-center items-start px-10">
              <h1 className="text-3xl text-brand-red font-bold">About</h1>
              <p className="text-xl">I am a results-driven software engineer specializing in mobile and web application development with technologies like Flutter, Firebase, and Next.js. My projects prioritize usability, performance, and real-world impact.
                Teaching is a key part of my journey, from mentoring students in web technologies to empowering them with essential IT and design skills.
                I thrive on solving complex challenges and creating innovative solutions. Beyond coding, I&apos;m passionate about exploring current affairs, engaging in critical thinking, and continuously learning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="w-full bg-[#000000] text-white px-8 lg:px-40 py-10">
        <h2 className="text-3xl text-center text-brand-red font-bold mb-8">Skills</h2>
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center py-10 justify-center gap-4 p-4 bg-[#1F1F1F] rounded-lg"
            >
              <Image
                src={skill.image}
                alt={skill.name}
                width={50}
                height={50}
              />
              <p className="text-sm font-semibold md:text-lg">{skill.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="w-full bg-[#010F1A] text-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-brand-red font-bold text-center mb-10">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-[#1A1A1A]  rounded-lg overflow-hidden">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={500}
                  height={300}
                  className="rounded-t-lg"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-gray-300 mb-4">{project.description}</p>
                  <div className="flex gap-4">
                    <a
                      href={project.projectUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-brand-red text-white py-2 px-4 rounded-md text-sm hover:bg-opacity-80"
                    >
                      View Project
                    </a>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-[#333] text-white py-2 px-4 rounded-md text-sm hover:bg-opacity-80"
                      >
                        View Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section className="bg-[#1A1A1A]">
        <div className="container mx-auto px-4 py-20">
          <h2 className="text-3xl text-brand-red font-bold text-center mb-10">
            Contact Me
          </h2>
          <div className="relative">
            <input  type="text" placeholder="Enter Your Name" className="w-full peer block pl-10 py-[9px]  rounded-lg mb-4 border-orange-700" />
            <UserIcon className="absolute top-1/2 h-[18px] w-[18px] outline-2 -translate-y-1/2 left-4 peer-focus:text-black  text-gray-400" />
          </div>
      

         <div className="relative">
          <input 
          type="text" 
          className="w-full rounded-lg py-[9px] pl-10 peer text-gray-500"
          placeholder="Enter your email" />

          <AtSymbolIcon className="w-[19px] absolute top-1/2 -translate-y-1/2 left-3 h-[19px] text-gray-400 peer-focus:text-black"/>
         </div>

        </div>
      </section>

      {/* Testimonial Section */}
      <Testimonial />
    </main >
  );
}
