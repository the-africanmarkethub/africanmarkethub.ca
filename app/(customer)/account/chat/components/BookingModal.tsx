"use client";

import React, { useState, useMemo } from "react";
import {
  format,
  addDays,
  startOfToday,
  setHours,
  setMinutes,
  isSameDay,
} from "date-fns";
import { LuCalendar, LuMapPin, LuDollarSign, LuTruck, LuClock } from "react-icons/lu";
import Modal from "@/app/components/common/Modal";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticketId: string;
  onSubmit: (data: any) => void;
  loading?: boolean;
}

export default function BookingModal({
  isOpen,
  onClose,
  ticketId,
  onSubmit,
  loading,
}: BookingModalProps) {
  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [deliveryMethod, setDeliveryMethod] = useState("onsite");
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");

  // Generate next 14 days for the horizontal scroller
  const days = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => addDays(today, i));
  }, [today]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const [hours, minutes] = selectedTime.split(":").map(Number);
    const startDate = setMinutes(setHours(selectedDate, hours), minutes);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    onSubmit({
      ticket_id: ticketId,
      delivery_method: deliveryMethod,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      address: ["onsite", "pickup"].includes(deliveryMethod) ? address : "",
      amount: parseFloat(amount),
    });
  };

  const showAddress = ["onsite", "pickup"].includes(deliveryMethod);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Finalize Booking">
      <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5 p-1">

        {/* Date Scroller */}
        <section className="space-y-2">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <LuCalendar className="text-hub-primary" /> Select Date
          </label>
          <div className="flex gap-2 pb-2 overflow-x-auto scrollbar-hide snap-x">
            {days.map((day) => {
              const isSelected = isSameDay(day, selectedDate);
              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => setSelectedDate(day)}
                  className={`flex flex-col items-center justify-center min-w-[55px] h-[70px] rounded-2xl border transition-all snap-start ${isSelected
                    ? "bg-hub-primary border-hub-primary text-white shadow-lg shadow-hub-primary/20"
                    : "bg-gray-50 border-gray-100 text-gray-600 hover:border-hub-primary/30"
                    }`}
                >
                  <span className="text-[10px] uppercase font-medium opacity-80">
                    {format(day, "EEE")}
                  </span>
                  <span className="text-lg font-bold">{format(day, "d")}</span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-2 gap-4">
          {/* Time Input */}
          <section className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <LuClock className="text-hub-primary" /> Time
            </label>
            <input
              type="time"
              required
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-hub-primary transition-colors"
            />
          </section>

          {/* Amount Input */}
          <section className="space-y-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <LuDollarSign className="text-hub-primary" /> Agreed Amount
            </label>
            <div className="relative">
              <span className="absolute text-sm font-bold text-gray-400 -translate-y-1/2 left-3 top-1/2">
                $
              </span>
              <input
                type="number"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-7 pr-3 py-2.5 text-sm font-bold text-gray-700 outline-none focus:border-hub-primary transition-colors"
              />
            </div>
          </section>
        </div>

        {/* Delivery Method */}
        <section className="space-y-2">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <LuTruck className="text-hub-primary" /> Delivery Method
          </label>
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            {["onsite", "pickup", "remote"].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setDeliveryMethod(method)}
                className={`flex-1 py-2 rounded-lg text-[11px] font-bold capitalize transition-all ${deliveryMethod === method
                  ? "bg-white text-hub-primary shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {method}
              </button>
            ))}
          </div>
        </section>

        {/* Conditional Address Field */}
        {showAddress && (
          <section className="space-y-2 duration-300 animate-in fade-in slide-in-from-top-2">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
              <LuMapPin className="text-hub-primary" /> {deliveryMethod === 'onsite' ? 'Service Address' : 'Pickup Location'}
            </label>
            <textarea
              placeholder="Enter full address details..."
              required={showAddress}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm text-gray-700 outline-none focus:border-hub-primary transition-colors min-h-[80px] resize-none"
            />
          </section>
        )}

        {/* Footer Action */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full cursor-pointer bg-hub-primary hover:bg-hub-primary/90 text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-hub-primary/20 transition-all active:scale-[0.98] disabled:opacity-70"
          >
            {loading ? "Processing..." : "Confirm & Pay"}
          </button>
          <p className="text-xs text-center">You will be directed to secured stripe for payment processing.</p>
        </div>
      </form>
    </Modal>
  );
}