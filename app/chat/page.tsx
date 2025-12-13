"use client";

import { Suspense } from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useTickets, useTicketDetail, useCreateTicket, useUpdateTicket } from "@/hooks/useTickets";
import { BookingModal } from "@/components/BookingModal";

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuthGuard();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const vendorId = searchParams.get("vendor");
  const serviceId = searchParams.get("service");
  
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isInitializingChat, setIsInitializingChat] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  // API hooks
  const { data: ticketsData, isLoading: ticketsLoading } = useTickets();
  const { data: ticketDetail, refetch: refetchTicketDetail } = useTicketDetail(selectedTicketId);
  const createTicket = useCreateTicket();
  const updateTicket = useUpdateTicket();

  // Initialize chat if coming from service page
  useEffect(() => {
    // Only proceed if we have vendor and service IDs from the URL
    if (vendorId && serviceId && !ticketsLoading && userRole === "customer") {
      setIsInitializingChat(true);
      const tickets = ticketsData?.data?.data || [];
      
      // Check if there's an existing ticket for this service
      const existingTicket = tickets.find(
        (ticket: any) => ticket.service_id === parseInt(serviceId)
      );
      
      if (existingTicket) {
        console.log("Found existing ticket:", existingTicket.ticket_id);
        setSelectedTicketId(existingTicket.ticket_id);
        setIsInitializingChat(false);
      } else if (!createTicket.isPending && !createTicket.isSuccess && !sessionStorage.getItem(`ticket_created_${serviceId}`)) {
        // Create a new ticket for this service (only if not already created in this session)
        console.log("No existing ticket found. Creating new ticket for service:", serviceId, "vendor:", vendorId);
        sessionStorage.setItem(`ticket_created_${serviceId}`, 'true');
        createTicket.mutate({
          service_id: parseInt(serviceId),
          title: "Inquiry about service",
          subject: "Service Booking Inquiry",
          description: "Hello, I'm interested in your service. Can you provide more details?"
        }, {
          onSuccess: (data) => {
            console.log("Ticket created successfully:", data);
            setIsInitializingChat(false);
            if (data?.data?.ticket_id) {
              setSelectedTicketId(data.data.ticket_id);
              // Remove the URL parameters to prevent re-creation on refresh
              router.push('/chat');
            } else if (data?.ticket_id) {
              // Handle different response structures
              setSelectedTicketId(data.ticket_id);
              // Remove the URL parameters to prevent re-creation on refresh
              router.push('/chat');
            }
          },
          onError: (error: any) => {
            console.error("Failed to create ticket:", error);
            setIsInitializingChat(false);
            const errorMessage = error?.message || error?.response?.data?.message || "Failed to start conversation. Please try again.";
            toast.error(errorMessage);
          }
        });
      }
    }
  }, [vendorId, serviceId, ticketsLoading, userRole]);

  useEffect(() => {
    // Check authentication and user role
    if (isAuthenticated === false) {
      // Redirect to login with return URL
      const returnUrl = `/chat?vendor=${vendorId}&service=${serviceId}`;
      router.push(
        `/auth/login?returnUrl=${encodeURIComponent(returnUrl)}&authType=google`
      );
    } else if (isAuthenticated === true) {
      // Check user role - only customers can access chat
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      setUserRole(user.role);

      if (user.role === "vendor") {
        // Show toast message before redirecting
        toast.error(
          "Only customers can access the chat. Vendors cannot book services from other vendors."
        );
        // Small delay to ensure toast is visible
        setTimeout(() => {
          router.push("/vendor");
        }, 2000);
      }
    }
  }, [isAuthenticated, router, vendorId, serviceId]);

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
          setShowEmojiPicker(false);
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

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D]"></div>
      </div>
    );
  }

  // Don't render chat for vendors
  if (userRole === "vendor") {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-600">
            This chat is only available for customers.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-80px)] bg-gray-50 relative">
      {/* Sidebar - Contact List */}
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-30 w-full sm:w-80 lg:w-96 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ease-in-out h-full lg:h-auto`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between lg:block">
          <button
            onClick={() => setShowSidebar(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-lg lg:text-xl font-semibold text-gray-900 lg:mb-4">
            Your Vendor Chats
          </h2>

          {/* Search */}
          <div className="relative mt-4 lg:mt-0">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg outline-none focus:ring-2 focus:ring-[#F28C0D]"
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

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto">
          {ticketsLoading ? (
            <div className="text-center py-8 text-gray-500">
              Loading conversations...
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No conversations yet. Book a service to start chatting!
            </div>
          ) : (
            filteredTickets.map((ticket: any) => (
              <div
                key={ticket.ticket_id}
                onClick={() => handleSelectTicket(ticket.ticket_id)}
                className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                  selectedTicketId === ticket.ticket_id ? "bg-orange-50" : ""
                }`}
              >
                <div className="relative mr-3">
                  {ticket.profile_photo ? (
                    <Image
                      src={ticket.profile_photo}
                      alt={ticket.full_name}
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-gray-600 font-semibold">
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
                    <h3 className="font-medium text-gray-900 truncate">
                      {ticket.full_name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatDate(ticket.last_message_time)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {ticket.last_message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Chat Area */}
      <div className="flex-1 flex flex-col w-full">
        {selectedTicketId && ticketDetail?.data ? (
          <>
            {/* Chat Header */}
            <div className="bg-white border-b border-gray-200 p-3 lg:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <button
                    onClick={handleBackToList}
                    className="lg:hidden mr-2 p-1.5 hover:bg-gray-100 rounded-lg"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="relative mr-3">
                    {ticketDetail.data.user_detail.profile_photo ? (
                      <Image
                        src={ticketDetail.data.user_detail.profile_photo}
                        alt={ticketDetail.data.user_detail.full_name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold">
                          {ticketDetail.data.user_detail.full_name.charAt(0)}
                        </span>
                      </div>
                    )}
                    {ticketDetail.data.user_detail.online_status === 'online' && (
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm lg:text-base truncate">
                      {ticketDetail.data.user_detail.full_name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {ticketDetail.data.service_detail.name} • {ticketDetail.data.subject}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 lg:space-x-4">
                  <button className="hidden sm:block p-1.5 lg:p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="p-1.5 lg:p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-3 lg:p-4 bg-gray-50">
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

                {/* Render messages */}
                {ticketDetail.data.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      msg.sender === "customer" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] sm:max-w-xs lg:max-w-md ${
                        msg.sender === "customer"
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
                      <div className="px-4 py-2">
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === "customer" ? "text-orange-100" : "text-gray-500"
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
            <div className="bg-white border-t border-gray-200 p-3 lg:p-4">
              <div className="flex items-center space-x-2 flex-wrap sm:flex-nowrap">
                <button 
                  onClick={() => setShowBookingModal(true)}
                  className="hidden sm:block px-3 lg:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium whitespace-nowrap"
                >
                  Book
                </button>

                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type here"
                    disabled={updateTicket.isPending}
                    className="w-full px-4 py-2 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-[#F28C0D] disabled:opacity-50"
                  />
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:bg-gray-200 rounded-full"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>

                <button className="hidden sm:block p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || updateTicket.isPending}
                  className="p-2 bg-[#F28C0D] text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 px-4">
            <button
              onClick={() => setShowSidebar(true)}
              className="lg:hidden fixed top-20 left-4 z-10 p-2 bg-white shadow-lg rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="text-center">
              {(createTicket.isPending || isInitializingChat) ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D] mx-auto mb-4"></div>
                  <p className="text-gray-500">Starting conversation...</p>
                </>
              ) : (
                <>
                  <svg className="w-20 h-20 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                  <p className="text-gray-500 text-sm sm:text-base">Choose a vendor from the list to start chatting</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedTicketId && ticketDetail?.data && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          ticketId={selectedTicketId}
          serviceName={ticketDetail.data.service_detail.name}
          servicePrice={100} // You might want to get this from service data
        />
      )}
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D]"></div>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}