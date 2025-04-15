'use client';

import Image from "next/image";
import Hero from "./components/Hero";
import Testimonial from "./components/Testimonial";
import { AtSymbolIcon, UserIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { motion } from "framer-motion";

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

const processSteps = [
  {
    title: "Discovery",
    description: "Understanding your needs and project requirements through in-depth consultation.",
    icon: "🔍"
  },
  {
    title: "Planning",
    description: "Creating detailed project roadmap and architecture design.", 
    icon: "📋"
  },
  {
    title: "Development",
    description: "Building your solution with clean, efficient code and regular updates.",
    icon: "💻"
  },
  {
    title: "Launch",
    description: "Thorough testing and deployment with ongoing support.",
    icon: "🚀"
  }
];

export default function Home() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState({
    loading: false,
    success: false,
    error: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to send message');

      setStatus({ loading: false, success: true, error: '' });
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus({
        loading: false,
        success: false,
        error: 'Failed to send message. Please try again.'
      });
    }
  };

  return (
    <main>
      <Hero />
      {/* About Section */}
      <section id="about" className="w-full bg-[#010F1A] text-white py-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="px-10"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <Image
                  src="/images/mujahid1.jpg"
                  alt="About Image"
                  width={500}
                  height={500}
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute inset-0 bg-brand-red opacity-20 rounded-lg"></div>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex flex-col gap-8 justify-center items-start px-10"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.h1 
                className="text-3xl sm:text-4xl lg:text-5xl text-brand-red font-bold relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                About Me
                <span className="absolute -bottom-2 left-0 w-20 h-1 bg-brand-red"></span>
              </motion.h1>
              
              <motion.p 
                className="text-base sm:text-lg lg:text-xl leading-relaxed text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
              >
                I am a results-driven software engineer specializing in mobile and web application development with technologies like Flutter, Firebase, and Next.js. My projects prioritize usability, performance, and real-world impact.
              </motion.p>
              
              <motion.p 
                className="text-base sm:text-lg lg:text-xl leading-relaxed text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                Teaching is a key part of my journey, from mentoring students in web technologies to empowering them with essential IT and design skills. I thrive on solving complex challenges and creating innovative solutions.
              </motion.p>
              
              <motion.div 
                className="flex gap-4 mt-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                viewport={{ once: true }}
              >
                <a 
                  href="#contact" 
                  className="bg-brand-red text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300"
                >
                  Get in Touch
                </a>
                <a 
                  href="#projects" 
                  className="border border-brand-red text-brand-red px-6 py-3 rounded-lg hover:bg-brand-red hover:text-white transition-all duration-300"
                >
                  View Work
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="w-full bg-[#000000] text-white px-8 lg:px-40 py-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl text-center text-brand-red font-bold mb-8">Skills</h2>
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
              <p className="text-sm sm:text-base lg:text-lg font-semibold">{skill.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="w-full bg-[#000000] text-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl text-brand-red font-bold text-center mb-16">How I Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-[#1A1A1A] rounded-lg transform hover:scale-105 transition-transform duration-300">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="w-full bg-[#010F1A] text-white py-20">
        <div className="container mx-auto px-4">
          <motion.h2 
            className="text-2xl sm:text-3xl lg:text-4xl text-brand-red font-bold text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Featured Projects
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div 
                key={index} 
                className="group glass-effect rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="relative overflow-hidden">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    width={500}
                    height={300}
                    className="rounded-t-lg group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="flex gap-4">
                      <a href={project.projectUrl} target="_blank" rel="noopener noreferrer"
                        className="bg-brand-red text-white py-2 px-4 rounded-md hover:bg-opacity-80">
                        View Project
                      </a>
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                          className="bg-[#333] text-white py-2 px-4 rounded-md hover:bg-opacity-80">
                          View Code
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2">{project.title}</h3>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="bg-brand-red bg-opacity-20 text-brand-red px-2 py-1 rounded text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-[#1A1A1A] py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-brand-red font-bold text-center mb-10">
            Contact Me
          </h2>
          
          <div className="space-y-6">
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Your Name" 
                className="w-full pl-12 pr-4 py-3 bg-[#2A2A2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red transition-all duration-300" 
              />
            </div>

            <div className="relative">
              <AtSymbolIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full pl-12 pr-4 py-3 bg-[#2A2A2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red transition-all duration-300" 
              />
            </div>

            <div className="relative">
              <textarea 
                placeholder="Your Message" 
                rows={6} 
                className="w-full px-4 py-3 bg-[#2A2A2A] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red transition-all duration-300" 
              />
            </div>

            <button 
              type="submit" 
              className="w-full md:w-auto px-8 py-3 bg-brand-red text-white rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
            >
              Send Message
            </button>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <Testimonial />
    </main >
  );
}
