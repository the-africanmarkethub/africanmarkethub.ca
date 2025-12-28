"use client";

import { LuCheck, LuCheckCheck } from "react-icons/lu";
import { useEffect, useRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Message } from "@/interfaces/ticket";
import { formatHumanReadableDate } from "@/utils/formatDate";

// Helper utility for Tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChatMessagesProps {
  messages: Message[];
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-white custom-scrollbar">
      {messages.length > 0 ? (
        messages.map((msg: any, i: number) => {
          const isMe =
            msg.is_me === true || msg.is_me === "true" || msg.is_me === 1;

          return (
            <div
              key={msg.id || i}
              className={cn(
                "flex w-full",
                isMe ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm transition-all",
                  isMe
                    ? "bg-orange-400 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-900 rounded-tl-none border border-gray-200"
                )}
              >
                {/* Image Attachment */}
                {msg.file && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-black/5 bg-black/5">
                    <img
                      src={msg.file}
                      alt="Attachment"
                      className="object-cover w-full h-auto max-h-60"
                    />
                  </div>
                )}

                {/* Message Text */}
                <p className="whitespace-pre-wrap wrap-break-words leading-relaxed">
                  {msg.text}
                </p>

                {/* Metadata */}
                <div
                  className={cn(
                    "flex items-center gap-1 mt-1 text-[10px]",
                    isMe
                      ? "justify-end text-orange-100"
                      : "justify-start text-gray-500"
                  )}
                >
                  <span>{formatHumanReadableDate(msg.timestamp)}</span>
                  {isMe && (
                    <span className="flex items-center">
                      {msg.is_read ? (
                        <LuCheckCheck className="text-white w-3 h-3" />
                      ) : (
                        <LuCheck className="text-orange-200 w-3 h-3" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
          No messages in this conversation yet.
        </div>
      )}
      <div ref={scrollRef} />
    </div>
  );
}
