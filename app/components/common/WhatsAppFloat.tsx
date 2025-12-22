"use client";

import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsAppFloat = () => {
  const phoneNumber = "447389199608"; 
  const message = "Hello! I'd like to inquire about your items.";

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center 
                 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg 
                 hover:bg-[#128C7E] transition-all duration-300 hover:scale-110 
                 active:scale-95 sm:w-16 sm:h-16"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="w-8 h-8 sm:w-9 sm:h-9" />

      {/* Optional: Notification Ping Animation */}
      <span className="absolute top-0 right-0 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
      </span>
    </a>
  );
};

export default WhatsAppFloat;
