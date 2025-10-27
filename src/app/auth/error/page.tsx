"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = () => {
    switch (error) {
      case "AccessDenied":
        return {
          title: "Access Denied",
          message:
            "This application is for customers only. If you're a vendor, please use the vendor portal to access your account.",
          action: "Go to Vendor Portal",
          link: "/vendor/sign-in",
        };
      default:
        return {
          title: "Authentication Error",
          message: "There was a problem signing you in. Please try again.",
          action: "Try Again",
          link: "/customer/sign-in",
        };
    }
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-600">
            <svg
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {errorInfo.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
            {errorInfo.message}
          </p>
        </div>
        <div className="space-y-4">
          <Link href={errorInfo.link}>
            <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-[39px]">
              {errorInfo.action}
            </Button>
          </Link>
          <Link href="/customer/sign-in">
            <Button variant="outline" className="w-full rounded-[39px]">
              Back to Customer Sign In
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        </div>
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
