"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeDropdown from "./theme-dropdown";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/#projects", label: "Proyek" },
    { href: "/#contact", label: "Kontak" },
    { href: "/saran", label: "Saran" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight bg-gradient-to-r from-brand to-primary bg-clip-text text-transparent"
        >
          Ahmad<span className="opacity-70">.dev</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1.5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-xl px-3 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 hover:bg-secondary ${
                pathname === l.href
                  ? "text-brand"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <ThemeDropdown />
        </nav>

        {/* Mobile button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-secondary transition"
          onClick={() => setOpen(!open)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu with staggered animation */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="md:hidden border-t bg-background/95 backdrop-blur-md shadow-lg"
          >
            <motion.nav
              variants={container}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="flex flex-col px-4 py-4 space-y-2"
            >
              {links.map((l) => (
                <motion.div key={l.href} variants={item}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-3 py-2 text-sm transition-all hover:bg-secondary ${
                      pathname === l.href
                        ? "text-brand"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div variants={item}>
                <ThemeDropdown />
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
