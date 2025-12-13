"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast from 'react-hot-toast';
import { useLogin } from "@/hooks/useAuth";
import { PasswordInput } from "@/components/PasswordInput";
import { GoogleOAuthButton } from "@/components/GoogleOAuthButton";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();
  
  const returnUrl = searchParams.get('returnUrl');
  const authType = searchParams.get('authType');
  const isFromBooking = authType === 'google' && returnUrl?.includes('/chat');

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('auth_token');
    if (token && returnUrl) {
      router.push(returnUrl);
    }
  }, [returnUrl, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login.mutate(
      {
        email,
        password,
      },
      {
        onSuccess: (data) => {
          // Handle success response: {message: "Login successful.", token: "...", user: {...}}
          if (data.message) {
            toast.success(data.message);
          } else {
            toast.success('Login successful!');
          }
          
          // Store token and user data
          if (data.token) {
            localStorage.setItem("auth_token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
          }
          
          // Check if there's a return URL (from booking flow)
          if (returnUrl) {
            router.push(returnUrl);
          } else {
            // Route based on user role
            if (data.user?.role === "customer") {
              router.push("/");
            } else if (data.user?.role === "vendor") {
              router.push("/vendor");
            } else {
              router.push("/");
            }
          }
        },
        onError: (error: any) => {
          console.error('Login failed:', error);
          
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
            toast.error('Login failed. Please check your credentials.');
          }
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Show special message for booking flow */}
      {isFromBooking && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-orange-800">
            Please sign in to continue with your booking and chat with the vendor.
          </p>
        </div>
      )}

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          {isFromBooking ? "Sign in to Continue Booking" : "Welcome Back"}
        </h2>
        <p className="mt-2 text-gray-600">
          {isFromBooking 
            ? "Sign in with Google to quickly connect with the vendor" 
            : "Enter your details to access your account"}
        </p>
      </div>

      {/* Google OAuth Button - Show prominently for booking flow */}
      {isFromBooking && (
        <>
          <GoogleOAuthButtonWithReturn returnUrl={returnUrl} />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign in with email</span>
            </div>
          </div>
        </>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <PasswordInput
            id="password"
            name="password"
            value={password}
            onChange={(value) => setPassword(value)}
            placeholder="Password"
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="h-4 w-4 text-[#F28C0D] focus:ring-[#F28C0D] border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Remember me</span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-sm text-[#F28C0D] hover:text-orange-600"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full bg-[#F28C0D] hover:bg-orange-400 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#F28C0D] focus:ring-offset-2"
        >
          {login.isPending ? "Signing in..." : "Sign in"}
        </button>

        {login.isError && (
          <div className="text-red-600 text-sm text-center">
            Login failed. Please try again.
          </div>
        )}
      </form>

      {/* Show Google OAuth at bottom for regular login */}
      {!isFromBooking && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or</span>
            </div>
          </div>

          <GoogleOAuthButtonWithReturn returnUrl={returnUrl} />
        </>
      )}

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <Link
          href={returnUrl ? `/auth/register?returnUrl=${encodeURIComponent(returnUrl)}` : "/auth/register"}
          className="font-medium text-[#F28C0D] hover:text-orange-600"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}

// Wrapper component for GoogleOAuthButton that handles returnUrl
function GoogleOAuthButtonWithReturn({ returnUrl }: { returnUrl: string | null }) {
  const router = useRouter();
  
  // Store returnUrl in sessionStorage before OAuth
  useEffect(() => {
    if (returnUrl) {
      sessionStorage.setItem('oauth_return_url', returnUrl);
    }
  }, [returnUrl]);

  return <GoogleOAuthButton />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D]"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}