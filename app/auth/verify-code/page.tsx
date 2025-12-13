"use client";

import { Suspense } from "react";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyCodeContent() {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(150); // 2:30 in seconds
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInputChange = (value: string, index: number) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all digits entered
    if (newCode.every((digit) => digit !== "")) {
      handleVerify(newCode.join(""));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6).split("");

    const newCode = [...code];
    digits.forEach((digit, idx) => {
      if (idx < 6) newCode[idx] = digit;
    });
    setCode(newCode);

    // Focus last filled input or last input
    const lastFilledIndex = Math.min(digits.length - 1, 5);
    inputRefs.current[lastFilledIndex]?.focus();

    if (newCode.every((digit) => digit !== "")) {
      handleVerify(newCode.join(""));
    }
  };

  const handleVerify = async (verificationCode: string) => {
    setIsVerifying(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Verifying:", verificationCode);
      setIsVerifying(false);
      // Navigate to reset password page with email
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    }, 1500);
  };

  const handleResendCode = () => {
    setTimeLeft(150); // Reset timer
    // API call to resend code would go here
    console.log("Resending code to:", email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (verificationCode.length === 6) {
      handleVerify(verificationCode);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Verify Code</h2>
        <p className="mt-2 text-gray-600">
          We've sent a verification code to {email || "your email"}
        </p>
      </div>

      {/* Code Input */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center space-x-2">
          {code.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#F28C0D] focus:outline-none transition-colors"
              disabled={isVerifying}
            />
          ))}
        </div>

        {/* Timer and Resend */}
        <div className="text-center">
          {timeLeft > 0 ? (
            <p className="text-gray-600">
              Resend code in{" "}
              <span className="font-semibold text-[#F28C0D]">
                {formatTime(timeLeft)}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResendCode}
              className="text-[#F28C0D] hover:text-orange-600 font-medium transition-colors"
              disabled={isVerifying}
            >
              Resend Code
            </button>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isVerifying || code.some((d) => !d)}
          className="w-full bg-[#F28C0D] hover:bg-orange-600 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#F28C0D] focus:ring-offset-2"
        >
          {isVerifying ? "Verifying..." : "Verify Code"}
        </button>
      </form>

      {/* Back Link */}
      <div className="text-center">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
        >
          ← Back to previous page
        </button>
      </div>
    </div>
  );
}

export default function VerifyCodePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D]"></div>
      </div>
    }>
      <VerifyCodeContent />
    </Suspense>
  );
}