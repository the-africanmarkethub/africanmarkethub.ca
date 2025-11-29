"use client";

import { useState, useRef, useEffect } from "react";
import { useCreateTicket, type CreateTicketData } from "@/hooks/customer/useCreateTicket";
import { useGetTickets } from "@/hooks/customer/useGetTickets";
import { useGetTicketDetails, type TicketDetails } from "@/hooks/customer/useGetTicketDetails";
import { useSendTicketMessage, type SendMessageData } from "@/hooks/customer/useSendTicketMessage";
import { useCreateBooking, type CreateBookingRequest, type CreateBookingResponse } from "@/hooks/customer/useCreateBooking";
import { 
  Paperclip, 
  Send, 
  User, 
  Clock,
  AlertCircle,
  CheckCircle,
  Plus,
  Search,
  Phone,
  Video,
  Info,
  Smile,
  Calendar,
  X
} from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: "user" | "support";
  type: "message" | "system";
}

interface Ticket {
  ticket_id: string;
  full_name: string;
  profile_photo: string;
  last_message: string;
  last_message_time: string;
  online_status: "online" | "offline";
}

interface ServiceInfo {
  id: string;
  title: string;
  description: string;
  shop: {
    name: string;
    logo?: string;
  };
}

interface TicketChatProps {
  serviceInfo?: ServiceInfo;
  autoCreateTicket?: boolean;
}

export function TicketChat({ serviceInfo, autoCreateTicket = false }: TicketChatProps) {
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedTicketDetails, setSelectedTicketDetails] = useState<TicketDetails | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState<Partial<CreateBookingRequest>>({
    delivery_method: "virtual",
    start_date: "",
    end_date: "",
    address: "",
    amount: 0,
  });
  const [paymentResponse, setPaymentResponse] = useState<CreateBookingResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<Partial<CreateTicketData>>({
    service_id: serviceInfo?.id || "13",
    title: serviceInfo ? `Inquiry about ${serviceInfo.title}` : "",
    subject: serviceInfo ? `Service Inquiry: ${serviceInfo.title}` : "",
    description: serviceInfo ? `Hi! I'm interested in your service "${serviceInfo.title}". Could you please provide more information?` : "",
    priority_level: "medium",
    response_status: "open",
  });

  // Always fetch existing tickets, but don't show them in the sidebar if we're auto-creating
  const { data: ticketsResponse, isLoading, error } = useGetTickets();
  const createTicketMutation = useCreateTicket();
  const sendMessageMutation = useSendTicketMessage();
  const createBookingMutation = useCreateBooking();
  
  // Fetch details for selected ticket
  const { data: ticketDetailsResponse } = useGetTicketDetails(selectedTicket?.ticket_id || null);

  const tickets: Ticket[] = ticketsResponse?.data?.data || [];
  
  // Update selected ticket details when data arrives
  useEffect(() => {
    if (ticketDetailsResponse?.data) {
      setSelectedTicketDetails(ticketDetailsResponse.data);
      
      // Convert API messages to our Message format
      const apiMessages: Message[] = ticketDetailsResponse.data.messages.map((msg: any, index: number) => ({
        id: `msg-${index}`,
        content: msg.message,
        timestamp: msg.timestamp,
        sender: msg.sender === "customer" ? "user" : "support",
        type: "message"
      }));
      
      setMessages(apiMessages);
    }
  }, [ticketDetailsResponse]);

  // Start conversation immediately when service info is provided
  useEffect(() => {
    if (serviceInfo && autoCreateTicket && !selectedTicket) {
      // Show conversation immediately without waiting for API
      const conversationTicket: Ticket = {
        ticket_id: "service-chat",
        full_name: serviceInfo.shop.name,
        profile_photo: serviceInfo.shop.logo || "",
        last_message: `Service inquiry about ${serviceInfo.title}`,
        last_message_time: new Date().toISOString(),
        online_status: "online",
      };
      
      setSelectedTicket(conversationTicket);
      
      // Add immediate welcome message
      const welcomeMessage: Message = {
        id: "welcome-1",
        content: `Hi! 👋 Thank you for your interest in "${serviceInfo.title}". I'm excited to help you get started! What would you like to know about this service?`,
        timestamp: new Date().toISOString(),
        sender: "support",
        type: "message"
      };
      setMessages([welcomeMessage]);

      // Create actual ticket in background and update the temp ticket with real ID
      const createBackgroundTicket = async () => {
        try {
          const ticketData: CreateTicketData = {
            service_id: serviceInfo.id,
            title: `Inquiry about ${serviceInfo.title}`,
            subject: `Service Inquiry: ${serviceInfo.title}`,
            description: `Hi! I'm interested in your service "${serviceInfo.title}". Could you please provide more information and help me get started?`,
            priority_level: "medium",
            response_status: "open",
          };

          const result = await createTicketMutation.mutateAsync(ticketData);
          
          if (result.success) {
            // Update the temp ticket with real ticket ID so messages can be sent
            const realTicket: Ticket = {
              ticket_id: result.data.ticket_id,
              full_name: serviceInfo.shop.name,
              profile_photo: serviceInfo.shop.logo || "",
              last_message: `Service inquiry about ${serviceInfo.title}`,
              last_message_time: result.data.created_at,
              online_status: "online",
            };
            
            setSelectedTicket(realTicket);
          }
        } catch (error) {
          console.error("Error creating background ticket:", error);
          // User can still continue chatting with temp ticket
        }
      };

      createBackgroundTicket();
    }
  }, [serviceInfo, autoCreateTicket, selectedTicket, createTicketMutation]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleBookingSubmit = async () => {
    if (!selectedTicket) {
      toast.error("Please select a ticket first");
      return;
    }

    if (!bookingData.start_date || !bookingData.end_date || !bookingData.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const bookingPayload: CreateBookingRequest = {
        ticket_id: selectedTicket.ticket_id,
        delivery_method: bookingData.delivery_method || "virtual",
        start_date: bookingData.start_date!,
        end_date: bookingData.end_date!,
        amount: bookingData.amount!,
        address: bookingData.delivery_method === "physical" ? bookingData.address : undefined,
      };

      const response = await createBookingMutation.mutateAsync(bookingPayload);
      
      // Store payment response for display
      setPaymentResponse(response);
      toast.success("Booking created! Please complete payment.");
      
    } catch (error) {
      console.error("Booking creation failed:", error);
    }
  };

  const handleClosePayment = () => {
    setPaymentResponse(null);
    setShowBookingForm(false);
    setBookingData({
      delivery_method: "virtual",
      start_date: "",
      end_date: "",
      address: "",
      amount: 0,
    });
  };

  const handleCreateTicket = async () => {
    if (!formData.title || !formData.subject || !formData.description) {
      return;
    }

    try {
      const ticketData: CreateTicketData = {
        service_id: formData.service_id!,
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        priority_level: formData.priority_level,
        response_status: formData.response_status,
        file: attachedFile || undefined,
      };

      const result = await createTicketMutation.mutateAsync(ticketData);
      
      if (result.success) {
        setShowCreateForm(false);
        
        const systemMessage: Message = {
          id: "1",
          content: `Ticket created successfully: ${formData.title}`,
          timestamp: new Date().toISOString(),
          sender: "support",
          type: "system"
        };
        setMessages([systemMessage]);
        
        setFormData({
          service_id: "13",
          title: "",
          subject: "",
          description: "",
          priority_level: "medium",
          response_status: "open",
        });
        setAttachedFile(null);
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      // Show error message to user
      const errorMessage = error instanceof Error ? error.message : "Failed to create ticket";
      toast.error(`Sorry, there was an issue creating your ticket: ${errorMessage}. Please try again.`);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !attachedFile) return;
    if (!selectedTicket) return;

    // Add message optimistically to UI
    const optimisticMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: "user",
      type: "message"
    };

    setMessages(prev => [...prev, optimisticMessage]);
    const messageText = newMessage;
    const file = attachedFile;
    setNewMessage("");
    setAttachedFile(null);

    try {
      // Send message to API
      const serviceId = serviceInfo?.id || selectedTicketDetails?.service_detail.id.toString() || "13";
      const messageData: SendMessageData = {
        ticket_id: selectedTicket.ticket_id,
        service_id: serviceId,
        description: messageText,
        file: file || undefined,
      };

      await sendMessageMutation.mutateAsync(messageData);
      
      // The API will automatically update the ticket details through query invalidation
    } catch (error) {
      console.error("Error sending message:", error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      // Restore the message text
      setNewMessage(messageText);
      setAttachedFile(file);
      
      const errorMessage = error instanceof Error ? error.message : "Failed to send message";
      toast.error(`Failed to send message: ${errorMessage}. Please try again.`);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-50 text-red-700 border-red-200";
      case "medium": return "bg-orange-50 text-orange-700 border-orange-200";
      case "low": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-50 text-blue-700 border-blue-200";
      case "ongoing": return "bg-[#F28C0D]/10 text-[#F28C0D] border-[#F28C0D]/20";
      case "close": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertCircle className="w-3 h-3" />;
      case "ongoing": return <Clock className="w-3 h-3" />;
      case "close": return <CheckCircle className="w-3 h-3" />;
      default: return <AlertCircle className="w-3 h-3" />;
    }
  };

  if (showCreateForm) {
    return (
      <div className="flex h-[600px] bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900">Create New Support Ticket</h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief title for your issue"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F28C0D]/20 focus:border-[#F28C0D] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Subject of your inquiry"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F28C0D]/20 focus:border-[#F28C0D] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of your issue..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F28C0D]/20 focus:border-[#F28C0D] transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority Level</label>
              <select 
                value={formData.priority_level} 
                onChange={(e) => setFormData(prev => ({ ...prev, priority_level: e.target.value as "low" | "medium" | "high" }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#F28C0D]/20 focus:border-[#F28C0D] transition-colors"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Attachment</label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-left text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-[#F28C0D]/20 focus:border-[#F28C0D] transition-colors"
              >
                <Paperclip className="w-4 h-4 inline mr-2" />
                {attachedFile ? attachedFile.name : "Select file"}
              </button>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button 
              onClick={handleCreateTicket}
              disabled={createTicketMutation.isPending || !formData.title || !formData.subject || !formData.description}
              className="flex-1 bg-[#F28C0D] text-white px-6 py-3 rounded-xl hover:bg-[#F28C0D]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              {createTicketMutation.isPending ? "Creating..." : "Create Ticket"}
            </button>
            <button 
              onClick={() => setShowCreateForm(false)}
              className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Only show sidebar if not in auto-service mode */}
      {!serviceInfo && (
        <div className="w-80 border-r border-gray-100 bg-gray-50/50">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Support Chats</h3>
            <button
              onClick={() => setShowCreateForm(true)}
              className="p-2 text-[#F28C0D] hover:text-[#F28C0D]/80 hover:bg-[#F28C0D]/10 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D]/20 focus:border-[#F28C0D] transition-colors text-sm"
            />
          </div>
        </div>
        
        <div className="p-3 overflow-y-auto h-full">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F28C0D] mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-3">Unable to load existing tickets</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="text-[#F28C0D] hover:text-[#F28C0D]/80 text-sm font-medium bg-[#F28C0D]/10 hover:bg-[#F28C0D]/20 px-4 py-2 rounded-lg transition-colors"
            >
              Start new conversation
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {tickets.map((ticket) => (
              <div
                key={ticket.ticket_id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                  selectedTicket?.ticket_id === ticket.ticket_id
                    ? "bg-[#F28C0D]/5 border-[#F28C0D]/20 shadow-sm"
                    : "bg-white border-gray-100 hover:bg-gray-50 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {ticket.profile_photo ? (
                      <img 
                        src={ticket.profile_photo} 
                        alt={ticket.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#F28C0D] to-orange-500 flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {ticket.full_name.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm truncate">{ticket.full_name}</h4>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">
                          {new Date(ticket.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className={`w-2 h-2 rounded-full ${ticket.online_status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 truncate mb-2">{ticket.last_message}</p>
                    {selectedTicket?.ticket_id === ticket.ticket_id && (
                      <div className="w-2 h-2 bg-[#F28C0D] rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {tickets.length === 0 && (
              <div className="text-center py-12 px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 mb-3">No support tickets yet</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="text-[#F28C0D] hover:text-[#F28C0D]/80 text-sm font-medium bg-[#F28C0D]/10 hover:bg-[#F28C0D]/20 px-4 py-2 rounded-lg transition-colors"
                >
                  Create your first ticket
                </button>
              </div>
            )}
          </div>
        )}
        </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        {selectedTicket ? (
          <>
            <div className="p-4 border-b border-gray-100 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {(serviceInfo?.shop?.logo || selectedTicket.profile_photo) ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden">
                      <img 
                        src={serviceInfo?.shop?.logo || selectedTicket.profile_photo} 
                        alt={serviceInfo?.shop?.name || selectedTicket.full_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-[#F28C0D] to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {serviceInfo ? serviceInfo.shop.name.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 2) : selectedTicket.full_name.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 2)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {serviceInfo ? serviceInfo.shop.name : selectedTicketDetails ? selectedTicketDetails.service_detail.name : selectedTicket.full_name}
                    </h3>
                    <div className="text-sm text-green-500 flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${serviceInfo || (selectedTicketDetails ? selectedTicketDetails.user_detail.online_status === 'online' : selectedTicket.online_status === 'online') ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      {serviceInfo ? "Service Provider" : selectedTicketDetails ? (selectedTicketDetails.user_detail.online_status === 'online' ? "Online" : "Offline") : (selectedTicket.online_status === 'online' ? "Online" : "Offline")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Info className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50/30">
              <div className="text-center">
                <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
                  {new Date(selectedTicket.last_message_time).toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
              
              
              {/* Service info card for auto-created tickets */}
              {serviceInfo && (
                <div className="flex justify-center">
                  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 max-w-sm">
                    <div className="text-center">
                      <div className="text-sm font-medium text-gray-900 mb-2">Service Inquiry</div>
                      <div className="text-[#F28C0D] font-semibold text-lg mb-2">{serviceInfo.title}</div>
                      <div className="text-xs text-gray-500">You're now connected with {serviceInfo.shop.name}</div>
                    </div>
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-start space-x-3 ${msg.sender === "user" ? "justify-end" : ""}`}>
                  {msg.sender !== "user" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-[#F28C0D] to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div className="flex-1 max-w-md">
                    <div className={`p-3 shadow-sm ${
                      msg.sender === "user" 
                        ? "bg-[#F28C0D] text-white rounded-2xl rounded-tr-md ml-auto" 
                        : "bg-white border border-gray-100 rounded-2xl rounded-tl-md"
                    }`}>
                      <div className="text-sm leading-relaxed">{msg.content}</div>
                    </div>
                    <div className={`text-xs mt-1 ${
                      msg.sender === "user" ? "text-gray-500 text-right mr-3" : "text-gray-500 ml-3"
                    }`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {msg.sender === "user" && (
                        <svg className="w-4 h-4 text-green-500 inline ml-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  {msg.sender === "user" && (
                    <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-100 bg-white">
              <div className="flex items-end space-x-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-gray-400 hover:text-[#F28C0D] hover:bg-[#F28C0D]/10 rounded-lg transition-colors"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <button className="p-2 text-gray-400 hover:text-[#F28C0D] hover:bg-[#F28C0D]/10 rounded-lg transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
                
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="px-3 py-2 bg-[#F28C0D] text-white rounded-lg hover:bg-[#F28C0D]/90 transition-colors flex items-center gap-2"
                  title="Create Booking"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm font-medium">Book</span>
                </button>
                
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type here"
                    className="w-full min-h-[44px] max-h-32 px-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#F28C0D]/20 focus:border-[#F28C0D] resize-none bg-gray-50 transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <button
                  onClick={handleSendMessage}
                  disabled={(!newMessage.trim() && !attachedFile) || sendMessageMutation.isPending}
                  className="p-3 bg-[#F28C0D] text-white rounded-xl hover:bg-[#F28C0D]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
                >
                  {sendMessageMutation.isPending ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              {attachedFile && (
                <div className="flex items-center justify-between bg-[#F28C0D]/10 border border-[#F28C0D]/20 p-3 rounded-xl mt-3">
                  <span className="text-sm text-[#F28C0D] font-medium">{attachedFile.name}</span>
                  <button
                    onClick={() => setAttachedFile(null)}
                    className="text-[#F28C0D] hover:text-[#F28C0D]/80 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50/30">
            <div className="text-center text-gray-500 max-w-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-[#F28C0D]/20 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="w-10 h-10 text-[#F28C0D]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start a conversation</h3>
              <p className="text-gray-500 mb-6">Select a ticket to view the conversation or create a new support ticket to get help.</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-[#F28C0D] text-white px-6 py-3 rounded-xl hover:bg-[#F28C0D]/90 transition-colors font-medium"
              >
                Create New Support Ticket
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {paymentResponse ? "Complete Payment" : "Create Booking"}
                </h3>
                <button
                  onClick={paymentResponse ? handleClosePayment : () => setShowBookingForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Payment View */}
              {paymentResponse ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Booking Created Successfully!</h4>
                    <p className="text-gray-600 mb-6">{paymentResponse.message}</p>
                  </div>

                  {/* QR Code */}
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-3">Scan QR Code to Pay</p>
                    <img 
                      src={paymentResponse.payment_qr_code} 
                      alt="Payment QR Code"
                      className="w-48 h-48 mx-auto border border-gray-200 rounded-lg"
                    />
                  </div>

                  {/* Payment Link */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-3">Or click the link below:</p>
                    <a
                      href={paymentResponse.payment_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 py-3 bg-[#F28C0D] text-white rounded-lg hover:bg-[#F28C0D]/90 transition-colors font-medium"
                    >
                      Open Payment Link
                    </a>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleClosePayment}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                /* Booking Form */
                <>
                  <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Method
                  </label>
                  <select
                    value={bookingData.delivery_method}
                    onChange={(e) => setBookingData(prev => ({ 
                      ...prev, 
                      delivery_method: e.target.value as "virtual" | "physical" 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D]/20 focus:border-[#F28C0D]"
                  >
                    <option value="virtual">Virtual</option>
                    <option value="physical">Physical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.start_date}
                    onChange={(e) => setBookingData(prev => ({ ...prev, start_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D]/20 focus:border-[#F28C0D]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={bookingData.end_date}
                    onChange={(e) => setBookingData(prev => ({ ...prev, end_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D]/20 focus:border-[#F28C0D]"
                    required
                  />
                </div>

                {bookingData.delivery_method === "physical" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={bookingData.address}
                      onChange={(e) => setBookingData(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Enter delivery address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D]/20 focus:border-[#F28C0D]"
                      rows={3}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={bookingData.amount}
                    onChange={(e) => setBookingData(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    placeholder="Enter booking amount"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D]/20 focus:border-[#F28C0D]"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBookingSubmit}
                  disabled={createBookingMutation.isPending}
                  className="flex-1 px-4 py-2 bg-[#F28C0D] text-white rounded-lg hover:bg-[#F28C0D]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {createBookingMutation.isPending ? "Creating..." : "Create Booking"}
                </button>
              </div>
                </> 
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}