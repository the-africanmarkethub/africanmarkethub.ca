"use client";

import { LuPaperclip, LuSmile, LuSend } from "react-icons/lu";
import { useState, useRef, FormEvent, ChangeEvent } from "react";

interface ChatInputProps {
  onSendMessage: (text: string, file?: File) => void;
  loading: boolean;
}

export default function ChatInput({ onSendMessage, loading }: ChatInputProps) {
  const [text, setText] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();

    const selectedFile = fileInputRef.current?.files?.[0];
    if (!text.trim() && !selectedFile) return;

    onSendMessage(text, selectedFile);

    setText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { 
    }
  };

  return (
    <footer className="p-4 border-t bg-white">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 bg-gray-100 rounded-2xl px-4 py-2 focus-within:ring-1 focus-within:ring-orange-500 transition-all"
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx"
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-gray-400 hover:text-orange-500 transition-colors p-1"
          title="Attach file"
        >
          <LuPaperclip size={20} />
        </button>

        <input
          type="text"
          value={text}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setText(e.target.value)
          }
          placeholder={loading ? "Sending..." : "Type a message..."}
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1"
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="text-gray-400 hover:text-orange-500 transition-colors p-1 hidden sm:block"
          >
            <LuSmile size={20} />
          </button>

          <button
            type="submit"
            disabled={
              loading || (!text.trim() && !fileInputRef.current?.files?.[0])
            }
            className="text-orange-500 hover:text-orange-600 disabled:text-gray-300 transition-all p-1"
          >
            <LuSend size={20} className={loading ? "animate-pulse" : ""} />
          </button>
        </div>
      </form>
    </footer>
  );
}
