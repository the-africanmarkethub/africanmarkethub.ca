"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from 'react-hot-toast';
import { useVerifyEmail } from "@/hooks/useAuth";

function VerifyEmailContent() {
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(150); // 2:30 countdown
  const router = useRouter();
  const searchParams = useSearchParams();
  const verifyEmail = useVerifyEmail();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtpDigits = [...otpDigits];
      newOtpDigits[index] = value;
      setOtpDigits(newOtpDigits);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otp = otpDigits.join('');
    
    if (otp.length !== 6) {
      return;
    }
    
    verifyEmail.mutate({
      email,
      otp
    }, {
      onSuccess: (data) => {
        // Handle success response: {message: "Email verified successfully", status: "success"}
        if (data.message) {
          toast.success(data.message);
        } else {
          toast.success('Email verified successfully!');
        }
        router.push('/auth/login');
      },
      onError: (error: any) => {
        console.error('Verification failed:', error);
        
        // Handle API errors
        if (error?.errors) {
          const apiErrors = error.errors;
          Object.keys(apiErrors).forEach(field => {
            const messages = apiErrors[field];
            if (Array.isArray(messages)) {
              messages.forEach((message: string) => {
                toast.error(message);
              });
            } else if (typeof messages === 'string') {
              toast.error(messages);
            }
          });
        } else if (error?.message) {
          toast.error(error.message);
        } else {
          toast.error('Verification failed. Please try again.');
        }
      }
    });
  };

  const handleResendCode = () => {
    setCountdown(150); // Reset countdown
    // Add resend logic here if needed
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Enter Verification Code</h2>
        <p className="mt-4 text-gray-600">
          We have sent a 6-digit to {email}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 6-digit OTP inputs */}
        <div className="flex justify-center space-x-3">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-medium border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-[#F28C0D] outline-none transition-colors"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={verifyEmail.isPending || otpDigits.join('').length !== 6}
          className="w-full bg-[#F28C0D] hover:bg-orange-400 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#F28C0D] focus:ring-offset-2"
        >
          {verifyEmail.isPending ? "Verifying..." : "Verify"}
        </button>
        
        {verifyEmail.isError && (
          <div className="text-red-600 text-sm text-center">
            Verification failed. Please try again.
          </div>
        )}
      </form>

      {/* Resend section */}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-600">
          Haven't received code?{" "}
          {countdown > 0 ? (
            <span className="text-gray-500">
              Resend in {formatTime(countdown)}
            </span>
          ) : (
            <button
              onClick={handleResendCode}
              className="text-[#F28C0D] hover:underline font-medium"
            >
              Resend Code
            </button>
          )}
        </p>
        {countdown > 0 && (
          <p className="text-xs text-gray-500">{formatTime(countdown)}</p>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D]"></div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}