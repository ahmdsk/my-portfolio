"use client";
import Hero from "@/components/hero";
import Projects from "@/components/projects";
import Contact from "@/components/contact";

export default function Page() {
  return (
    <div className="space-y-16 md:space-y-20">
      <Hero />
      <Projects />
      <Contact />
    </div>
  );
}