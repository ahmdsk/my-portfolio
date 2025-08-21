"use client";
export default function SkeletonCard() {
  return (
    <div className="rounded-xl border bg-card/60 p-4 shadow-sm animate-pulse">
      <div className="h-5 w-3/5 rounded-md bg-muted" />
      <div className="mt-2 h-4 w-11/12 rounded-md bg-muted" />
      <div className="mt-1 h-4 w-7/12 rounded-md bg-muted" />
      <div className="mt-3 flex gap-2">
        <div className="h-6 w-16 rounded-full bg-muted" />
        <div className="h-6 w-14 rounded-full bg-muted" />
        <div className="h-6 w-20 rounded-full bg-muted" />
      </div>
      <div className="mt-4 h-8 w-24 rounded-md bg-muted" />
    </div>
  );
}
