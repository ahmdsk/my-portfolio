"use client";
import { useEffect, useState } from "react";
import ProjectCard from "@/components/project-card";
import SkeletonCard from "./skeleton-card";
import { Project } from "@/types";

const mockProjects: Project[] = [
  {
    id: "1",
    title: "AI Chat App",
    description: "Chatbot modern dengan RAG dan caching",
    tags: ["Next.js", "AI", "RAG"],
    url: "#",
    shortDescription: "Chatbot modern dengan RAG dan caching"
  },
  {
    id: "2",
    title: "E‑Commerce UI",
    description: "UI/UX e‑commerce minimalis, cepat, responsif",
    tags: ["Tailwind", "UI"],
    url: "#",
    shortDescription: "UI/UX e‑commerce minimalis, cepat, responsif"
  },
  {
    id: "3",
    title: "Realtime Board",
    description: "Kolaborasi realtime dengan Firebase",
    tags: ["Firebase", "Realtime"],
    url: "#",
    shortDescription: "Kolaborasi realtime dengan Firebase"
  },
  {
    id: "4",
    title: "Design Tokens",
    description: "Sistem token warna OKLCH yang konsisten",
    tags: ["Design System", "OKLCH"],
    url: "#",
    shortDescription: "Sistem token warna OKLCH yang konsisten"
  },
];

export default function Projects() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<typeof mockProjects>([]);

  useEffect(() => {
    // Simulasi fetch: ganti dengan fetch asli jika perlu
    const t = setTimeout(() => {
      setProjects(mockProjects);
      setLoading(false);
    }, 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="projects" className="space-y-4">
      <div className="mb-2 flex items-end justify-between">
        <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
          Proyek Unggulan
        </h2>
        <a
          href="#"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Lihat semua
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          : projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} gradient />
            ))}
      </div>
    </section>
  );
}
