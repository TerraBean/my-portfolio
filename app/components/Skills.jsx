import { FaReact, FaNodeJs, FaPython, FaHtml5, FaCss3Alt, FaJava } from "react-icons/fa";
import { SiTypescript, SiNextdotjs, SiFlutter, SiFigma, SiTailwindcss, SiFirebase, SiMongodb, SiPostgresql } from "react-icons/si";

const skills = [
  { name: "JavaScript", icon: <FaReact color="#F7DF1E" /> },
  { name: "TypeScript", icon: <SiTypescript color="#3178C6" /> },
  { name: "Next.js", icon: <SiNextdotjs color="black" /> },
  { name: "React", icon: <FaReact color="#61DAFB" /> },
  { name: "Flutter", icon: <SiFlutter color="#02569B" /> },
  { name: "Dart", icon: <SiFlutter color="#0175C2" /> },
  { name: "HTML", icon: <FaHtml5 color="#E34F26" /> },
  { name: "CSS", icon: <FaCss3Alt color="#1572B6" /> },
  { name: "Figma", icon: <SiFigma color="#F24E1E" /> },
  { name: "PostgreSQL", icon: <SiPostgresql color="#336791" /> },
  { name: "MongoDB", icon: <SiMongodb color="#47A248" /> },
  { name: "Firebase", icon: <SiFirebase color="#FFCA28" /> },
  { name: "TailwindCSS", icon: <SiTailwindcss color="#38B2AC" /> },
  { name: "Python", icon: <FaPython color="#3776AB" /> },
  { name: "Java", icon: <FaJava color="#007396" /> },
  { name: "Node.js", icon: <FaNodeJs color="#339933" /> },
];

export default function Skills() {
  return (
    <div className="grid bg-[#000000] grid-cols-2 sm:grid-cols-4 gap-4 text-center">
      {skills.map((skill) => (
        <div key={skill.name} className="flex flex-col items-center space-y-2">
          {skill.icon}
          <p>{skill.name}</p>
        </div>
      ))}
    </div>
  );
}
