"use client";

import { LuChevronLeft } from "react-icons/lu";
import Image from "next/image";
import { Participant } from "@/interfaces/ticket";
import BookingModal from "./BookingModal";
import BookingConfirmationCodeModal from "./BookingConfirmationCodeModal";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  createBookingProposal,
  updateBookingStatus,
  verifyBookingCode
} from "@/lib/api/customer/services";
import Skeleton from "react-loading-skeleton";
import { useAuthStore } from "@/store/useAuthStore";

interface ChatHeaderProps {
  participant: Participant | null;
  onBack?: () => void;
  ticketId: string;
  bookingStatus: string; // 'pending', 'ongoing', 'delivered', 'completed'
  isLoading?: boolean;
}

export default function ChatHeader({
  participant,
  onBack,
  ticketId,
  bookingStatus,
  isLoading,
}: ChatHeaderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const { user } = useAuthStore();

  const isCustomer = user?.role === 'customer';
  const isVendor = user?.role === 'vendor';
  const displayParticipant = participant && !isLoading;

  const handleBookingSubmit = async (bookingData: any) => {
    setIsSubmitting(true);
    try {
      const response = await createBookingProposal(bookingData);
      if (response.url) {
        toast.success("Booking proposal sent!");
        setIsModalOpen(false);
        window.location.href = response.url;
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to create booking";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    setIsProcessing(true);
    try {
      await updateBookingStatus(ticketId, 'delivered');
      toast.success("Code sent to customer! Ask them for the 4-digit code.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyCode = async (code: string) => {
    try {
      await verifyBookingCode(ticketId, code);
      toast.success("Booking completed successfully!");
      setIsCodeModalOpen(false);
      // router.refresh() 
    } catch (error: any) {
      toast.error("Invalid code. Please try again.");
    }
  };

  if (!participant && !isLoading) return null;

  return (
    <header className="p-3 md:p-4 border-b border-hub-secondary flex items-center justify-between bg-white sticky top-0 z-10 h-17.5">
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          onClick={onBack}
          className="p-1 -ml-1 text-gray-500 transition-colors rounded-full md:hidden hover:bg-gray-100"
        >
          <LuChevronLeft size={24} />
        </button>

        <div className="relative shrink-0">
          <div className="w-10 h-10 overflow-hidden border border-gray-100 rounded-full">
            {isLoading ? (
              <Skeleton circle height={40} width={40} />
            ) : (
              <Image
                src={participant?.profile_photo || "/placeholder.png"}
                alt={participant?.full_name || "User"}
                width={40}
                height={40}
                unoptimized
                className="object-cover w-full h-full"
              />
            )}
          </div>
          {displayParticipant && participant?.is_online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-hub-primary" />
          )}
        </div>

        <div className="min-w-0">
          {isLoading ? (
            <div className="space-y-1">
              <Skeleton height={16} width={120} />
              <Skeleton height={10} width={60} />
            </div>
          ) : (
            <>
              <h2 className="text-sm font-bold leading-tight truncate">
                {participant?.full_name || "Service Provider"}
              </h2>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-semibold uppercase tracking-wider ${participant?.is_online ? "text-hub-primary" : "text-gray-400"
                  }`}>
                  {participant?.is_online ? "Active Now" : "Offline"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isLoading && (
          <> 
            {isCustomer && (
              <button
                onClick={() => bookingStatus === 'pending' && setIsModalOpen(true)}
                disabled={bookingStatus !== 'pending'}
                className={`text-white text-xs font-bold px-4 py-2 rounded-full transition-all active:scale-95 shadow-sm ${bookingStatus === 'pending' ? "bg-hub-primary hover:brightness-110" : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                {bookingStatus === 'pending' ? "Book now" : "In Progress"}
              </button>
            )}
 
            {isVendor && (
              <>
                {bookingStatus === 'ongoing' && (
                  <button
                    onClick={handleMarkAsDelivered}
                    disabled={isProcessing}
                    className="px-4 py-2 text-xs font-bold text-white transition-all bg-orange-500 rounded-full shadow-sm hover:bg-orange-600"
                  >
                    {isProcessing ? 'Processing...' : 'Mark as Delivered'}
                  </button>
                )}

                {bookingStatus === 'delivered' && (
                  <button
                    onClick={() => setIsCodeModalOpen(true)}
                    className="px-4 py-2 text-xs font-bold text-white transition-all rounded-full bg-hub-primary hover:brightness-110 animate-pulse"
                  >
                    Verify Completion Code
                  </button>
                )}
              </>
            )}
          </>
        )}
      </div>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticketId={ticketId}
        onSubmit={handleBookingSubmit}
        loading={isSubmitting}
      />

      <BookingConfirmationCodeModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        onVerify={handleVerifyCode}
      />
    </header>
  );
}