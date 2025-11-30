"use client";

import { useState } from "react";
import { PageHeader } from "@/components/vendor/page-header";
import { VendorTicketChat } from "@/components/vendor/vendor-support/vendor-ticket-chat";
import { useGetTickets } from "@/hooks/vendor/useGetTickets";
import { User } from "lucide-react";

interface Ticket {
  ticket_id: string;
  full_name: string;
  email: string;
  subject: string;
  description: string;
  last_message: string;
  last_message_time: string;
  status: string;
  service_title?: string;
}

export default function CustomerMessagePage() {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  // Fetch real tickets from API
  const { data: ticketsResponse, isLoading, error } = useGetTickets();
  const tickets: Ticket[] = ticketsResponse?.data?.data || [];

  const handleTicketSelect = (ticket: Ticket) => {
    setSelectedTicket(ticket);
  };

  const handleBackToList = () => {
    setSelectedTicket(null);
  };

  return (
    <div className="xl:space-y-8 xl:p-8">
      <div className="hidden xl:block">
        <PageHeader title="Customer Messages" />
      </div>

      <div className="flex h-screen xl:h-full xl:gap-x-6">
        {/* Ticket List Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Customer Support Tickets</h3>
          </div>
          
          <div className="overflow-y-auto h-full">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500">Loading tickets...</div>
            ) : error ? (
              <div className="p-4 text-center text-red-500">Error loading tickets</div>
            ) : tickets.length === 0 ? (
              <div className="p-4 text-center text-gray-500">No tickets found</div>
            ) : (
              tickets.map((ticket) => (
                <div
                  key={ticket.ticket_id}
                  onClick={() => handleTicketSelect(ticket)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedTicket?.ticket_id === ticket.ticket_id ? 'bg-[#F28C0D]/10 border-l-4 border-l-[#F28C0D]' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 truncate">{ticket.full_name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      ticket.status === 'open' ? 'bg-green-100 text-green-800' :
                      ticket.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{ticket.subject}</p>
                  {ticket.service_title && (
                    <p className="text-xs text-[#F28C0D] mb-2">Service: {ticket.service_title}</p>
                  )}
                  <p className="text-xs text-gray-500 truncate">{ticket.last_message}</p>
                  <p className="text-xs text-gray-400 mt-1">{ticket.last_message_time}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1">
          {selectedTicket ? (
            <VendorTicketChat
              ticketId={selectedTicket.ticket_id}
              onClose={handleBackToList}
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-50">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#F28C0D]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-[#F28C0D]" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a ticket</h3>
                <p className="text-gray-500">Choose a customer support ticket to view the conversation and reply.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
