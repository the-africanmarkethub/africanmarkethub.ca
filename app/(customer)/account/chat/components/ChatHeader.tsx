"use client";

import { LuVideo, LuInfo } from "react-icons/lu";
import Image from "next/image";
import { Participant } from "@/interfaces/ticket";

// Define the Props interface for the header
interface ChatHeaderProps {
  participant: Participant | null;
}

export default function ChatHeader({ participant }: ChatHeaderProps) {
  // If no participant is selected or loaded, return null (or a skeleton loader)
  if (!participant) return null;

  return (
    <header className="p-4 border-b flex items-center justify-between bg-white">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Image
            src={participant.profile_photo || "/placeholder.png"}
            alt={participant.full_name}
            width={40}
            height={40}
            className="rounded-full h-10 w-10 object-cover border"
          />
          {participant.is_online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>
        <div>
          <h2 className="text-sm font-bold leading-tight">
            {participant.full_name}
          </h2>
          <span
            className={`text-[11px] font-medium ${
              participant.is_online ? "text-green-500" : "text-gray-400"
            }`}
          >
            {participant.is_online ? "Active Now" : "Offline"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-gray-400">
        <button className="hover:text-orange-600 transition-all active:scale-95">
          <LuVideo size={20} />
        </button>
        <button className="hover:text-orange-600 transition-all active:scale-95">
          <LuInfo size={20} />
        </button>
      </div>
    </header>
  );
}
