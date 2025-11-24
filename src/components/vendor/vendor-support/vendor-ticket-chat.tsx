"use client";

import { useState, useRef, useEffect } from "react";
import { useGetVendorTicketDetails, type VendorTicketDetails } from "@/hooks/vendor/useGetTicketDetails";
import { useSendVendorTicketReply, type VendorReplyData } from "@/hooks/vendor/useSendTicketReply";
import { 
  Paperclip, 
  Send, 
  User,
  Phone,
  Video,
  Info,
  Smile,
  X
} from "lucide-react";
import { toast } from "sonner";

interface VendorMessage {
  id: string;
  content: string;
  timestamp: string;
  sender: "customer" | "vendor";
  type: "message" | "system";
}

interface VendorTicketChatProps {
  ticketId: string;
  onClose: () => void;
}

export function VendorTicketChat({ ticketId, onClose }: VendorTicketChatProps) {
  const [messages, setMessages] = useState<VendorMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch ticket details
  const { data: ticketDetailsResponse, isLoading } = useGetVendorTicketDetails(ticketId);
  const sendReplyMutation = useSendVendorTicketReply();

  const ticketDetails: VendorTicketDetails | null = ticketDetailsResponse?.data || null;
  
  // Update messages when data arrives
  useEffect(() => {
    if (ticketDetails?.messages) {
      // Convert API messages to our Message format
      const apiMessages: VendorMessage[] = ticketDetails.messages.map((msg: any, index: number) => ({
        id: `msg-${index}`,
        content: msg.message,
        timestamp: msg.timestamp,
        sender: msg.sender === "customer" ? "customer" : "vendor",
        type: "message"
      }));
      
      setMessages(apiMessages);
    }
  }, [ticketDetails]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !attachedFile) return;
    if (!ticketDetails) return;

    // Add message optimistically to UI
    const optimisticMessage: VendorMessage = {
      id: Date.now().toString(),
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: "vendor",
      type: "message"
    };

    setMessages(prev => [...prev, optimisticMessage]);
    const messageText = newMessage;
    const file = attachedFile;
    setNewMessage("");
    setAttachedFile(null);

    try {
      // Send message to API
      const replyData: VendorReplyData = {
        ticket_id: ticketId,
        service_id: ticketDetails.service_detail.id.toString(),
        description: messageText,
        file: file || undefined,
      };

      await sendReplyMutation.mutateAsync(replyData);
      
      // The API will automatically update the ticket details through query invalidation
    } catch (error) {
      console.error("Error sending vendor reply:", error);
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== optimisticMessage.id));
      // Restore the message text
      setNewMessage(messageText);
      setAttachedFile(file);
      
      const errorMessage = error instanceof Error ? error.message : "Failed to send reply";
      toast.error(`Failed to send reply: ${errorMessage}. Please try again.`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[600px] bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F28C0D]"></div>
        </div>
      </div>
    );
  }

  if (!ticketDetails) {
    return (
      <div className="flex h-[600px] bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p>Ticket not found</p>
            <button onClick={onClose} className="text-[#F28C0D] hover:text-[#F28C0D]/80 mt-2">
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                {ticketDetails.user_detail.profile_photo ? (
                  <img 
                    src={ticketDetails.user_detail.profile_photo} 
                    alt={ticketDetails.user_detail.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#F28C0D] to-orange-500 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {ticketDetails.user_detail.full_name.split(' ').map((word: string) => word[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{ticketDetails.user_detail.full_name}</h3>
                <p className="text-sm text-gray-500">
                  {ticketDetails.subject} • {ticketDetails.service_detail.name}
                </p>
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
              <button 
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50/30">
          <div className="text-center">
            <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
              {new Date(ticketDetails.created_at).toLocaleDateString('en-US', { 
                weekday: 'long',
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-start space-x-3 ${msg.sender === "vendor" ? "justify-end" : ""}`}>
              {msg.sender !== "vendor" && (
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  {ticketDetails.user_detail.profile_photo ? (
                    <img 
                      src={ticketDetails.user_detail.profile_photo} 
                      alt={ticketDetails.user_detail.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              )}
              <div className="flex-1 max-w-md">
                <div className={`p-3 shadow-sm ${
                  msg.sender === "vendor" 
                    ? "bg-[#F28C0D] text-white rounded-2xl rounded-tr-md ml-auto" 
                    : "bg-white border border-gray-100 rounded-2xl rounded-tl-md"
                }`}>
                  <div className="text-sm leading-relaxed">{msg.content}</div>
                </div>
                <div className={`text-xs mt-1 ${
                  msg.sender === "vendor" ? "text-gray-500 text-right mr-3" : "text-gray-500 ml-3"
                }`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  {msg.sender === "vendor" && (
                    <svg className="w-4 h-4 text-green-500 inline ml-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              {msg.sender === "vendor" && (
                <div className="w-8 h-8 bg-gradient-to-br from-[#F28C0D] to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message Input */}
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
            
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your reply..."
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
              disabled={(!newMessage.trim() && !attachedFile) || sendReplyMutation.isPending}
              className="p-3 bg-[#F28C0D] text-white rounded-xl hover:bg-[#F28C0D]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
            >
              {sendReplyMutation.isPending ? (
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
      </div>
    </div>
  );
}