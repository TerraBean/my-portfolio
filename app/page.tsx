import Image from "next/image";
import Hero from "./components/Hero";

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
    </main>
  );
}
