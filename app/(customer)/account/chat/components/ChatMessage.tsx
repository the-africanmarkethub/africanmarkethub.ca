"use client";

import { LuCheck, LuCheckCheck } from "react-icons/lu";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { Message } from "@/interfaces/ticket";
import { formatHumanReadableDate } from "@/utils/formatDate";

interface ChatMessagesProps {
  messages: Message[];
  currentUserRole: "customer" | "vendor"; // Add this to identify who "me" is
}

export default function ChatMessages({
  messages,
  currentUserRole,
}: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-white custom-scrollbar">
      {messages.length > 0 ? (
        messages.map((msg: any, i: number) => {
          // IMPORTANT: Logic to determine if the message belongs to the logged-in user
          // We check if the sender tag matches the current user's role
          const isMe = msg.sender === currentUserRole;

          return (
            <div
              key={i}
              className={`flex w-full ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm transition-all ${
                  isMe
                    ? "bg-hub-primary/30 text-white! rounded-tr-none"
                    : "bg-gray-100 text-gray-900 rounded-tl-none border border-gray-200"
                }`}
              >
                {/* Image Attachment */}
                {msg.file && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-black/5 bg-black/5">
                    <Image
                      src={msg.file}
                      alt="Attachment"
                      width={300}
                      height={200}
                      className="object-cover w-full h-auto max-h-60 hover:scale-105 transition-transform"
                      unoptimized
                    />
                  </div>
                )}

                {/* Message Text with Word Break Fix */}
                <p className="whitespace-pre-wrap wrap-break-words leading-relaxed">
                  {msg.text}
                </p>

                {/* Metadata */}
                <div
                  className={`flex items-center gap-1 mt-1 text-[10px] ${
                    isMe
                      ? "justify-end text-hub-secondary"
                      : "justify-start text-gray-500"
                  }`}
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
