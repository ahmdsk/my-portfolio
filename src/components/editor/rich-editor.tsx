"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

type RichEditorProps = {
  value: string;                    // HTML
  onChange: (html: string) => void; // kembalikan HTML
  placeholder?: string;
};

export default function RichEditor({
  value,
  onChange,
  placeholder = "Tulis konten lengkap di sini...",
}: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        autolink: true,
        openOnClick: true,
        defaultProtocol: "https",
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert max-w-none min-h-[180px] px-3 py-2 focus:outline-none",
      },
    },
    // ⬇⬇⬇ FIX: hindari hydration mismatches di Next/SSR
    immediatelyRender: false,
  });

  // Sinkronisasi dari luar (opsional)
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value && value !== current) editor.commands.setContent(value, { emitUpdate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  const Button = ({
    active,
    onClick,
    children,
    ariaLabel,
  }: {
    active?: boolean;
    onClick: () => void;
    children: React.ReactNode;
    ariaLabel?: string;
  }) => (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={`h-8 rounded px-2 text-sm transition hover:bg-muted ${
        active ? "bg-muted" : ""
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-lg border bg-background">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b p-2">
        <Button
          ariaLabel="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <span className="font-semibold">B</span>
        </Button>
        <Button
          ariaLabel="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </Button>
        <Button
          ariaLabel="Underline"
          active={editor.isActive("underline")}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <span className="underline">U</span>
        </Button>
        <span className="mx-1 h-5 w-px bg-border" />
        <Button
          ariaLabel="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Button>
        <Button
          ariaLabel="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </Button>
        <span className="mx-1 h-5 w-px bg-border" />
        <Button
          ariaLabel="Bullet List"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </Button>
        <Button
          ariaLabel="Ordered List"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </Button>
        <Button
          ariaLabel="Blockquote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          ❝ Quote
        </Button>
        <Button
          ariaLabel="Code Block"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          {"</>"}
        </Button>
        <span className="mx-1 h-5 w-px bg-border" />
        <Button ariaLabel="Undo" onClick={() => editor.chain().focus().undo().run()}>
          ↶ Undo
        </Button>
        <Button ariaLabel="Redo" onClick={() => editor.chain().focus().redo().run()}>
          ↷ Redo
        </Button>
        <Button
          ariaLabel="Add Link"
          onClick={() => {
            const prev = editor.getAttributes("link").href as string | undefined;
            const url = window.prompt("Masukkan URL", prev ?? "https://");
            if (url === null) return;
            if (url === "") {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
        >
          🔗 Link
        </Button>
        <Button
          ariaLabel="Remove Link"
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          ⛓️‍⬛ Unlink
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
