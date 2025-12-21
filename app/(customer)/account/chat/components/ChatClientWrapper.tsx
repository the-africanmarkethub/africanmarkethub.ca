"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getServiceChat, replyServiceChat } from "@/lib/api/customer/services";
import { Ticket, Message, Participant } from "@/interfaces/ticket";
import { LuSend } from "react-icons/lu";
import ChatMessages from "./ChatMessage";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import ChatSidebar from "./ChatSidebar";

interface ChatClientWrapperProps {
  initialChats: Ticket[];
  initialActiveChat: Ticket | null;
  initialMessages: Message[];
  initialParticipant: Participant | null;
}
export default function ChatClientWrapper({
  initialChats,
  initialActiveChat,
  initialMessages,
  initialParticipant,
}: ChatClientWrapperProps) {
  const [chats, setChats] = useState<Ticket[]>(initialChats);
  const [activeChat, setActiveChat] = useState<Ticket | null>(
    initialActiveChat
  );
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [participant, setParticipant] = useState<Participant | null>(
    initialParticipant
  );
  useEffect(() => {
    setChats(initialChats);
    setActiveChat(initialActiveChat);
    setMessages(initialMessages);
    setParticipant(initialParticipant);
  }, [initialChats, initialActiveChat, initialMessages, initialParticipant]);
  
  const [loading, setLoading] = useState(false);
 
  const [showMobileChat, setShowMobileChat] = useState(!!initialActiveChat);

  const handleSelectChat = async (chat: Ticket) => {
    setActiveChat(chat);
    setShowMobileChat(true);
    try {
      const res = await getServiceChat(chat.ticket_id);
      setMessages(res.data.messages || []);
      setParticipant(res.data.participant || null);
    } catch (err) {
      toast.error("Failed to load conversation");
    }
  };

  const handleUpsertMessage = async (text: string, file?: File) => {
    if (!activeChat) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("service_id", activeChat.service_id.toString());
    formData.append(
      "description",
      text.trim() || (file ? "Attached a file." : "Inquiry")
    );
    if (file) formData.append("file", file);

    try {
      const res = await replyServiceChat(formData);
      if (res.status === "success") {
        setMessages(res.data.messages);

        setChats((prev) =>
          prev.map((c) =>
            c.ticket_id === activeChat.ticket_id
              ? {
                  ...c,
                  last_message: text || "📎 Attachment",
                  last_message_time: new Date().toISOString(),
                }
              : c
          )
        );
      }
    } catch (err: any) {
      toast.error("Failed to send");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] bg-white overflow-hidden md:rounded-2xl md:m-4 shadow-sm">
      <div
        className={`${
          showMobileChat ? "hidden" : "block"
        } w-full md:block md:w-80 border-hub-secondary border-r`}
      >
        <ChatSidebar
          chats={chats}
          activeChatId={activeChat?.ticket_id}
          onSelectChat={handleSelectChat}
        />
      </div>

      <main
        className={`${
          showMobileChat ? "flex" : "hidden"
        } flex-1 flex-col bg-white w-full`}
      >
        {activeChat ? (
          <>
            <ChatHeader
              participant={participant}
              onBack={() => setShowMobileChat(false)} 
            />
            <ChatMessages messages={messages} />
            <ChatInput onSendMessage={handleUpsertMessage} loading={loading} />
          </>
        ) : (
          <div className="flex-1 hidden md:flex flex-col items-center justify-center text-gray-400 gap-4">
            <LuSend size={48} className="text-gray-200" />
            <p>Select a conversation to start messaging</p>
          </div>
        )}
      </main>
    </div>
  );
}
