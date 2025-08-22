// components/admin/project-form.tsx
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RichEditor from "@/components/editor/rich-editor"; // TipTap wrapper (lihat: components/editor/rich-editor.tsx)
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import { NewProject } from "@/types";

export default function ProjectForm() {
  // form state
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [html, setHtml] = useState(""); // HTML dari TipTap
  // upload state
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUrl, setCoverUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  // ui state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TipTap sudah di-handle di komponen RichEditor

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("File harus berupa gambar");
      return;
    }
    setCoverFile(f);
  };

  const uploadImage = async () => {
    if (!coverFile) return "";
    const path = `projects/${Date.now()}-${coverFile.name}`;
    const storageRef = ref(storage, path);
    const task = uploadBytesResumable(storageRef, coverFile);

    return await new Promise<string>((resolve, reject) => {
      task.on(
        "state_changed",
        (snap) => {
          const pct = Math.round(
            (snap.bytesTransferred / snap.totalBytes) * 100
          );
          setUploadProgress(pct);
        },
        (err) => {
          console.error(err);
          toast.error("Upload gambar gagal");
          reject(err);
        },
        async () => {
          const url = await getDownloadURL(task.snapshot.ref);
          setCoverUrl(url);
          toast.success("Gambar terunggah");
          resolve(url);
        }
      );
    });
  };

  const reset = () => {
    setTitle("");
    setShortDesc("");
    setHtml("");
    setCoverFile(null);
    setCoverUrl("");
    setUploadProgress(0);
    setError(null);
  };

  const submit = async () => {
    setError(null);

    if (!title.trim()) {
      setError("Judul wajib diisi");
      toast.error("Isi judul dulu ya 🙂");
      return;
    }

    setLoading(true);
    try {
      // jika user belum klik tombol upload, tapi sudah memilih file, upload otomatis
      let finalCover = coverUrl;
      if (!finalCover && coverFile) {
        finalCover = await uploadImage();
      }

      const payload: NewProject = {
        title,
        shortDescription: shortDesc,
        description: html,
        cover: finalCover ?? null,
        coverAlt: title,
        tags: null,
        url: `/projects/${Date.now()}`,
        createdAt: serverTimestamp(),
      };

      await addDoc(
        collection(db, "projects"),
        payload
      );

      toast.success("Project tersimpan 🎉");
      reset();
    } catch (e) {
      console.error(e);
      toast.error("Gagal menyimpan project. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-muted-foreground">
          Form Project
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-2 space-y-4">
        {/* Judul */}
        <div className="space-y-2">
          <label htmlFor="proj-title" className="text-sm text-muted-foreground">
            Judul
          </label>
          <Input
            id="proj-title"
            placeholder="Judul project"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoComplete="off"
            aria-invalid={!!error && !title.trim()}
          />
        </div>

        {/* Deskripsi Singkat */}
        <div className="space-y-2">
          <label htmlFor="proj-short" className="text-sm text-muted-foreground">
            Deskripsi Singkat (untuk kartu di Home)
          </label>
          <Input
            id="proj-short"
            placeholder="Contoh: Aplikasi catatan dengan AI summarizer"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* Cover Uploader */}
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">
            Cover (opsional)
          </label>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {coverFile && (
            <div className="text-xs text-muted-foreground">
              {coverFile.name} — {(coverFile.size / 1024 / 1024).toFixed(2)} MB
            </div>
          )}

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="h-2 w-full overflow-hidden rounded bg-muted">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          {coverUrl && (
            <Image
              src={coverUrl}
              alt="Preview cover"
              width={100}
              height={100}
              className="mt-2 h-32 w-full rounded object-cover"
            />
          )}

          <Button
            type="button"
            variant="secondary"
            onClick={() => void uploadImage()}
            disabled={!coverFile}
          >
            Upload Gambar
          </Button>
        </div>

        {/* WYSIWYG (TipTap) */}
        <div className="space-y-1">
          <label className="text-sm text-muted-foreground">
            Konten Lengkap
          </label>
          <RichEditor
            value={html}
            onChange={setHtml}
            placeholder="Tulis konten lengkap di sini..."
          />
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            onClick={() => void submit()}
            disabled={loading}
            className="min-w-32"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                Menyimpan...
              </span>
            ) : (
              "Simpan Project"
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={reset}
            disabled={loading}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
