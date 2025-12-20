"use client";

import { useState, useEffect, use, useRef } from "react";
import {
  listServiceChats,
  getServiceChat,
  replyServiceChat,
} from "@/lib/api/customer/services";
import ChatClientWrapper from "./components/ChatClientWrapper";

const DEFAULT_INQUIRY =
  "Hello! I'm interested in your services and would like to discuss some details...";

interface ServiceChatPageProps {
  searchParams: Promise<{ item?: string }>;
}

export default function ServiceChatPage({
  searchParams,
}: ServiceChatPageProps) {
  const resolvedParams = use(searchParams);
  const itemId = resolvedParams.item;

  // Ref to prevent API race conditions/double calls in Strict Mode
  const isInitializing = useRef(false);

  const [data, setData] = useState<{
    chats: any[];
    activeChat: any | null;
    messages: any[];
    participant: any;
  } | null>(null);

  useEffect(() => {
    if (isInitializing.current) return;

    const initFetch = async () => {
      isInitializing.current = true;
      try {
        // 1. Fetch List
        const res = await listServiceChats();
        let chats = Array.isArray(res.data) ? res.data : res.data?.data || [];

        // 2. Find/Create Active Ticket
        let activeTicket =
          chats.find(
            (t: any) => t.service_id?.toString() === itemId?.toString()
          ) || null;

        if (itemId && !activeTicket) {
          const formData = new FormData();
          formData.append("service_id", itemId);
          formData.append("description", DEFAULT_INQUIRY);
          const createRes = await replyServiceChat(formData);

          if (
            createRes.status === "success" ||
            createRes.data?.status === "success"
          ) {
            const refresh = await listServiceChats();
            chats = Array.isArray(refresh.data)
              ? refresh.data
              : refresh.data?.data || [];
            activeTicket =
              chats.find(
                (t: any) => t.service_id?.toString() === itemId.toString()
              ) || null;
          }
        }

        if (!activeTicket && chats.length > 0) activeTicket = chats[0];

        // 3. Fetch Details (Wrapped in nested try/catch so sidebar survives error)
        let initialMessages = [];
        let initialParticipant = null;

        if (activeTicket) {
          try {
            const detail = await getServiceChat(activeTicket.ticket_id);
            if (
              detail.status === "success" ||
              detail.data?.status === "success"
            ) {
              const payload = detail.data?.data || detail.data;
              initialMessages = payload?.messages || [];
              initialParticipant = payload?.participant || null;
            }
          } catch (detailErr) {
            console.error("Detail fetch failed:", detailErr);
          }

          if (!initialParticipant) {
            initialParticipant = {
              full_name: activeTicket.full_name,
              profile_photo: activeTicket.profile_photo,
              is_online: activeTicket.online_status === "online",
            };
          }
        }

        setData({
          chats,
          activeChat: activeTicket,
          messages: initialMessages,
          participant: initialParticipant,
        });
      } catch (err) {
        console.error("Main Fetch Error:", err);
        setData({
          chats: [],
          activeChat: null,
          messages: [],
          participant: null,
        });
      } finally {
        isInitializing.current = false;
      }
    };

    initFetch();
  }, [itemId]);

  // Loading State
  if (!data) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">
          Loading conversations...
        </p>
      </div>
    );
  }

  return (
    <ChatClientWrapper
      initialChats={data.chats}
      initialActiveChat={data.activeChat}
      initialMessages={data.messages}
      initialParticipant={data.participant}
    />
  );
}
