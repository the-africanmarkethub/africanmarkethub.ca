"use client";

import { useState } from "react";
import { Input } from "@/components/vendor/ui/input";
import { Button } from "@/components/vendor/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/vendor/ui/avatar";
import { Search, Filter, Star, ChevronDown, Menu, Plus } from "lucide-react";
import type { Email } from "@/app/vendor/(app)/customer-feedback/message/page";
import { Checkbox } from "@/components/vendor/ui/checkbox";

interface EmailListProps {
  emails: Email[];
  onEmailSelect: (email: Email) => void;
  onStarToggle: (emailId: string) => void;
  onMenuToggle?: () => void;
  setIsComposingMail: () => void;
}

export function EmailList({
  emails,
  onEmailSelect,
  onStarToggle,
  onMenuToggle,
  setIsComposingMail,
}: EmailListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const filteredEmails = emails.filter(
    (email) =>
      email.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.preview.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEmailSelect = (emailId: string) => {
    setSelectedEmails((prev) => {
      if (prev.includes(emailId)) {
        return prev.filter((id) => id !== emailId);
      } else {
        return [...prev, emailId];
      }
    });
  };

  return (
    <div className="flex-1 bg-white xl:rounded-2xl p-4 xl:p-6 relative overflow-hidden">
      {/* Header */}
      <div className="mb-6 xl:mb-8">
        <div className="flex items-center gap-3 xl:gap-4 mb-4 xl:hidden">
          <Button variant="ghost" size="sm" onClick={onMenuToggle}>
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-medium text-gray-900">Messages</h1>
        </div>

        <div className="flex items-center gap-3 xl:gap-4">
          <div className="relative flex-1 border border-[#DCDCDC] rounded-[8px] p-1">
            <div className="absolute inset-y-0 left-3 flex items-center">
              <div className="w-6 h-6 xl:w-8 xl:h-8 bg-[#F8F8F8] rounded-full flex items-center justify-center">
                <Search className="text-gray-400 w-3 h-3 xl:w-5 xl:h-5" />
              </div>
            </div>
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-12 xl:pl-16 border-none focus:ring-0 placeholder:text-[#BDBDBD] placeholder:font-normal text-sm focus:outline-none"
            />
          </div>
          <Button
            variant="outline"
            className="text-[#989898] bg-white border border-[#DCDCDC] rounded-[8px] h-12 hidden xl:flex"
          >
            <Filter className="w-5 h-5" />
            Filter
            <ChevronDown className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Email List */}
      <div className="divide-y">
        {filteredEmails.map((email) => (
          <div
            key={email.id}
            className={`p-3 xl:p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
              !email.isRead ? "bg-blue-50" : ""
            } ${selectedEmails.includes(email.id) ? "bg-blue-100" : ""}`}
          >
            <div className="flex items-center gap-x-4">
              <Checkbox
                checked={selectedEmails.includes(email.id)}
                onCheckedChange={() => handleEmailSelect(email.id)}
                onClick={(e) => e.stopPropagation()}
                aria-label={`Select email from ${email.sender}`}
                className="border border-[#DCDCDC] hidden xl:flex"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStarToggle(email.id);
                }}
                className="text-gray-400 hover:text-yellow-500 transition-colors"
              >
                <Star
                  className={`w-4 h-4 hidden xl:block ${
                    email.isStarred ? "fill-yellow-500 text-yellow-500" : ""
                  }`}
                />
              </button>
              <div
                className="flex items-center gap-3 flex-1 min-w-0"
                onClick={() => onEmailSelect(email)}
              >
                <Avatar className="w-8 h-8 xl:w-10 xl:h-10">
                  <AvatarImage
                    src={email.avatar || "/placeholder.svg"}
                    alt={email.sender}
                  />
                  <AvatarFallback className="text-xs">
                    {email.sender
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-sm xl:text-[16px] font-normal leading-[22px]">
                    <div className="flex flex-col items-start gap-y-2 text-[#525252] truncate gap-x-2 xl:flex-row xl:items-center">
                      <p
                        className={`${
                          !email.isRead
                            ? "font-semibold text-[#525252]"
                            : "font-medium text-gray-700"
                        }`}
                      >
                        {email.sender}
                      </p>
                      <p className="">{email.preview}</p>
                    </div>
                    <div className="flex flex-col items-center gap-y-2">
                      <span className="text-[#7C7C7C] ml-2 flex-shrink-0 text-nowrap">
                        {email.time}
                      </span>
                      <Star
                        className={`w-4 h-4 xl:hidden ${
                          email.isStarred
                            ? "fill-yellow-500 text-yellow-500"
                            : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Floating Compose Button */}
      <div className="fixed bottom-6 right-6 xl:hidden">
        <Button
          className="w-full text-base leading-[22px] bg-primary text-[#FFFFFF] rounded-full xl:hidden"
          onClick={setIsComposingMail}
        >
          <Plus /> Compose Email
        </Button>
      </div>
    </div>
  );
}
