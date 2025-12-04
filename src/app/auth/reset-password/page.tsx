"use client";

import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPassword } from "@/hooks/useAuth";
import { PasswordInput } from "@/components/PasswordInput";

function ResetPasswordContent() {
  const [formData, setFormData] = useState({
    email: "",
    new_password: "",
    confirmPassword: "",
    confirmation_code: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPassword = useResetPassword();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(""); // Clear error when user types
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.new_password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.new_password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    resetPassword.mutate({
      email: formData.email,
      new_password: formData.new_password,
      confirmation_code: formData.confirmation_code,
    }, {
      onSuccess: () => {
        router.push("/auth/login?message=Password reset successful");
      },
      onError: () => {
        setError("Password reset failed. Please check your confirmation code.");
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="confirmation_code"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirmation Code
          </label>
          <input
            id="confirmation_code"
            name="confirmation_code"
            type="text"
            required
            value={formData.confirmation_code}
            onChange={handleInputChange}
            placeholder="Enter confirmation code"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors"
          />
        </div>

        <div>
          <label
            htmlFor="new_password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password
          </label>
          <PasswordInput
            id="new_password"
            name="new_password"
            value={formData.new_password}
            onChange={(value) => handleInputChange({ target: { name: 'new_password', value } } as React.ChangeEvent<HTMLInputElement>)}
            placeholder="New Password"
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors"
            required
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <PasswordInput
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(value) => handleInputChange({ target: { name: 'confirmPassword', value } } as React.ChangeEvent<HTMLInputElement>)}
            placeholder="Confirm Password"
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#F28C0D] focus:border-transparent outline-none transition-colors"
            required
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={resetPassword.isPending}
          className="w-full bg-[#F28C0D] hover:bg-orange-400 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#F28C0D] focus:ring-offset-2"
        >
          {resetPassword.isPending ? "Resetting Password..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F28C0D]"></div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}