"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCreateBooking } from "@/hooks/useBooking";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  serviceName: string;
  servicePrice: number;
}

export function BookingModal({
  isOpen,
  onClose,
  ticketId,
  serviceName,
  servicePrice,
}: BookingModalProps) {
  const router = useRouter();
  const createBooking = useCreateBooking();
  
  const [deliveryMethod, setDeliveryMethod] = useState<'virtual' | 'physical'>('virtual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState(servicePrice);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      toast.error("Please select start and end dates");
      return;
    }
    
    if (deliveryMethod === 'physical' && !address) {
      toast.error("Please enter an address for physical delivery");
      return;
    }

    createBooking.mutate({
      ticket_id: ticketId,
      delivery_method: deliveryMethod,
      start_date: startDate,
      end_date: endDate,
      address: deliveryMethod === 'physical' ? address : undefined,
      amount: amount,
    }, {
      onSuccess: (data) => {
        toast.success("Booking created! Redirecting to payment...");
        onClose(); // Close modal first
        // Small delay to show the toast before redirecting
        setTimeout(() => {
          window.location.href = data.payment_link;
        }, 1500);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create booking");
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Book Service</h2>
          <p className="text-gray-600 mb-6">Complete your booking for: {serviceName}</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Delivery Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="virtual"
                    checked={deliveryMethod === 'virtual'}
                    onChange={(e) => setDeliveryMethod(e.target.value as 'virtual')}
                    className="mr-2"
                  />
                  <span>Virtual</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="physical"
                    checked={deliveryMethod === 'physical'}
                    onChange={(e) => setDeliveryMethod(e.target.value as 'physical')}
                    className="mr-2"
                  />
                  <span>Physical</span>
                </label>
              </div>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F28C0D]"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || new Date().toISOString().split('T')[0]}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F28C0D]"
              />
            </div>

            {/* Address (conditional) */}
            {deliveryMethod === 'physical' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required={deliveryMethod === 'physical'}
                  rows={3}
                  placeholder="Enter your delivery address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F28C0D]"
                />
              </div>
            )}

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (CAD)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="0"
                step="0.01"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F28C0D]"
              />
            </div>

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createBooking.isPending}
                className="flex-1 px-4 py-2 bg-[#F28C0D] text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createBooking.isPending ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}