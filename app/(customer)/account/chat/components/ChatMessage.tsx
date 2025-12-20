"use client";

import { LuCheck, LuCheckCheck } from "react-icons/lu"; // Fixed icon name
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Message } from "@/interfaces/ticket";

// 1. Define Props interface
interface ChatMessagesProps {
  messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white custom-scrollbar">
      {messages.length > 0 ? (
        messages.map((msg: Message, i: number) => (
          <div
            key={i}
            className={`flex ${msg.is_me ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm transition-all ${
                msg.is_me
                  ? "bg-orange-500 text-white rounded-tr-none"
                  : "bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200"
              }`}
            >
              {/* Image Attachment Rendering */}
              {msg.file && (
                <div className="mb-2 rounded-lg overflow-hidden border border-black/5 bg-black/5">
                  <Image
                    src={msg.file}
                    alt="Attachment"
                    width={300}
                    height={200}
                    className="object-cover w-full h-auto max-h-60 hover:scale-105 transition-transform"
                    unoptimized // Use this if images are from external Cloudinary URLs
                  />
                </div>
              )}

              {/* Message Text */}
              <p className="whitespace-pre-wrap wrap-break-words">{msg.text}</p>

              {/* Metadata: Time and Read Receipts */}
              <div
                className={`flex items-center gap-1 mt-1 text-[10px] ${
                  msg.is_me
                    ? "justify-end text-orange-100"
                    : "justify-start text-gray-400"
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.is_me && (
                  <span className="flex items-center">
                    {msg.is_read ? (
                      <LuCheckCheck className="text-blue-300 w-3 h-3" />
                    ) : (
                      <LuCheck className="w-3 h-3" />
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
          No messages in this conversation yet.
        </div>
      )}

      {/* Anchor for auto-scrolling */}
      <div ref={scrollRef} className="h-2" />
    </div>
  );
}
