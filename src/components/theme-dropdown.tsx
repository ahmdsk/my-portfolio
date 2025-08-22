"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun, Laptop, ChevronDown } from "lucide-react";

/**
 * ThemeDropdown
 * - Headless dropdown: Light / Dark / System
 * - Aksesibel (ARIA), keyboard-friendly (↑/↓, Enter/Space, Esc)
 * - Hindari hydration mismatch via mounted state
 * - Shortcut: Ctrl/Cmd + J untuk toggle Light <-> Dark
 */

type ThemeValue = "light" | "dark" | "system";

const ITEMS: Record<
  ThemeValue,
  {
    value: ThemeValue;
    label: string;
    Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  }
> = {
  light: { value: "light", label: "Light", Icon: Sun },
  dark: { value: "dark", label: "Dark", Icon: Moon },
  system: { value: "system", label: "System", Icon: Laptop },
};

// Urutan tampilan & navigasi keyboard
const ORDER: ThemeValue[] = ["light", "dark", "system"];

function getCurrentKey(
  theme: string | undefined,
  resolved: string | undefined
): ThemeValue {
  if (theme === "system") return "system";
  if (resolved === "dark") return "dark";
  return "light";
}

export default function ThemeDropdown() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = React.useState(0);

  React.useEffect(() => setMounted(true), []);

  // Sinkronkan activeIndex dengan tema sekarang
  React.useEffect(() => {
    const idx = ORDER.indexOf(getCurrentKey(theme, resolvedTheme));
    setActiveIndex(idx < 0 ? 0 : idx);
  }, [theme, resolvedTheme]);

  const handleSelect = React.useCallback((value: ThemeValue) => {
    setTheme(value);
    setOpen(false);
  }, [setTheme, setOpen]);

  // Klik di luar & keyboard handlers
  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!open) return;
      const t = e.target as HTMLElement | null;
      if (
        t &&
        !menuRef.current?.contains(t) &&
        !buttonRef.current?.contains(t)
      ) {
        setOpen(false);
      }
    };

    const onKey = (e: KeyboardEvent) => {
      // const openKeys =
      //   e.key === "ArrowDown" || e.key === "ArrowUp";

      // toggle dengan cmd/ctrl + J
      const openKeys =
        (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j";

      if (!open && openKeys) {
        setOpen(true);
        e.preventDefault();
        return;
      }

      if (!open) return;

      switch (e.key) {
        case "Escape":
          setOpen(false);
          break;
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((i) => (i + 1) % ORDER.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((i) => (i - 1 + ORDER.length) % ORDER.length);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          handleSelect(ORDER[activeIndex] ?? "system");
          break;
      }
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, activeIndex, handleSelect]);

  // Shortcut global: Ctrl/Cmd + J → toggle light/dark
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isCmdJ = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j";
      if (!isCmdJ) return;
      e.preventDefault();
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resolvedTheme, setTheme]);

  if (!mounted) {
    // Skeleton kecil biar gak mismatch
    return (
      <button
        aria-label="Tema"
        className="inline-flex h-9 items-center gap-2 rounded-xl border bg-background/70 px-3 text-sm shadow-sm"
      >
        <Sun className="h-4 w-4" />
        Tema
        <ChevronDown className="h-4 w-4 opacity-60" />
      </button>
    );
  }

  const currentKey = getCurrentKey(theme, resolvedTheme);
  const current = ITEMS[currentKey]; // selalu defined

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="theme-menu"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-9 items-center gap-2 rounded-xl border bg-background/70 px-3 text-sm shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        title="Ganti tema (Ctrl/Cmd + J)"
      >
        <current.Icon className="h-4 w-4" />
        {current.label}
        <ChevronDown className="h-4 w-4 opacity-60" />
      </button>

      {open && (
        <div
          ref={menuRef}
          id="theme-menu"
          role="menu"
          aria-label="Pilih tema"
          className="absolute right-0 z-50 mt-2 min-w-[9rem] overflow-hidden rounded-xl border bg-popover/80 backdrop-blur shadow-lg"
        >
          <div className="p-1">
            {ORDER.map((key, i) => {
              const item = ITEMS[key];
              const checked =
                key === (theme === "system" ? "system" : currentKey);

              return (
                <button
                  key={key}
                  role="menuitemradio"
                  aria-checked={checked}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => handleSelect(key)}
                  className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition outline-none
                    ${i === activeIndex ? "bg-secondary" : ""}
                    ${checked ? "text-brand" : "text-foreground"}`}
                >
                  <item.Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
