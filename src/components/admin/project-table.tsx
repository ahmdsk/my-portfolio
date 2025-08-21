'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, projectConverter } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { Project } from '@/types';

export default function ProjectTable() {
  const [rows, setRows] = useState<Project[]>([]);
  useEffect(() => {
    const q = query(collection(db, 'projects').withConverter(projectConverter), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => setRows(snap.docs.map(d => d.data())));
    return () => unsub();
  }, []);

  return (
    <div className="rounded-xl border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map(r => (
            <TableRow key={r.id}>
              <TableCell>{r.title}</TableCell>
              <TableCell className="text-neutral-400">{r.description}</TableCell>
              <TableCell>
                <Button variant="destructive" size="sm" onClick={() => void deleteDoc(doc(db,'projects',r.id))}>Hapus</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
