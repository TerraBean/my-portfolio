'use client';

import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

// Lazy load icons
const IconComponents = {
  FaReact: lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaReact }))),
  FaNodeJs: lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaNodeJs }))),
  FaPython: lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaPython }))),
  FaHtml5: lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaHtml5 }))),
  FaCss3Alt: lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaCss3Alt }))),
  FaJava: lazy(() => import('react-icons/fa').then(mod => ({ default: mod.FaJava }))),
  SiTypescript: lazy(() => import('react-icons/si').then(mod => ({ default: mod.SiTypescript }))),
  SiNextdotjs: lazy(() => import('react-icons/si').then(mod => ({ default: mod.SiNextdotjs }))),
  SiFlutter: lazy(() => import('react-icons/si').then(mod => ({ default: mod.SiFlutter }))),
  SiFigma: lazy(() => import('react-icons/si').then(mod => ({ default: mod.SiFigma }))),
  SiTailwindcss: lazy(() => import('react-icons/si').then(mod => ({ default: mod.SiTailwindcss }))),
  SiFirebase: lazy(() => import('react-icons/si').then(mod => ({ default: mod.SiFirebase }))),
  SiMongodb: lazy(() => import('react-icons/si').then(mod => ({ default: mod.SiMongodb }))),
  SiPostgresql: lazy(() => import('react-icons/si').then(mod => ({ default: mod.SiPostgresql }))),
};

const skills = [
  { name: "JavaScript", icon: <IconComponents.FaReact color="#F7DF1E" /> },
  { name: "TypeScript", icon: <IconComponents.SiTypescript color="#3178C6" /> },
  { name: "Next.js", icon: <IconComponents.SiNextdotjs color="black" /> },
  { name: "React", icon: <IconComponents.FaReact color="#61DAFB" /> },
  { name: "Flutter", icon: <IconComponents.SiFlutter color="#02569B" /> },
  { name: "Dart", icon: <IconComponents.SiFlutter color="#0175C2" /> },
  { name: "HTML", icon: <IconComponents.FaHtml5 color="#E34F26" /> },
  { name: "CSS", icon: <IconComponents.FaCss3Alt color="#1572B6" /> },
  { name: "Figma", icon: <IconComponents.SiFigma color="#F24E1E" /> },
  { name: "PostgreSQL", icon: <IconComponents.SiPostgresql color="#336791" /> },
  { name: "MongoDB", icon: <IconComponents.SiMongodb color="#47A248" /> },
  { name: "Firebase", icon: <IconComponents.SiFirebase color="#FFCA28" /> },
  { name: "TailwindCSS", icon: <IconComponents.SiTailwindcss color="#38B2AC" /> },
  { name: "Python", icon: <IconComponents.FaPython color="#3776AB" /> },
  { name: "Java", icon: <IconComponents.FaJava color="#007396" /> },
  { name: "Node.js", icon: <IconComponents.FaNodeJs color="#339933" /> },
];

export default function Skills() {
  return (
    <div className="grid bg-[#000000] grid-cols-2 sm:grid-cols-4 gap-4 text-center">
      {skills.map((skill) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center space-y-2"
        >
          <Suspense fallback={<div className="w-6 h-6 bg-gray-200 animate-pulse rounded" />}>
            {skill.icon}
          </Suspense>
          <p>{skill.name}</p>
        </motion.div>
      ))}
    </div>
  );
}
