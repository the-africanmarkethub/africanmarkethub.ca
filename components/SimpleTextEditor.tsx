"use client";

import { useState, useRef } from "react";

interface SimpleTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function SimpleTextEditor({ 
  value, 
  onChange, 
  placeholder,
  className,
  style 
}: SimpleTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedText, setSelectedText] = useState({ start: 0, end: 0 });

  const insertFormatting = (before: string, after: string = "") => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedContent = text.substring(start, end);
    
    const newText = 
      text.substring(0, start) + 
      before + 
      selectedContent + 
      after + 
      text.substring(end);
    
    onChange(newText);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedContent.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleBold = () => {
    insertFormatting("**", "**");
  };

  const handleItalic = () => {
    insertFormatting("_", "_");
  };

  const handleBulletList = () => {
    insertFormatting("\n• ", "");
  };

  const handleNumberedList = () => {
    insertFormatting("\n1. ", "");
  };

  return (
    <div className="relative">
      <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 flex items-center space-x-2">
        <button
          type="button"
          onClick={handleBold}
          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
          title="Bold"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={handleItalic}
          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
          title="Italic"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 4h4M14 20H10M15 4L9 20" />
          </svg>
        </button>
        
        <div className="w-px h-4 bg-gray-300"></div>
        
        <button
          type="button"
          onClick={handleBulletList}
          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
          title="Bullet List"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </button>
        
        <button
          type="button"
          onClick={handleNumberedList}
          className="p-1.5 hover:bg-gray-200 rounded transition-colors"
          title="Numbered List"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20h14M7 10h14M7 6V4M7 10V8m0 8v-2m4-10h10M11 16h10" />
          </svg>
        </button>
      </div>
      
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 min-h-[150px] resize-y focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none ${className || ''}`}
        style={style}
        onSelect={(e) => {
          const target = e.target as HTMLTextAreaElement;
          setSelectedText({ start: target.selectionStart, end: target.selectionEnd });
        }}
      />
      
      <div className="text-xs text-gray-500 px-3 py-1 bg-gray-50 border-t border-gray-200">
        Use **text** for bold, _text_ for italic
      </div>
    </div>
  );
}