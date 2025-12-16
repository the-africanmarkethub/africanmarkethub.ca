import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format, addMonths, startOfToday } from "date-fns";
import "react-day-picker/dist/style.css";

export default function AppointmentPicker() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("09:00");
  const [isOpen, setIsOpen] = useState(false);

  const today = startOfToday();
  const twoMonthsFromNow = addMonths(today, 2);

  const displayValue = selectedDate
    ? `${format(selectedDate, "PPP")} at ${selectedTime}`
    : "Select date and time";

  return (
    <div className="flex flex-col gap-2 md:col-span-2 relative">
      <label className="text-sm font-medium text-gray-700 block">
        Preferred Date & Time
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900 focus:border-hub-primary focus:ring-1 focus:ring-hub-primary transition-all"
      >
        <span className="truncate">{displayValue}</span>
        <svg
          className="h-5 w-5 text-gray-400 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-100 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-110 w-[90%] max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <style>{customCalendarStyles}</style>

            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">
              Select Appointment
            </h3>

            <div className="flex justify-center">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                disabled={[{ before: today }, { after: twoMonthsFromNow }]}
                startMonth={today}
                endMonth={twoMonthsFromNow}
              />
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6 px-2">
              <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wider font-bold text-gray-400">
                  Time
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {selectedTime}
                </span>
              </div>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="rounded-lg border-gray-300 p-2 text-sm focus:border-hub-primary focus:ring-hub-primary cursor-pointer bg-gray-50"
              />
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-primary w-full mt-6"
            >
              Confirm Selection
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const customCalendarStyles = `
  .rdp-button:focus-visible:not([disabled]) {
    outline: 2px solid #F28C0D !important;
    background-color: white;
  }
  
  .rdp-day_selected, 
  .rdp-day_selected:focus-visible, 
  .rdp-day_selected:hover {
    background-color: #F28C0D !important;
    color: white !important;
    border: none !important;
    outline: none !important;
  }

  .rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
    background-color: #fff7ed !important;
    color: #F28C0D !important;
  }

  .rdp-nav_button:hover {
    color: #F28C0D !important;
  }

  .rdp-day_today {
    color: #C2680C !important;
    font-weight: 800 !important;
    text-decoration: underline !important;
  }

  .rdp {
    --rdp-accent-color: #F28C0D;
    --rdp-background-color: #fff7ed;
    margin: 0;
  }
`;
