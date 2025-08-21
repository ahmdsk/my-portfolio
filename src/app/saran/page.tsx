'use client';
import { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db, saranConverter } from '@/lib/firebase';
import { useSession, signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import CommentItem from '@/components/comment-item';
import { motion } from 'framer-motion';
import type { Saran } from '@/types';

export default function SaranPage() {
  const { data: session } = useSession();
  const [message, setMessage] = useState<string>('');
  const [items, setItems] = useState<Saran[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'saran').withConverter(saranConverter), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map(d => d.data()));
    });
    return () => unsub();
  }, []);

  const submit = async () => {
    if (!session) { await signIn(); return; }
    if (!message.trim()) return;
    await addDoc(collection(db, 'saran').withConverter(saranConverter), {
      name: session.user?.name ?? 'Anon',
      userId: session.user?.email ?? 'anon',
      message,
      createdAt: serverTimestamp() as unknown as Date,
      id: "" // will be set by converter on read
    });
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-2">
        <Textarea value={message} onChange={(e)=>setMessage(e.target.value)} placeholder="Tulis saran/komen kamu di sini..." className="min-h-24"/>
        <Button onClick={() => void submit()} className="h-10">Kirim</Button>
      </motion.div>
      <div className="space-y-3">
        {items.map(it => <CommentItem key={it.id} name={it.name} message={it.message} />)}
      </div>
    </div>
  );
}
