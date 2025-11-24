"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import { TicketChat } from "@/components/customer/ticket-chat";

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
  const searchParams = useSearchParams();
  const autoCreate = searchParams.get("autoCreate") === "true";

  useEffect(() => {
    // Check for pending service info from session storage
    const pendingServiceInfo = sessionStorage.getItem("pendingServiceInfo");
    if (pendingServiceInfo) {
      try {
        const parsed = JSON.parse(pendingServiceInfo);
        setServiceInfo(parsed);
        // Clear it from session storage after using it
        sessionStorage.removeItem("pendingServiceInfo");
      } catch (error) {
        console.error("Error parsing service info:", error);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <MaxWidthWrapper className="py-8">
        {/* Main Content */}
        <div className="flex-1 bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Chats</h1>

            {/* Search Bar */}
            {/* <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div> */}

            {/* Ticket Chat Interface */}
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
    <Suspense fallback={<div>Loading...</div>}>
      <ChatsContent />
    </Suspense>
  );
}
