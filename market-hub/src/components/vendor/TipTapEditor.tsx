"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export default function TipTapEditor({
  value,
  onChange,
  className = "bg-white",
  placeholder = "Start typing...",
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 ${className}`,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Update editor content when value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className={`min-h-[200px] p-4 animate-pulse bg-gray-100 rounded ${className}`}>
        Loading editor...
      </div>
    );
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="border-b bg-gray-50 p-2 flex gap-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("bold") ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("italic") ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("strike") ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
        >
          <s>S</s>
        </button>
        <div className="w-px bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("bulletList") ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive("orderedList") ? "bg-gray-200" : "hover:bg-gray-100"
          }`}
        >
          1. List
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}