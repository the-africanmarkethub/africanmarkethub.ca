"use client";

import dynamic from "next/dynamic";

const TipTapEditor = dynamic(() => import("./TipTapEditor"), {
  ssr: false,
  loading: () => <div className="h-32 w-full animate-pulse bg-gray-100 rounded" />,
});

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export default function RichTextEditor(props: RichTextEditorProps) {
  return <TipTapEditor {...props} />;
}