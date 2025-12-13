"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const forgotPassword = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    forgotPassword.mutate({
      email
    }, {
      onSuccess: () => {
        toast.success("Reset code sent successfully!");
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      },
      onError: (error: any) => {
        if (error?.errors?.email) {
          const emailErrors = error.errors.email;
          if (Array.isArray(emailErrors)) {
            emailErrors.forEach((msg: string) => toast.error(msg));
          } else if (typeof emailErrors === 'string') {
            toast.error(emailErrors);
          }
        } else if (error?.message) {
          toast.error(error.message);
        } else {
          toast.error("Failed to send reset code. Please try again.");
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
        <p className="mt-4 text-gray-600">
          Enter the email address or mobile phone number associated with your
          African Market Hub account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your Email Address"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={forgotPassword.isPending}
          className="w-full bg-[#F28C0D] hover:bg-orange-400 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#F28C0D] focus:ring-offset-2"
        >
          {forgotPassword.isPending ? "Sending Code..." : "Send Code"}
        </button>
      </form>

      <div className="text-center space-y-2">
        <div className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-[#F28C0D] hover:text-orange-400 font-medium"
          >
            Create Account
          </Link>
        </div>
        <div className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-[#F28C0D] hover:text-orange-400 font-medium"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
