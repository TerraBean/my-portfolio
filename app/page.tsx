import Image from "next/image";
import Hero from "./components/Hero";

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
    name:"React",
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
              <p>I am a results-driven software engineer specializing in mobile and web application development with technologies like Flutter, Firebase, and Next.js. My projects prioritize usability, performance, and real-world impact.
                Teaching is a key part of my journey, from mentoring students in web technologies to empowering them with essential IT and design skills.
                I thrive on solving complex challenges and creating innovative solutions. Beyond coding, I&apos;m passionate about exploring current affairs, engaging in critical thinking, and continuously learning.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="w-full bg-[#000000] text-white px-8 py-10">
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
    </main>
  );
}
