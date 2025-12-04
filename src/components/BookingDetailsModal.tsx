"use client";

import { useState } from "react";
import Image from "next/image";
import { useCancelBooking } from "@/hooks/useBookings";

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export default function BookingDetailsModal({ isOpen, onClose, booking }: BookingDetailsModalProps) {
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const { mutate: cancelBooking, isPending: isCanceling } = useCancelBooking();

  if (!isOpen || !booking) return null;

  const handleCancelBooking = () => {
    if (!cancelReason.trim()) {
      alert("Please provide a reason for cancellation");
      return;
    }

    cancelBooking(
      {
        bookingId: booking.id,
        payload: { cancel_reason: cancelReason }
      },
      {
        onSuccess: () => {
          setShowCancelForm(false);
          setCancelReason("");
          onClose();
        }
      }
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const formatPrice = (price: number | string) => {
    return parseFloat(price.toString()).toLocaleString();
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "completed") return "bg-green-100 text-green-700";
    if (statusLower === "processing") return "bg-blue-100 text-blue-700";
    if (statusLower === "pending") return "bg-yellow-100 text-yellow-700";
    if (statusLower === "cancelled") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  const getPaymentBadge = (status: string) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "paid") return "bg-green-100 text-green-700";
    if (statusLower === "pending") return "bg-yellow-100 text-yellow-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Booking Details #{booking.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status and Payment Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadge(booking.delivery_status)}`}>
                {booking.delivery_status}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPaymentBadge(booking.payment_status)}`}>
                Payment: {booking.payment_status}
              </span>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">${formatPrice(booking.total)}</p>
            </div>
          </div>

          {/* Service Details */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Service Information</h3>
            <div className="flex items-start space-x-4">
              <Image
                src={booking.service?.images?.[0] || "/placeholder.png"}
                alt={booking.service?.title}
                width={100}
                height={100}
                className="rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{booking.service?.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{booking.service?.description}</p>
                <div className="mt-3 space-y-1">
                  <p className="text-sm">
                    <span className="text-gray-500">Pricing Model:</span>{" "}
                    <span className="font-medium">{booking.service?.pricing_model === "fixed" ? "Fixed Price" : "Hourly"}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Delivery Method:</span>{" "}
                    <span className="font-medium">{booking.delivery_method === "virtual" ? "Online" : booking.delivery_method}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Estimated Delivery:</span>{" "}
                    <span className="font-medium">{booking.service?.estimated_delivery_time} days</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Available:</span>{" "}
                    <span className="font-medium">
                      {booking.service?.available_from} - {booking.service?.available_to}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{booking.customer?.name} {booking.customer?.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{booking.customer?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{booking.customer?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{booking.customer?.city}, {booking.customer?.state}</p>
              </div>
            </div>
          </div>

          {/* Booking Timeline */}
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Booking Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Created At</span>
                <span className="text-sm font-medium">
                  {formatDate(booking.created_at)} at {formatTime(booking.created_at)}
                </span>
              </div>
              {booking.scheduled_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Scheduled At</span>
                  <span className="text-sm font-medium">
                    {formatDate(booking.scheduled_at)} at {formatTime(booking.scheduled_at)}
                  </span>
                </div>
              )}
              {booking.started_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Started At</span>
                  <span className="text-sm font-medium">
                    {formatDate(booking.started_at)} at {formatTime(booking.started_at)}
                  </span>
                </div>
              )}
              {booking.completed_at && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Completed At</span>
                  <span className="text-sm font-medium">
                    {formatDate(booking.completed_at)} at {formatTime(booking.completed_at)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Cancel Reason (if cancelled) */}
          {booking.delivery_status === "cancelled" && booking.cancel_reason && (
            <div className="border border-red-200 bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">Cancellation Details</h3>
              <p className="text-sm text-red-700">{booking.cancel_reason}</p>
              {booking.cancelled_by && (
                <p className="text-xs text-red-600 mt-2">Cancelled by: {booking.cancelled_by}</p>
              )}
            </div>
          )}

          {/* Cancel Form */}
          {showCancelForm && (
            <div className="border border-orange-200 bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Cancel Booking</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason for cancellation *
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent"
                    placeholder="Please provide a detailed reason for cancellation..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowCancelForm(false);
                      setCancelReason("");
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCancelBooking}
                    disabled={isCanceling || !cancelReason.trim()}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isCanceling ? "Cancelling..." : "Confirm Cancellation"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            {booking.delivery_status === "pending" && !showCancelForm && (
              <>
                <button
                  onClick={() => setShowCancelForm(true)}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                >
                  Cancel Booking
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Start Service
                </button>
              </>
            )}
            {booking.delivery_status === "processing" && !showCancelForm && (
              <>
                <button
                  onClick={() => setShowCancelForm(true)}
                  className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50"
                >
                  Cancel Booking
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Mark as Completed
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}