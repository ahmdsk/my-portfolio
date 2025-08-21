import "./globals.css";
import { ThemeProvider } from "next-themes";
import { auth } from "@/auth";
import Navbar from "@/components/navbar";
import type { ReactNode } from "react";

export const metadata = {
  title: "Portofolio | Ahmad",
  description: "Portofolio modern Next.js 15, Firebase, NextAuth, shadcn/ui",
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        {/* Global background with subtle gradients (supports dark mode) */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
          <div className="absolute left-1/2 top-[-20%] h-[60vh] w-[80vw] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,var(--brand)_0%,transparent_70%)] opacity-[0.15] blur-3xl" />
          <div className="absolute right-[-10%] bottom-[-20%] h-[50vh] w-[60vw] rounded-full bg-[conic-gradient(from_180deg,var(--brand),transparent_70%)] opacity-[0.12] blur-2xl" />
        </div>

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <main className="mx-auto w-full max-w-6xl px-4 md:px-6 py-10">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
