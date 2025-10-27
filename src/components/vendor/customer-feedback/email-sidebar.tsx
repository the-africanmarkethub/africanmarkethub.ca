"use client";

import { Button } from "@/components/vendor/ui/button";
import { Badge } from "@/components/vendor/ui/badge";
import { Send, Star, AlertCircle, Trash2, Plus, X, Mail } from "lucide-react";
import { ComposeMessageDialog } from "./compose-message-dialog";
import { cn } from "@/lib/utils";

interface EmailSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
  setIsComposingMail?: () => void;
}

export function EmailSidebar({
  isOpen = true,
  onClose,
  className,
  setIsComposingMail,
}: EmailSidebarProps) {
  const handleComposeMessage = () => {
    onClose?.();
    setIsComposingMail?.();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 xl:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 bg-white transform transition-transform duration-300 ease-in-out xl:relative h-full xl:translate-x-0 xl:w-[344px] xl:rounded-2xl xl:z-20",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b xl:hidden">
          <h1 className="text-xl/8 font-medium text-[#292929]">My Email</h1>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Desktop Header */}
        <div className="hidden xl:block pt-6 px-6 pb-4">
          <h1 className="text-xl font-medium text-[#292929] mb-4">My Email</h1>
          <ComposeMessageDialog />
        </div>

        {/* Mobile Compose Button */}
        <div className="p-4 xl:hidden">
          <Button
            className="w-full text-base leading-[22px] bg-primary hover:text-primary text-[#FFFFFF] rounded-full"
            onClick={handleComposeMessage}
          >
            <Plus /> Compose Email
          </Button>
        </div>

        <nav className="space-y-1 xl:px-0 border-b">
          <div className="flex items-center justify-between bg-[#FFFBED] rounded-[8px] px-6 py-4">
            <div className="flex items-center text-[#464646] text-[16px] leading-[22px] font-normal">
              <Mail className="w-4 h-4 mr-2" />
              Inbox
            </div>
            <Badge className="bg-[#FFF6D5] text-primary font-medium text-[10px] leading-[13px] rounded-[8px] p-2">
              New
            </Badge>
          </div>
          <div className="flex items-center text-[16px] leading-[22px] text-[#464646] hover:bg-gray-50 rounded-[8px] cursor-pointer  px-6 py-4">
            <Send className="w-4 h-4 mr-2" />
            Sent
          </div>
          <div className="flex items-center text-[16px] leading-[22px] text-[#464646] hover:bg-gray-50 rounded-[8px] cursor-pointer px-6 py-4">
            <Star className="w-4 h-4 mr-2" />
            Starred
          </div>
          <div className="flex items-center text-[16px] leading-[22px] text-[#464646] hover:bg-gray-50 rounded-[8px] cursor-pointer px-6 py-4">
            <AlertCircle className="w-4 h-4 mr-2" />
            Spam
          </div>
          <div className="flex items-center text-[16px] leading-[22px] text-[#464646] hover:bg-gray-50 rounded-[8px] cursor-pointer px-6 py-4">
            <Trash2 className="w-4 h-4 mr-2" />
            Bin
          </div>
        </nav>

        <div className="mt-8 px-6 space-y-2">
          <Button
            variant="ghost"
            className="w-full flex justify-start items-center text-[16px] leading-[22px] text-[#464646] hover:bg-gray-50 rounded-[8px] px-0 py-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Label
          </Button>
          <Button
            variant="ghost"
            className="w-full flex justify-start items-center text-[16px] leading-[22px] text-[#464646] hover:bg-gray-50 rounded-[8px] px-0 py-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Label
          </Button>
          <Button
            variant="ghost"
            className="w-full flex justify-start items-center text-[16px] leading-[22px] text-[#464646] hover:bg-gray-50 rounded-[8px] cursor-pointer px-0 py-4"
          >
            <Plus className="w-4 h-4 mr-2" />
            Label
          </Button>
        </div>
      </div>
    </>
  );
}
