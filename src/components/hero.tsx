"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border-none bg-card/45 p-8 md:p-12 shadow-sm">
      {/* Hero gradient background (layered) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand/5 to-transparent" />
        <div className="absolute left-[-10%] top-[-20%] h-[50vh] w-[50vw] rounded-full bg-[radial-gradient(circle_at_center,var(--brand)_0%,transparent_70%)] opacity-20 blur-3xl" />
        <div className="absolute right-[-15%] bottom-[-30%] h-[60vh] w-[60vw] rounded-full bg-[conic-gradient(from_90deg,var(--brand),transparent_70%)] opacity-15 blur-2xl" />
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-pretty text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-brand via-indigo-500 to-primary bg-clip-text text-transparent"
      >
        Halo, saya Ahmad 👋
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="mt-4 max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground"
      >
        Frontend/Full‑stack developer yang fokus membangun produk modern dengan
        performa, aksesibilitas, dan estetika.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        className="mt-8 flex flex-wrap gap-3"
      >
        <Link href="#projects" className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand via-indigo-500 to-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:shadow md:px-5">
          Lihat Proyek
        </Link>
        <Link href="#contact" className="inline-flex items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition hover:bg-secondary md:px-5">
          Kontak
        </Link>
      </motion.div>
    </section>
  );
}