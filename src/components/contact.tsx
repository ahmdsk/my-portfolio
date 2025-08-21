"use client";
import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Contact() {
  const socials = [
    { href: "mailto:you@example.com", label: "Email", Icon: Mail },
    { href: "https://linkedin.com", label: "LinkedIn", Icon: Linkedin },
    { href: "https://github.com", label: "GitHub", Icon: Github },
  ];

  return (
    <section id="contact" className="py-6">
      <div className="relative overflow-hidden rounded-2xl border-none bg-card/45 p-8 md:p-12 shadow-sm backdrop-blur">
        {/* Background gradient (sama pola dengan Hero) */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand/5 to-transparent" />
          <div className="absolute left-[-12%] top-[-25%] h-[48vh] w-[48vw] rounded-full bg-[radial-gradient(circle_at_center,var(--brand)_0%,transparent_70%)] opacity-20 blur-3xl" />
          <div className="absolute right-[-18%] bottom-[-35%] h-[58vh] w-[58vw] rounded-full bg-[conic-gradient(from_90deg,var(--brand),transparent_70%)] opacity-15 blur-2xl" />
        </div>

        <div className="flex flex-col items-center text-center">
          <h2 className="text-pretty text-2xl md:text-3xl font-semibold tracking-tight bg-gradient-to-r from-brand via-indigo-500 to-primary bg-clip-text text-transparent">
            Mari Terhubung
          </h2>
          <p className="mt-2 max-w-xl text-sm md:text-base text-muted-foreground">
            Terbuka untuk kolaborasi & peluang baru 🚀
          </p>

          <div className="mt-6 flex gap-3">
            {socials.map(({ href, label, Icon }) => (
              <Link
                key={href}
                href={href}
                aria-label={label}
                target={href.startsWith("http") ? "_blank" : undefined}
                className="group inline-flex h-11 w-11 items-center justify-center rounded-full border bg-background/70 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <Icon className="h-5 w-5 text-muted-foreground transition group-hover:text-brand" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
