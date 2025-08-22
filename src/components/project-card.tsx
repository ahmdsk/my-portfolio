// components/project-card.tsx  (versi final yang menampilkan gambar + shortDescription)
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Project } from "@/types";

export default function ProjectCard({
  project,
  index = 0,
  gradient = false,
}: {
  project: Project;
  index?: number;
  gradient?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative rounded-xl border p-4 shadow-sm backdrop-blur transition-all
         hover:-translate-y-0.5 hover:shadow-md hover:border-brand/40
         ${
           gradient
             ? "bg-[linear-gradient(180deg,oklch(1_0_0_/0.65),oklch(1_0_0_/0.45))] dark:bg-[linear-gradient(180deg,oklch(0.17_0_0_/0.65),oklch(0.17_0_0_/0.45))]"
             : "bg-card/60 supports-[backdrop-filter]:bg-card/50"
         }`}
    >
      {project.cover ? (
        <div className="mb-3 overflow-hidden rounded-lg">
          <div className="relative h-40 w-full">
            <Image
              src={project.cover}
              alt={project.coverAlt ?? project.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={index < 3}
            />
          </div>
        </div>
      ) : null}

      <span className="pointer-events-none absolute right-3 top-3 inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-r from-brand to-primary opacity-70" />

      <h3 className="line-clamp-1 text-base font-semibold tracking-tight">{project.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
        {project.shortDescription || project.description}
      </p>

      <ul className="mt-3 flex flex-wrap gap-1.5">
        {project.tags?.map((t) => (
          <li
            key={t}
            className="rounded-full border bg-background/70 px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center justify-between">
        <Link
          href={project.url ?? "#"}
          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-foreground hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          Detail <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      <span className="pointer-events-none absolute inset-0 rounded-xl ring-0 ring-brand/0 transition group-hover:ring-2 group-hover:ring-brand/20" />
    </motion.article>
  );
}
