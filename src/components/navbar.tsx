"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeDropdown from "./theme-dropdown";

export default function Navbar() {
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Home" },
    { href: "/#projects", label: "Proyek" },
    { href: "/#contact", label: "Kontak" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Link href="/" className="text-base font-semibold tracking-tight bg-gradient-to-r from-brand to-primary bg-clip-text text-transparent">
          Ahmad<span className="opacity-70">.dev</span>
        </Link>
        <nav className="flex items-center gap-1.5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-xl px-3 py-2 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 hover:bg-secondary ${pathname === l.href ? "text-brand" : "text-muted-foreground hover:text-foreground"}`}
            >
              {l.label}
            </Link>
          ))}
          <ThemeDropdown />
        </nav>
      </div>
    </header>
  );
}