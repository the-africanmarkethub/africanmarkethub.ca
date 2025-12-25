"use client";

import { LuChevronLeft } from "react-icons/lu";
import Image from "next/image";
import { Participant } from "@/interfaces/ticket";
import BookingModal from "./BookingModal";
import { useState } from "react";
import toast from "react-hot-toast";
import { createBookingProposal } from "@/lib/api/customer/services";

interface ChatHeaderProps {
  participant: Participant | null;
  onBack?: () => void;
  ticketId: string;
}

export default function ChatHeader({
  participant,
  onBack,
  ticketId,
}: ChatHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookingSubmit = async (bookingData: any) => {
    setIsSubmitting(true);
    try {
      const response = await createBookingProposal(bookingData);

      if (response.url) {
        toast.success("Booking proposal sent!", {
          style: { background: "#000", color: "#fff", borderRadius: "12px" },
        });
        setIsModalOpen(false);
        // window.open(response.url, '_blank');
        window.location.href = response.url;
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to create booking";
      setIsModalOpen(false);
      toast.error(message);
      console.error("Booking Error:", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!participant) return null;

  return (
    <header className="p-3 md:p-4 border-b border-hub-secondary flex items-center justify-between bg-white sticky top-0 z-10 h-17.5">
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          onClick={onBack}
          aria-label="back"
          className="md:hidden p-1 -ml-1 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
        >
          <LuChevronLeft size={24} />
        </button>

        <div className="relative shrink-0">
          <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-100">
            <Image
              src={participant.profile_photo || "/placeholder.png"}
              alt={participant.full_name || "User"}
              width={40}
              height={40}
              unoptimized
              className="h-full w-full object-cover"
            />
          </div>
          {participant.is_online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
          )}
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-bold leading-tight truncate">
            {participant.full_name || "Service Provider"}
          </h2>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider ${
                participant.is_online ? "text-green-500" : "text-gray-400"
              }`}
            >
              {participant.is_online ? "Active Now" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-hub-primary text-white text-xs font-bold px-4 py-2 rounded-full hover:brightness-110 transition-all active:scale-95 shadow-sm shadow-orange-100"
        >
          Book now
        </button>
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticketId={ticketId}
        onSubmit={handleBookingSubmit}
        loading={isSubmitting}
      />
    </header>
  );
}
