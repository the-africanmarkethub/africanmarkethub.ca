"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { useTickets, useTicketDetail, useUpdateTicket } from "@/hooks/useTickets";

export default function VendorCustomerMessagesPage() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSidebar, setShowSidebar] = useState(true);

  // API hooks - vendors see tickets from their perspective
  const { data: ticketsData, isLoading: ticketsLoading } = useTickets();
  const { data: ticketDetail, refetch: refetchTicketDetail } = useTicketDetail(selectedTicketId);
  const updateTicket = useUpdateTicket();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [ticketDetail?.data?.messages]);

  const handleSendMessage = () => {
    if (message.trim() && selectedTicketId && ticketDetail?.data) {
      updateTicket.mutate({
        ticket_id: selectedTicketId,
        service_id: ticketDetail.data.service_detail.id,
        title: ticketDetail.data.subject,
        subject: ticketDetail.data.subject,
        description: message.trim()
      }, {
        onSuccess: () => {
          setMessage("");
          refetchTicketDetail();
        },
        onError: (error) => {
          console.error("Failed to send message:", error);
          toast.error("Failed to send message. Please try again.");
        }
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSelectTicket = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    // On mobile, hide sidebar when chat is selected
    setShowSidebar(false);
  };

  const handleBackToList = () => {
    setShowSidebar(true);
    setSelectedTicketId(null);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return formatTime(timestamp);
    }
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const tickets = ticketsData?.data?.data || [];
  const filteredTickets = tickets.filter((ticket: any) =>
    ticket.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.last_message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50">
      {/* Sidebar - Customer List */}
      <div className={`${showSidebar ? 'flex' : 'hidden'} md:flex w-full md:w-96 bg-white border-r border-gray-200 flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Customer Messages
          </h2>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm md:text-base bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-[#F28C0D]"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
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

        {/* Customer List */}
        <div className="flex-1 overflow-y-auto">
          {ticketsLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading conversations...
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No customer messages yet
            </div>
          ) : (
            filteredTickets.map((ticket: any) => (
              <div
                key={ticket.ticket_id}
                onClick={() => handleSelectTicket(ticket.ticket_id)}
                className={`flex items-center p-3 md:p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                  selectedTicketId === ticket.ticket_id ? "bg-orange-50" : ""
                }`}
              >
                <div className="relative mr-3">
                  {ticket.profile_photo ? (
                    <Image
                      src={ticket.profile_photo}
                      alt={ticket.full_name}
                      width={40}
                      height={40}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold text-sm md:text-base">
                        {ticket.full_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  {ticket.online_status === 'online' && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate text-sm md:text-base">
                      {ticket.full_name}
                    </h3>
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {formatDate(ticket.last_message_time)}
                    </span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 truncate">
                    {ticket.last_message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${!showSidebar ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}>
        {selectedTicketId && ticketDetail?.data ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-3 md:p-4">
              <div className="flex items-center justify-between">
                {/* Back button for mobile */}
                <button
                  onClick={handleBackToList}
                  className="md:hidden p-2 text-gray-600 hover:text-[#F28C0D] mr-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="flex items-center flex-1">
                  <div className="relative mr-3">
                    {ticketDetail.data.user_detail.profile_photo ? (
                      <Image
                        src={ticketDetail.data.user_detail.profile_photo}
                        alt={ticketDetail.data.user_detail.full_name}
                        width={36}
                        height={36}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 md:w-10 md:h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold text-sm">
                          {ticketDetail.data.user_detail.full_name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {ticketDetail.data.user_detail.online_status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
                      {ticketDetail.data.user_detail.full_name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {ticketDetail.data.service_detail.name} • Ticket #{ticketDetail.data.ticket_id}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <span className={`px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                    ticketDetail.data.response_status === 'open' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {ticketDetail.data.response_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 bg-gray-50">
              <div className="space-y-4">
                {/* Service info at the top */}
                <div className="text-center py-4">
                  <div className="inline-block">
                    <Image
                      src={ticketDetail.data.service_detail.image}
                      alt={ticketDetail.data.service_detail.name}
                      width={80}
                      height={80}
                      className="rounded-lg mx-auto mb-2"
                    />
                    <p className="text-sm text-gray-600">{ticketDetail.data.service_detail.name}</p>
                    <p className="text-xs text-gray-500">Conversation started {formatDate(ticketDetail.data.created_at)}</p>
                  </div>
                </div>

                {/* Render messages - reversed perspective for vendor */}
                {ticketDetail.data.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "vendor" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[280px] md:max-w-xs lg:max-w-md ${
                        msg.sender === "vendor"
                          ? "bg-[#F28C0D] text-white"
                          : "bg-white text-gray-900"
                      } rounded-lg shadow-sm`}
                    >
                      {msg.file && (
                        <div className="p-2">
                          <Image
                            src={msg.file}
                            alt="Attachment"
                            width={200}
                            height={150}
                            className="rounded object-cover"
                          />
                        </div>
                      )}
                      <div className="px-3 md:px-4 py-2">
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === "vendor" ? "text-orange-100" : "text-gray-500"
                        }`}>
                          {formatTime(msg.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {updateTicket.isPending && (
                  <div className="flex justify-end">
                    <div className="bg-[#F28C0D] bg-opacity-50 text-white px-4 py-2 rounded-lg">
                      <p className="text-sm">Sending...</p>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-3 md:p-4">
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your reply..."
                    disabled={updateTicket.isPending}
                    className="w-full px-3 md:px-4 py-2 text-sm md:text-base bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-[#F28C0D] disabled:opacity-50"
                  />
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || updateTicket.isPending}
                  className="p-2 md:p-2.5 bg-[#F28C0D] text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500">Choose a customer message from the list to respond</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}