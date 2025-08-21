"use client";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
import { db, saranConverter } from "@/lib/firebase";
import { useSession, signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import CommentItem from "@/components/comment-item";
import { motion, AnimatePresence } from "framer-motion";
import type { Saran } from "@/types";

export default function SaranPage() {
  const { data: session } = useSession();
  const [message, setMessage] = useState("");
  const [items, setItems] = useState<Saran[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Realtime listener — FIX: sertakan doc.id agar tipe = Saran (ada id)
  useEffect(() => {
    const q = query(
      collection(db, "saran").withConverter(saranConverter),
      orderBy("createdAt", "desc"),
      limit(100)
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        const next: Saran[] = snap.docs.map((d) => {
          const data = d.data() as Omit<Saran, "id">; // data tanpa id
          return { id: d.id, ...data };
        });
        setItems(next);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  // validasi pesan
  const canSend = useMemo(() => {
    const t = message.trim();
    return t.length > 0 && t.length <= 1000 && !sending;
  }, [message, sending]);

  // Submit — gunakan optimistic update + FIX: addDoc tanpa field id
  const submit = useCallback(async () => {
    if (!session) {
      await signIn();
      return;
    }
    if (!canSend) return;

    setSending(true);
    setError(null);

    const optimistic: Saran = {
      id: `optimistic-${Date.now()}`,
      name: session.user?.name ?? "Anon",
      userId: session.user?.email ?? "anon",
      message: message.trim(),
      createdAt: new Date(), // sementara
    };

    setItems((prev) => [optimistic, ...prev]);
    setMessage("");

    try {
      await addDoc(collection(db, "saran").withConverter(saranConverter), {
        name: optimistic.name,
        userId: optimistic.userId,
        message: optimistic.message,
        createdAt: serverTimestamp() as unknown as Date,
        // ❌ jangan kirim id; Firestore yang buat
      } as Omit<Saran, "id">);

      // onSnapshot akan mengganti item optimistic dengan versi server (punya id asli)
    } catch (e: any) {
      // rollback
      setItems((prev) => prev.filter((i) => i.id !== optimistic.id));
      setError(e?.message ?? "Gagal mengirim. Coba lagi.");
      setMessage(optimistic.message);
    } finally {
      setSending(false);
      textareaRef.current?.focus();
    }
  }, [session, canSend, message]);

  // Keyboard: Ctrl/Cmd + Enter kirim
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      void submit();
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl border-none bg-card/45 p-6 md:p-8 shadow-sm backdrop-blur">
      {/* background senada Hero */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand/5 to-transparent" />
        <div className="absolute left-[-12%] top-[-25%] h-[48vh] w-[48vw] rounded-full bg-[radial-gradient(circle_at_center,var(--brand)_0%,transparent_70%)] opacity-20 blur-3xl" />
        <div className="absolute right-[-18%] bottom-[-35%] h-[58vh] w-[58vw] rounded-full bg-[conic-gradient(from_90deg,var(--brand),transparent_70%)] opacity-15 blur-2xl" />
      </div>

      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex items-center justify-between"
      >
        <h2 className="text-xl md:text-2xl font-semibold tracking-tight bg-gradient-to-r from-brand via-indigo-500 to-primary bg-clip-text text-transparent">
          Saran & Komentar
        </h2>
        <span className="text-xs text-muted-foreground">
          {loading ? "Memuat…" : `${items.length} entri`}
        </span>
      </motion.div>

      {/* composer */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end gap-2"
      >
        <div className="flex-1">
          <label htmlFor="saran" className="sr-only">
            Tulis saran
          </label>
          <Textarea
            ref={textareaRef}
            id="saran"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Tulis saran/komen kamu di sini… (Ctrl/Cmd + Enter untuk kirim)"
            className="min-h-24 resize-y border bg-background/70"
            maxLength={1000}
            aria-invalid={!!error}
            aria-describedby={error ? "saran-error" : undefined}
          />
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {message.trim().length}/1000
            </span>
            {!session && (
              <button
                type="button"
                onClick={() => void signIn()}
                className="text-xs underline text-muted-foreground hover:text-foreground"
              >
                Masuk untuk mengirim
              </button>
            )}
          </div>
        </div>
        <Button
          onClick={() => void submit()}
          className="h-10 rounded-xl bg-gradient-to-r from-brand via-indigo-500 to-primary text-white"
          disabled={!canSend}
        >
          {sending ? "Mengirim…" : "Kirim"}
        </Button>
      </motion.div>

      {/* status */}
      <div
        role="status"
        aria-live="polite"
        className="mt-2 min-h-5 text-sm text-destructive"
        id="saran-error"
      >
        {error ?? ""}
      </div>

      {/* list */}
      <div className="mt-6 space-y-3">
        {loading ? (
          <SkeletonList />
        ) : items.length === 0 ? (
          <EmptyState />
        ) : (
          <AnimatePresence initial={false}>
            {items.map((it, idx) => (
              <motion.div
                key={it.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: idx * 0.02 }}
              >
                <CommentItem name={it.name} message={it.message} id={""} />
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </section>
  );
}

/* ====== Subcomponents ====== */

function SkeletonList() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border bg-background/60 p-4 shadow-sm animate-pulse"
        >
          <div className="h-4 w-1/3 rounded bg-muted" />
          <div className="mt-2 h-4 w-11/12 rounded bg-muted" />
          <div className="mt-1 h-4 w-8/12 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border bg-background/60 p-6 text-center">
      <p className="text-sm text-muted-foreground">
        Belum ada saran. Jadilah yang pertama! ✨
      </p>
    </div>
  );
}
