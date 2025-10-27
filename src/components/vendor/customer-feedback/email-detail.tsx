"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/vendor/ui/button";
import { Input } from "@/components/vendor/ui/input";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/vendor/ui/avatar";
import {
  ArrowLeft,
  Trash2,
  Star,
  Reply,
  Paperclip,
  Send,
  Menu,
  MoreVertical,
  Mail,
} from "lucide-react";
import type { Email } from "@/app/vendor/(app)/customer-feedback/message/page";

interface EmailDetailProps {
  email: Email;
  onBack: () => void;
  onStarToggle: (emailId: string) => void;
  onMenuToggle?: () => void;
}

export function EmailDetail({
  email,
  onBack,
  onStarToggle,
  onMenuToggle,
}: EmailDetailProps) {
  const [replyMessage, setReplyMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleSendReply = () => {
    if (replyMessage.trim()) {
      console.log("Sending reply:", replyMessage);
      setReplyMessage("");
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col xl:rounded-2xl">
      {/* Header */}
      <div className="px-6 pt-2 pb-1 xl:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuToggle}
              className="xl:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>

            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="w-5 h-5 xl:w-6 xl:h-6" />
            </Button>
          </div>

          <div className="flex items-center gap-x-4 text-[#7C7C7C]">
            <Button variant="ghost" className="p-0 [&_svg]:size-6 xl:hidden">
              <Mail />
            </Button>
            <Button
              variant="ghost"
              className="hidden p-0 [&_svg]:size-6 xl:block"
            >
              <Star />
            </Button>
            <Button variant="ghost" className="order-first p-0 [&_svg]:size-6">
              <Trash2 />
            </Button>
            <Button variant="ghost" className="p-0 [&_svg]:size-6">
              <MoreVertical />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between pl-2 mt-4 xl:hidden">
          <div className="flex gap-x-4">
            <p className="text-[#464646] text-sm font-medium">
              {email.subject}
            </p>
            <div className="bg-[#EEEEEE] px-2 py-0.5 rounded-[5px] text-xs text-[#1F2024]">
              Inbox
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-8 h-8 xl:w-6 xl:h-6 text-[#7C7C7C]"
            onClick={() => onStarToggle(email.id)}
          >
            <Star
              className={`w-6 h-6 ${
                email.isStarred ? "fill-yellow-500 text-yellow-500" : ""
              }`}
            />
          </Button>
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 px-6 pb-4 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Message Header */}
          <div className="flex items-center gap-3 xl:gap-4 mb-4 xl:mb-6">
            <Avatar className="w-10 h-10 xl:w-12 xl:h-12">
              <AvatarImage src={email.avatar} alt={email.sender} />
              <AvatarFallback>
                {email.sender
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-y-2 gap-x-2 min-w-0 font-normal text-xs text-[#7C7C7C] truncate xl:flex-row">
                  <h3 className="">{email.sender}</h3>
                  <p className="">&lt;{email.email}&gt;</p>
                </div>
                <div className="flex items-center justify-center gap-x-12">
                  <span className="text-xs font-normal text-[#7C7C7C] flex-shrink-0">
                    {email.time}
                  </span>
                  <Reply className="w-6 h-6 xl:hidden" />
                </div>
              </div>
              <h4 className="hidden text-base font-medium text-[#525252] xl:text-xl/8 xl:block">
                {email.subject}
              </h4>
            </div>
          </div>

          {/* Message Body */}
          <div className="mb-6 xl:mb-8">
            <p className="text-sm xl:text-base leading-relaxed xl:leading-[22px] text-[#525252]">
              Hi, I would like to ask some questions about the shoes in your
              catalog. Would you mind helping me?
            </p>
          </div>
        </div>
      </div>

      {/* Reply Section */}
      <div className="border-t border-gray-200 p-4 xl:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2 xl:gap-3">
            <div className="flex items-center flex-1 border border-[#DCDCDC]">
              <Input
                placeholder="Type your message"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="min-h-[44px] w-full bg-white focus:ring-0 border-0 placeholder:text-[#7C7C7C] placeholder:font-normal text-sm focus:outline-none"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendReply();
                  }
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                className=""
                onClick={handleAttachFile}
              >
                <Paperclip className="w-5 h-5 xl:w-6 xl:h-6" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                />
              </Button>
            </div>
            <Button
              onClick={handleSendReply}
              className="bg-[#F28C0D] hover:bg-orange-600 text-white rounded-[39px] px-4 xl:px-6"
              size="sm"
            >
              Send
              <Send className="w-4 h-4 xl:ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
