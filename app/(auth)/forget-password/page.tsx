"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import Link from "next/link";
import { forgetPassword } from "@/lib/api/auth/auth";
import AuthSideBarBanner from "@/app/components/common/AuthSideBarBanner";

type ErrorResponse = {
  message?: string;
  status?: string;
  error_detail?: string;
};

export default function ForgetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("email", email);

    try {
      setLoading(true);
      const result = await forgetPassword({ email });
      sessionStorage.setItem("resetEmail", email);

      toast.success(
        result.message || "Password reset link sent to your email."
      );
      router.replace("/confirm-reset-code");
    } catch (err) {
      const error = err as { response?: { data?: ErrorResponse } };
      const errorDetail =
        error.response?.data?.error_detail ||
        error.response?.data?.message ||
        "Invalide email address. Please try again.";
      toast.error(errorDetail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Column: Image */}
          <AuthSideBarBanner />
    

      <div className="flex items-center justify-center bg-gray-50 p-8 sm:p-12 w-full lg:w-1/2">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div hidden className="mb-8 flex justify-center">
            <Link href="/">
              <Image
                src="/logo.svg"
                alt="African Market Hub"
                width={180}
                height={40}
                style={{ height: "40px" }}
                priority
                unoptimized
              />
            </Link>
          </div>

          <h1 className="text-2xl font-bold mb-6 text-gray-800">
            Forget Password
          </h1>
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-sm space-y-8 text-gray-800"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                Enter your email address
              </label>
              <input
                id="email-address"
                type="email"
                name="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                placeholder="mary.j@example.ca"
                className="input appearance-none"
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <button
                type="submit"
                className={`btn btn-primary w-full ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>

              <button
                type="button"
                className="btn btn-gray w-full "
                onClick={() => router.replace("/login")}
              >
                Back to login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
