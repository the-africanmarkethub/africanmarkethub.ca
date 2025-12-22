"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasAccepted = localStorage.getItem("cookie_consent");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 duration-500">
      <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-md border border-white/20 shadow-xl rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1">
          <p className="text-gray-800 text-xs font-medium">
            We use cookies to improve your experience.{" "}
            <Link href="/privacy-policy" className="text-orange-800 underline">
              Learn more
            </Link>
          </p>
        </div>

        <button
          onClick={acceptCookies}
          className="whitespace-nowrap bg-black text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all active:scale-95 cursor-pointer"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
