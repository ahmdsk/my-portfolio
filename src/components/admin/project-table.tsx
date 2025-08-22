"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { db, projectConverter } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import toast from "react-hot-toast";
import { Project } from "@/types";

export default function ProjectTable() {
  const [rows, setRows] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "projects").withConverter(projectConverter), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setRows(snap.docs.map((d) => d.data() as Project));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    const ok = window.confirm("Hapus project ini?");
    if (!ok) return;
    try {
      await deleteDoc(doc(db, "projects", id));
      toast.success("Project dihapus");
    } catch (e) {
      console.error(e);
      toast.error("Gagal menghapus project");
    }
  };

  const content = useMemo(() => {
    if (loading) {
      return (
        <TableRow>
          <TableCell colSpan={4}>
            <div className="h-9 w-full animate-pulse rounded bg-muted" />
          </TableCell>
        </TableRow>
      );
    }
    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">
            Belum ada project. Tambahkan dari form di atas.
          </TableCell>
        </TableRow>
      );
    }
    return rows.map((r) => (
      <TableRow key={r.id}>
        <TableCell className="w-[80px]">
          {r.cover ? (
            <img src={r.cover} alt={r.coverAlt ?? r.title} className="h-12 w-12 rounded object-cover" />
          ) : (
            <div className="h-12 w-12 rounded bg-muted" />
          )}
        </TableCell>
        <TableCell className="font-medium">{r.title}</TableCell>
        <TableCell className="text-muted-foreground max-w-[520px]">
          <span className="line-clamp-2">{r.shortDescription}</span>
        </TableCell>
        <TableCell className="text-right">
          <Button variant="destructive" size="sm" onClick={() => void handleDelete(r.id)}>
            Hapus
          </Button>
        </TableCell>
      </TableRow>
    ));
  }, [loading, rows]);

  return (
    <div className="rounded-xl border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cover</TableHead>
            <TableHead>Judul</TableHead>
            <TableHead>Deskripsi Singkat</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{content}</TableBody>
      </Table>
    </div>
  );
}
