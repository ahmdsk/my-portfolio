"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"google" | "github" | null>(null);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      console.log("Login response:", res);

      if (res?.error) {
        toast.error("Username atau password salah 🚫");
        return;
      }

      // sukses
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login gagal, coba lagi!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setOauthLoading(provider);
    try {
      // biarkan NextAuth yang redirect
      await signIn(provider, { callbackUrl: "/saran" });
    } catch (err) {
      console.error("OAuth error:", err);
      toast.error(`Login ${provider} gagal, coba lagi!`);
      setOauthLoading(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      {/* Glow Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,var(--brand)_0%,transparent_70%)] opacity-30 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-2xl border bg-card/60 backdrop-blur p-8 shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-brand to-primary bg-clip-text text-transparent">
          Berikan saran dan kritik
        </h1>
        <p className="text-muted-foreground text-center mt-2 mb-6">
          Silakan masuk untuk memberikan saran atau kritik Anda.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="sr-only">Username</label>
            <Input
              id="username"
              placeholder="Username"
              value={username}
              autoComplete="username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="sr-only">Password</label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-brand hover:bg-brand/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden />
                Masuk...
              </span>
            ) : (
              "Masuk"
            )}
          </Button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">atau</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* Login dengan Google & GitHub */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Masuk cepat dengan:</p>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* GOOGLE */}
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOAuth("google")}
              disabled={oauthLoading !== null}
              className="flex items-center justify-center gap-2 border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
              aria-label="Masuk dengan Google"
            >
              {oauthLoading === "google" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden />
              ) : (
                <FcGoogle size={18} />
              )}
              Google
            </Button>

            {/* GITHUB */}
            <Button
              type="button"
              onClick={() => handleOAuth("github")}
              disabled={oauthLoading !== null}
              className="flex items-center justify-center gap-2 bg-[#181717] text-white hover:bg-black"
              aria-label="Masuk dengan GitHub"
            >
              {oauthLoading === "github" ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/80 border-r-transparent" aria-hidden />
              ) : (
                <FaGithub size={18} />
              )}
              GitHub
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
