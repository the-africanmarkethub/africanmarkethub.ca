"use client";

import { LuSearch } from "react-icons/lu";
import Image from "next/image";
import { Ticket } from "@/interfaces/ticket";

// 1. Define the interface for the component props
interface ChatSidebarProps {
  chats: Ticket[];
  activeChatId: string | undefined; // string because it's TCK-XXXX
  onSelectChat: (chat: Ticket) => void;
}

export default function ChatSidebar({
  chats,
  activeChatId,
  onSelectChat,
}: ChatSidebarProps) {
  // 2. Apply the interface here
  return (
    <aside className="w-full md:w-80 bg-white border-r flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Chats</h1>
        <div className="relative">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-100 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto">
        {chats.length > 0 ? (
          chats.map(
            (
              chat: Ticket // 3. Explicitly type the map parameter
            ) => (
              <div
                key={chat.ticket_id}
                onClick={() => onSelectChat(chat)}
                className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                  activeChatId === chat.ticket_id
                    ? "bg-orange-50 border-r-4 border-orange-500"
                    : "hover:bg-gray-50"
                }`}
              >
                <div className="relative shrink-0">
                  <Image
                    src={chat.profile_photo || "/placeholder.png"}
                    alt={chat.full_name || "User"}
                    width={48}
                    height={48}
                    className="rounded-full h-12 w-12 object-cover border"
                  />
                  {chat.online_status === "online" && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-sm truncate pr-2">
                      {chat.full_name}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {chat.last_message_time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {chat.last_message || "No messages yet"}
                  </p>
                </div>
              </div>
            )
          )
        ) : (
          <div className="p-8 text-center text-gray-400 text-sm">
            No conversations found
          </div>
        )}
      </nav>
    </aside>
  );
}
