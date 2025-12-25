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
    <header className="p-3 md:p-4 border-b border-hub-secondary flex items-center justify-between bg-white sticky top-0 z-10 h-[70px]">
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          onClick={onBack}
          aria-label="back"
          className="md:hidden p-1 -ml-1 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
        >
          <LuChevronLeft size={24} />
        </button>

        <div className="relative shrink-0">
          <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-100">
            <Image
              src={participant.profile_photo || "/placeholder.png"}
              alt={participant.full_name || "User"}
              width={40}
              height={40}
              unoptimized // Required for Base64 or external dynamic images
              className="h-full w-full object-cover"
            />
          </div>
          {participant.is_online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-bold leading-tight truncate">
            {participant.full_name || "Service Provider"}
          </h2>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider ${
                participant.is_online ? "text-green-500" : "text-gray-400"
              }`}
            >
              {participant.is_online ? "Active Now" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button className="bg-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-orange-600 transition-all active:scale-95 shadow-sm shadow-orange-200">
          Book Now
        </button>
      </div>
    </header>
  );
}
