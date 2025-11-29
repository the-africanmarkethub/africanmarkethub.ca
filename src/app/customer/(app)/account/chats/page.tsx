"use client";

import React, { useEffect, useState } from "react";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import { TicketChat } from "@/components/customer/ticket-chat";
import { ProtectedRoute } from "@/components/customer/ProtectedRoute";

interface ServiceInfo {
  id: string;
  title: string;
  description: string;
  shop: {
    name: string;
    logo?: string;
  };
}

function ChatsContent() {
  const [serviceInfo, setServiceInfo] = useState<ServiceInfo | null>(null);
  const [autoCreate, setAutoCreate] = useState(false);

  useEffect(() => {
    // Check for pending service info from session storage
    const pendingServiceInfo = sessionStorage.getItem("pendingServiceInfo");
    if (pendingServiceInfo) {
      try {
        const parsed = JSON.parse(pendingServiceInfo);
        setServiceInfo(parsed);
        sessionStorage.removeItem("pendingServiceInfo");
      } catch (error) {
        console.error("Error parsing service info:", error);
      }
    }

    // Check URL params
    const params = new URLSearchParams(window.location.search);
    setAutoCreate(params.get("autoCreate") === "true");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <MaxWidthWrapper className="py-8">
        <div className="flex-1 bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Chats</h1>
            <TicketChat
              serviceInfo={serviceInfo || undefined}
              autoCreateTicket={autoCreate}
            />
          </div>
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

export default function ChatsPage() {
  return (
    <ProtectedRoute>
      <ChatsContent />
    </ProtectedRoute>
  );
}
