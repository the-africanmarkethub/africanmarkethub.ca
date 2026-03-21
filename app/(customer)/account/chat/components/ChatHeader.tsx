"use client";

import { LuChevronLeft } from "react-icons/lu";
import Image from "next/image";
import { Participant } from "@/interfaces/ticket";
import BookingModal from "./BookingModal";
import { useState } from "react";
import toast from "react-hot-toast";
import { createBookingProposal, updateBookingStatus } from "@/lib/api/customer/services";
import Skeleton from "react-loading-skeleton";
import { useAuthStore } from "@/store/useAuthStore";
interface ChatHeaderProps {
  participant: Participant | null;
  onBack?: () => void;
  ticketId: string;
  bookingStatus: string;
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuthStore();
  const [isMarkingCompleted, setIsMarkingCompleted] = useState(false);  

  const isCustomer = user?.role === 'customer';
  const isBooked = bookingStatus === "ongoing";
  const buttonText = isBooked ? "Booked" : "Book now";
  const customerButtonDisabled = isBooked;

  const buttonBaseClass = "text-white text-xs font-bold px-4 py-2 rounded-full transition-all active:scale-95 shadow-sm";
  const buttonActiveStyle = "bg-hub-primary hover:brightness-110 shadow-green-100";
  const buttonBookedStyle = "bg-gray-400 cursor-not-allowed";

  const finalButtonClass = isBooked
    ? `${buttonBaseClass} ${buttonBookedStyle}`
    : `${buttonBaseClass} ${buttonActiveStyle}`;

  const isVendor = user?.role === 'vendor';
  const showVendorCompleteButton = isVendor && bookingStatus === 'ongoing';

  const handleMarkAsCompleted = async () => {
    setIsMarkingCompleted(true);
    try {
      const response = await updateBookingStatus(ticketId, 'delivered');
      toast.success("Confirmation code has been sent to the customer!"); 
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to mark as completed.";
      toast.error(errorMessage);
    } finally {
      setIsMarkingCompleted(false);
    }
  };
  
  const handleBookingSubmit = async (bookingData: any) => {
    setIsSubmitting(true);
    try {
      const response = await createBookingProposal(bookingData);

      if (response.url) {
        toast.success("Booking proposal sent!", {
          style: { background: "#000", color: "#fff", borderRadius: "12px" },
        });
        setIsModalOpen(false);
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
  const displayParticipant = participant && !isLoading;

  return (
    <header className="p-3 md:p-4 border-b border-hub-secondary flex items-center justify-between bg-white sticky top-0 z-10 h-17.5">
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          onClick={onBack}
          aria-label="back"
          className="p-1 -ml-1 text-gray-500 transition-colors rounded-full md:hidden hover:bg-gray-100"
        >
          <LuChevronLeft size={24} />
        </button>

        <div className="relative shrink-0">
          <div className="w-10 h-10 overflow-hidden border border-gray-100 rounded-full">
            {isLoading ? (
              <Skeleton
                circle
                height={40}
                width={40}
                className="leading-none"
              />
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
          {displayParticipant && participant.is_online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-hub-primary" />
          )}
        </div>

        <div className="min-w-0">
          {isLoading ? (
            <div className="space-y-1">
              {/* Name Skeleton */}
              <Skeleton
                height={16}
                width={120}
                className="leading-none"
                baseColor="#f3f4f6"
                highlightColor="#e5e7eb"
              />
              {/* Status Skeleton */}
              <Skeleton
                height={10}
                width={60}
                className="leading-none"
                baseColor="#f9fafb"
                highlightColor="#f3f4f6"
              />
            </div>
          ) : (
            <>
              <h2 className="text-sm font-bold leading-tight truncate">
                {participant?.full_name || "Service Provider"}
              </h2>
              <div className="flex items-center gap-1.5">
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider ${participant?.is_online ? "text-hub-primary" : "text-gray-400"
                    }`}
                >
                  {participant?.is_online ? "Active Now" : "Offline"}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isLoading ? (
          <Skeleton
            height={32}
            width={90}
            borderRadius={999}
            baseColor="#f3f4f6"
            highlightColor="#e5e7eb"
          />
        ) : (
          <>
              {isCustomer && (
                <button
                  onClick={() => !customerButtonDisabled && setIsModalOpen(true)}
                  className={finalButtonClass}
                  disabled={customerButtonDisabled}
                >
                  {buttonText}
                </button>
              )}

              {showVendorCompleteButton && (
                <button
                  onClick={handleMarkAsCompleted}
                  disabled={isMarkingCompleted}
                  className="px-4 py-2 text-xs font-bold text-white transition-all rounded-full shadow-md cursor-pointer bg-hub-secondary hover:bg-hub-primary active:scale-95 shadow-blue-200 disabled:bg-hub-primary disabled:cursor-not-allowed"
                >
                  {isMarkingCompleted ? 'Processing...' : 'Mark as Completed'}
                </button>
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
    </header>
  );
}
