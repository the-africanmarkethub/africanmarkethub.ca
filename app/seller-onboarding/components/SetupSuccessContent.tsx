"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import confetti from "canvas-confetti";
import { verifySubscriptionCheckout } from "@/lib/api/seller/shop";

export default function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [countdown, setCountdown] = useState(5);
  const [onboardingUrl, setOnboardingUrl] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Track if they are fully verified (No onboarding needed)
  const [isFullyVerified, setIsFullyVerified] = useState(false);

  const verificationStarted = useRef(false);

  const handleFinalRedirect = useCallback(() => {
    // FORCE Stripe if the URL exists. No exceptions.
    if (onboardingUrl) {
      window.location.href = onboardingUrl;
      return;
    }

    // Only allow dashboard if we explicitly confirmed they don't need onboarding
    if (isFullyVerified) {
      router.replace("/dashboard");
    } else {
      // If something went wrong and we have neither, re-verify
      setStatus("error");
    }
  }, [onboardingUrl, isFullyVerified, router]);

  const verifyPayment = async (id: string) => {
    try {
      setIsRetrying(true);
      const response = await verifySubscriptionCheckout(id);

      if (response.status === "paid") {
        if (response.onboarding_url) {
          // USER MUST ONBOARD
          setOnboardingUrl(response.onboarding_url);
          setIsFullyVerified(false);
        } else {
          // USER IS ALREADY DONE WITH STRIPE
          setOnboardingUrl(null);
          setIsFullyVerified(true);
        }

        setStatus("success");
        triggerConfetti();
      } else {
        setStatus("error");
      }
    } catch (err) {
      setStatus("error");
    } finally {
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    if (sessionId && !verificationStarted.current) {
      verificationStarted.current = true;
      verifyPayment(sessionId);
    }
  }, [sessionId]);

  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === "success" && countdown === 0) {
      handleFinalRedirect();
    }
  }, [status, countdown, handleFinalRedirect]);

  const triggerConfetti = () => {
    const end = Date.now() + 3000;
    const colors = ["#016134", "#00A85A", "#facc15"];
    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };
  return (
    <div className="text-center max-w-lg mx-auto py-8 px-4">
      <CheckCircleIcon className="h-24 w-24 text-hub-primary mx-auto mb-6" />

      <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
        {onboardingUrl ? "Identity Verification" : "Payment Confirmed!"}
      </h1>

      <p className="text-lg text-gray-600 mb-8">
        {onboardingUrl
          ? "To start receiving payouts, you must complete your Stripe setup."
          : "You're all set! Redirecting you to your shop manager."}
      </p>

      <div
        className={`rounded-2xl p-6 mb-8 text-left border ${onboardingUrl ? "bg-blue-50 border-blue-100" : "bg-green-50 border-green-100"}`}
      >
        <h3
          className={`font-bold mb-1 ${onboardingUrl ? "text-blue-700" : "text-hub-secondary"}`}
        >
          {onboardingUrl ? "Step 2: Connect Stripe" : "Finalizing Setup"}
        </h3>
        <p
          className={`text-sm mb-4 ${onboardingUrl ? "text-blue-600" : "text-hub-secondary"}`}
        >
          {onboardingUrl
            ? "You will be redirected to Stripe's secure portal to verify your business details."
            : "Verification complete. We are preparing your dashboard access."}
        </p>

        <div className="flex items-center font-semibold text-sm">
          <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mr-3">
            <div
              className="h-full bg-hub-primary transition-all duration-1000 ease-linear"
              style={{ width: `${(countdown / 5) * 100}%` }}
            ></div>
          </div>
          {countdown}s
        </div>
      </div>

      <button
        onClick={handleFinalRedirect}
        className="w-full flex items-center justify-center bg-gray-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-black transition-all"
      >
        {onboardingUrl ? "Continue to Stripe Verification" : "Enter Dashboard"}
        <ArrowRightIcon className="h-5 w-5 ml-2" />
      </button>
    </div>
  );
}
