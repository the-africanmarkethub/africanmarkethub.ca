"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/vendor/ui/button";
import { Input } from "@/components/vendor/ui/input";
import { Label } from "@/components/vendor/ui/label";
import { Textarea } from "@/components/vendor/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/vendor/ui/select";
import { Badge } from "@/components/vendor/ui/badge";
import { useCreateTicket, type CreateTicketData } from "@/hooks/vendor/useCreateTicket";
import { useUpdateTicket, type UpdateTicketData } from "@/hooks/vendor/useUpdateTicket";
import { 
  Paperclip, 
  Send, 
  User, 
  Clock,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { tv } from "tailwind-variants";

const ticketChat = tv({
  slots: {
    container: "flex flex-col h-[600px] bg-white rounded-lg border border-gray-200",
    header: "flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50",
    chatArea: "flex-1 overflow-y-auto p-4 space-y-4",
    inputArea: "border-t border-gray-200 p-4 bg-gray-50",
    message: "flex items-start space-x-3",
    messageContent: "flex-1 bg-white rounded-lg p-3 shadow-sm border",
    userMessage: "flex items-start space-x-3 justify-end",
    userMessageContent: "flex-1 bg-blue-50 rounded-lg p-3 shadow-sm border border-blue-200",
    avatar: "w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center",
    timestamp: "text-xs text-gray-500 mt-1",
    inputForm: "flex items-end space-x-2",
    textInput: "flex-1 min-h-[40px] resize-none",
    priorityBadge: "text-xs",
    statusBadge: "text-xs",
  },
});

const { 
  container, 
  header, 
  chatArea, 
  inputArea, 
  message, 
  messageContent,
  userMessage,
  userMessageContent,
  avatar, 
  timestamp,
  inputForm,
  textInput,
  priorityBadge,
  statusBadge,
} = ticketChat();

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sender: "user" | "support";
  type: "message" | "system";
}

interface TicketChatProps {
  ticket?: {
    ticket_id: string;
    title: string;
    subject: string;
    description: string;
    priority_level: "low" | "medium" | "high";
    response_status: "open" | "close" | "ongoing";
    created_at: string;
    updated_at: string;
  };
  onTicketCreated?: (ticketId: string) => void;
  isNewTicket?: boolean;
}

export function TicketChat({ ticket, onTicketCreated, isNewTicket = false }: TicketChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(isNewTicket);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state for creating new ticket
  const [formData, setFormData] = useState<Partial<CreateTicketData>>({
    service_id: "13",
    title: "",
    subject: "",
    description: "",
    priority_level: "medium",
    response_status: "open",
  });

  const createTicketMutation = useCreateTicket();
  const updateTicketMutation = useUpdateTicket();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAttachedFile(file);
    }
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
        onTicketCreated?.(result.data.ticket_id);
        
        // Add initial system message
        const systemMessage: Message = {
          id: "1",
          content: `Ticket created successfully: ${formData.title}`,
          timestamp: new Date().toISOString(),
          sender: "support",
          type: "system"
        };
        setMessages([systemMessage]);
        
        // Reset form
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
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !attachedFile) return;

    if (ticket) {
      // Update existing ticket with new message
      try {
        const updateData: UpdateTicketData = {
          ticket_id: ticket.ticket_id,
          description: `${ticket.description}\n\n[${new Date().toLocaleString()}] User: ${newMessage}`,
          file: attachedFile || undefined,
        };

        await updateTicketMutation.mutateAsync(updateData);

        // Add message to chat
        const message: Message = {
          id: Date.now().toString(),
          content: newMessage,
          timestamp: new Date().toISOString(),
          sender: "user",
          type: "message"
        };

        setMessages(prev => [...prev, message]);
        setNewMessage("");
        setAttachedFile(null);
      } catch (error) {
        console.error("Error updating ticket:", error);
      }
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "default";
      case "ongoing": return "default";
      case "close": return "success";
      default: return "default";
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
      <div className={container()}>
        <div className={header()}>
          <h3 className="font-semibold text-gray-900">Create New Support Ticket</h3>
        </div>
        
        <div className="p-6 space-y-4 overflow-y-auto">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Brief title for your issue"
            />
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Subject of your inquiry"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of your issue..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">Priority Level</Label>
              <Select 
                value={formData.priority_level} 
                onValueChange={(value: "low" | "medium" | "high") => 
                  setFormData(prev => ({ ...prev, priority_level: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="file">Attachment (Optional)</Label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full justify-start"
              >
                <Paperclip className="w-4 h-4 mr-2" />
                {attachedFile ? attachedFile.name : "Select file"}
              </Button>
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button 
              onClick={handleCreateTicket}
              disabled={createTicketMutation.isPending || !formData.title || !formData.subject || !formData.description}
              className="flex-1"
            >
              {createTicketMutation.isPending ? "Creating..." : "Create Ticket"}
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={container()}>
      <div className={header()}>
        <div>
          <h3 className="font-semibold text-gray-900">
            {ticket ? `Ticket #${ticket.ticket_id}` : "Support Chat"}
          </h3>
          {ticket && (
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={getPriorityColor(ticket.priority_level)} className={priorityBadge()}>
                {ticket.priority_level}
              </Badge>
              <Badge variant={getStatusColor(ticket.response_status)} className={statusBadge()}>
                {getStatusIcon(ticket.response_status)}
                <span className="ml-1">{ticket.response_status}</span>
              </Badge>
            </div>
          )}
        </div>
        {!ticket && (
          <Button variant="outline" onClick={() => setShowCreateForm(true)}>
            New Ticket
          </Button>
        )}
      </div>

      <div className={chatArea()}>
        {ticket && (
          <div className={message()}>
            <div className={avatar()}>
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className={messageContent()}>
              <div className="font-medium text-sm text-gray-900">{ticket.title}</div>
              <div className="text-sm text-gray-700 mt-1">{ticket.subject}</div>
              <div className="text-sm text-gray-600 mt-2">{ticket.description}</div>
              <div className={timestamp()}>
                {new Date(ticket.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={msg.sender === "user" ? userMessage() : message()}>
            {msg.sender !== "user" && (
              <div className={avatar()}>
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
            <div className={msg.sender === "user" ? userMessageContent() : messageContent()}>
              <div className="text-sm text-gray-900">{msg.content}</div>
              <div className={timestamp()}>
                {new Date(msg.timestamp).toLocaleString()}
              </div>
            </div>
            {msg.sender === "user" && (
              <div className={avatar()}>
                <User className="w-4 h-4 text-gray-600" />
              </div>
            )}
          </div>
        ))}
      </div>

      {ticket && (
        <div className={inputArea()}>
          <div className={inputForm()}>
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className={textInput()}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={handleSendMessage}
              disabled={(!newMessage.trim() && !attachedFile) || updateTicketMutation.isPending}
              size="icon"
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {attachedFile && (
            <div className="flex items-center justify-between bg-blue-50 p-2 rounded mt-2">
              <span className="text-sm text-blue-900">{attachedFile.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAttachedFile(null)}
              >
                Remove
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}