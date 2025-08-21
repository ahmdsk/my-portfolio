'use client';
import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, projectConverter } from '@/lib/firebase';

export default function ProjectForm() {
  const [title, setTitle] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const submit = async () => {
    if (!title.trim()) return;
    await addDoc(collection(db, 'projects').withConverter(projectConverter), {
      title, description: desc, createdAt: serverTimestamp() as unknown as Date,
      cover: undefined, tags: undefined, url: undefined
    });
    setTitle(""); setDesc("");
  };
  return (
    <Card>
      <CardContent className="pt-6 space-y-3">
        <Input placeholder="Judul project" value={title} onChange={e=>setTitle(e.target.value)}/>
        <Textarea placeholder="Deskripsi singkat" value={desc} onChange={e=>setDesc(e.target.value)}/>
        <Button onClick={() => void submit()}>Simpan Project</Button>
      </CardContent>
    </Card>
  );
}
