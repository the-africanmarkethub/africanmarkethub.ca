"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import confetti from "canvas-confetti";
import { useAuthStore } from "@/store/useAuthStore";
import {
  retryOnboardingStatus,
  verifyOnboardingStatus, 
} from "@/lib/api/seller/shop";

export default function OnboardingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Only read session_id on client
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    setSessionId(searchParams.get("session_id"));
  }, [searchParams]);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [countdown, setCountdown] = useState(5);

  const { clearAuth } = useAuthStore();

  // Verify Stripe payment
  useEffect(() => {
    // Wait until searchParams loads
    if (sessionId === null) return;

    // If loaded but empty → invalid
    if (!sessionId) {
      setStatus("error");
      return;
    }

    const verifyPayment = async () => {
      try {
        const response = await verifyOnboardingStatus(sessionId);
        if (response.data.completed === true) {
          setStatus("success");
          triggerConfetti();
        } else {
          setStatus("error");
        }
      } catch (err) {
        console.error("Verification failed", err);
        setStatus("error");
      }
    };

    verifyPayment();
  }, [sessionId, clearAuth]);

  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === "success" && countdown === 0) {
      router.push("/dashboard");
    }
  }, [status, countdown, router]);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#ea580c", "#fb923c"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#ea580c", "#fb923c"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetryButton = async () => {
    setIsRetrying(true);
    try {
      // This calls your Laravel endpoint verifyCheckoutSubscriptionSession
      const response = await retryOnboardingStatus();

      // Note: Ensure your Laravel backend returns 'paid' or 'success'
      if (response.onboarding_url) {
        // Redirect to Stripe Connect Onboarding immediately
        window.location.href = response.onboarding_url;
      } else {
        setStatus("error");
        setIsRetrying(false);
      }
    } catch (err) {
      console.error("Verification failed", err);
      setStatus("error");
      setIsRetrying(false);
    }
  };
  if (status === "loading") {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">
          Finalizing your shop setup...
        </h2>
        <p className="text-gray-500 mt-2">
          Please wait while we confirm your Pay account on stripe.
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="text-center">
        <XCircleIcon className="h-20 w-20 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-gray-600 mb-6">
          We couldn't verify your session. You can try refreshing the session
          below.
        </p>

        <button
          onClick={handleRetryButton}
          disabled={isRetrying}
          className="inline-flex items-center px-6 py-2 bg-hub-secondary text-white font-medium rounded-md hover:bg-yellow-600 transition-colors disabled:opacity-50"
        >
          {isRetrying ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Retrying...
            </>
          ) : (
            "Retry Onboarding"
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="text-center max-w-md mx-auto">
      <div className="mb-6 relative">
        <div className="absolute inset-0 bg-green-100 rounded-full scale-150 opacity-20 animate-pulse"></div>
        <CheckCircleIcon className="h-24 w-24 text-green-500 mx-auto relative z-10" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">You're all set!</h1>
      <p className="text-gray-600 mb-8">
        Your payout action is activated and your shop now ready for business.
      </p>

      <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-8">
        <p className="text-sm text-yellow-800 font-medium">
          Redirecting to your dashboard in {countdown}s...
        </p>
      </div>

      <button
        onClick={() => router.push("/dashboard")}
        className="w-full flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg"
      >
        Go to Dashboard Now
        <ArrowRightIcon className="h-5 w-5 ml-2" />
      </button>
    </div>
  );
}
