'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  id: string;
  name: string;
  message: string;
  isOwner?: boolean;
  onEdit?: (id: string, newMessage: string) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
};

export default function CommentItem({ id, name, message, isOwner, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(message);
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (!onEdit) return;
    if (!draft.trim()) return;
    setBusy(true);
    await onEdit(id, draft.trim());
    setBusy(false);
    setEditing(false);
  };

  const del = async () => {
    if (!onDelete) return;
    const ok = confirm('Hapus komentar ini?');
    if (!ok) return;
    setBusy(true);
    await onDelete(id);
    setBusy(false);
  };

  return (
    <div className="rounded-xl border bg-background/60 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium">{name}</p>

          {editing ? (
            <>
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className="mt-2 min-h-20"
                maxLength={1000}
              />
              <div className="mt-2 flex gap-2">
                <Button size="sm" onClick={() => void save()} disabled={busy || !draft.trim()}>
                  {busy ? 'Menyimpan…' : 'Simpan'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => { setEditing(false); setDraft(message); }} disabled={busy}>
                  Batal
                </Button>
              </div>
            </>
          ) : (
            <p className="mt-1 text-sm text-foreground/90 break-words whitespace-pre-wrap">{message}</p>
          )}
        </div>

        {isOwner && (
          <div className="shrink-0 flex gap-2">
            {!editing ? (
              <>
                <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
                  Edit
                </Button>
                <Button size="sm" variant="destructive" onClick={() => void del()}>
                  Hapus
                </Button>
              </>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
