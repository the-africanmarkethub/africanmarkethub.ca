"use client";

import { useState, useEffect } from "react";
import ChatSidebar from "./components/ChatSidebar";
import ChatHeader from "./components/ChatHeader";
import ChatInput from "./components/ChatInput";
import ChatMessages from "./components/ChatMessage";
import toast from "react-hot-toast";
import {
  listServiceChats,
  getServiceChat,
  replyServiceChat,
} from "@/lib/api/customer/services";
import { LuSend } from "react-icons/lu";
import { Ticket, Message, Participant } from "@/interfaces/ticket";

interface ChatDataState {
  messages: Message[];
  participant: Participant | null;
}

export default function ServiceChatPage() {
  const [chats, setChats] = useState<Ticket[]>([]);
  const [activeChat, setActiveChat] = useState<Ticket | null>(null);
  const [chatData, setChatData] = useState<ChatDataState>({
    messages: [],
    participant: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchInitialChats();
  }, []);

  const fetchInitialChats = async () => {
    try {
      const res = await listServiceChats();
      const ticketList = res.data.data || res.data;
      setChats(ticketList);

      if (ticketList.length > 0) {
        handleSelectChat(ticketList[0]);
      }
    } catch (err) {
      toast.error("Failed to load chats");
    }
  };

  const handleSelectChat = async (chat: Ticket) => {
    setActiveChat(chat);
    try {
      const res = await getServiceChat(chat.ticket_id);
      setChatData({
        messages: res.data.messages || [],
        participant: res.data.participant || null,
      });
    } catch (err) {
      toast.error("Failed to load messages");
    }
  };

  const handleSendMessage = async (text: string, file?: File) => {
    if (!activeChat) {
      toast.error("No active chat selected");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    // Convert numbers to string for FormData compatibility
    formData.append("service_id", activeChat.service_id.toString());
    formData.append("description", text);

    if (file) {
      formData.append("file", file);
    }

    try {
      const res = await replyServiceChat(formData);
      // Backend returns the updated messages array
      setChatData((prev) => ({
        ...prev,
        messages: res.data.messages,
      }));
    } catch (err) {
      toast.error("Message failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 overflow-hidden border rounded-2xl m-4 shadow-sm">
      <ChatSidebar
        chats={chats}
        activeChatId={activeChat?.ticket_id}
        onSelectChat={handleSelectChat}
      />

      <main className="hidden md:flex flex-1 flex-col bg-white">
        {activeChat ? (
          <>
            <ChatHeader participant={chatData.participant} />
            <ChatMessages messages={chatData.messages} />
            <ChatInput onSendMessage={handleSendMessage} loading={loading} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
            <div className="p-6 bg-gray-50 rounded-full">
              <LuSend size={40} className="text-gray-300" />
            </div>
            <p className="font-medium">
              Select a ticket to view conversation details
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
