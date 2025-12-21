"use client";

import { LuChevronLeft } from "react-icons/lu";
import Image from "next/image";
import { Participant } from "@/interfaces/ticket";

interface ChatHeaderProps {
  participant: Participant | null;
  onBack?: () => void;
}

export default function ChatHeader({ participant, onBack }: ChatHeaderProps) {
  if (!participant) return null;

  return (
    <header className="p-3 md:p-4 border-b border-hub-secondary flex items-center justify-between bg-white sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="back"
          className="md:hidden p-1 -ml-1 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
        >
          <LuChevronLeft size={24} />
        </button>

        <div className="relative shrink-0">
          <Image
            src={participant.profile_photo || "/placeholder.png"}
            alt={participant.full_name}
            width={40}
            height={40}
            className="rounded-full h-10 w-10 object-cover"
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
         Book now
        </button> 
      </div>
    </header>
  );
}
