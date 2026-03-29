"use client";

import { useState } from "react";
import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import GoogleSignInButton from "@/app/components/common/GoogleSignInButton";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { loginUser } from "@/lib/api/auth/auth";
import AuthSideBarBanner from "@/app/components/common/AuthSideBarBanner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const device_name =
        typeof window !== "undefined" ? navigator.userAgent : "web";

      const result = await loginUser({ email, password, device_name });

      useAuthStore.getState().setAuth(result.token, result.user);

      const cookieConfig = "path=/; SameSite=Lax; Secure";
      document.cookie = `token=${result.token}; ${cookieConfig}`;
      document.cookie = `role=${result.user.role}; ${cookieConfig}`;

      const { role } = result.user;
      const hasShop = !!result.hasShop;

      if (role === "customer") {
        toast.success("Welcome Back");
        router.replace("/account");
      } else if (role === "vendor") {
        if (hasShop) {
          toast.success("Welcome Back");
          router.replace("/dashboard");
        } else {
          toast.success("Setup your shop to continue");
          router.replace("/seller-onboarding");
        }
      } else {
        router.replace("/");
      }
    } catch (error) {
      let message = "Login failed. Please try again.";

      if (error instanceof AxiosError) {
        const responseData = error.response?.data;

        if (
          error.response?.status === 403 &&
          responseData?.code === "EMAIL_UNVERIFIED"
        ) {
          toast.error(responseData.message || "Email not verified");

          router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
          return;
        }

        if (error.response?.status === 422 && responseData?.errors) {
          message = Object.values(responseData.errors).flat().join(" ");
        }
        else if (responseData?.message) {
          message = responseData.message;
        }
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Column: Branding Image */}

      <AuthSideBarBanner />

      {/* Right Column: Auth UI */}
      <div className="flex items-center justify-center w-full p-8 bg-gray-50 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-gray-500">
              Please enter your details to sign in
            </p>
          </div>

          {/* Fancy Google Button Component */}
          <div className="mb-8">
            <GoogleSignInButton />
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-gray-500 bg-gray-50">
                or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 text-gray-700">
            <div>
              <label className="block text-sm font-semibold mb-1.5">
                Email Address
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
                className="appearance-none input"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold mb-1.5 text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="transition-all outline-none input"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  className="absolute p-1 text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="mt-2 text-right">
                <Link
                  href="/forget-password"
                  className="text-sm font-medium transition-colors text-hub-primary hover:text-hub-secondary"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            <div className="pt-2 space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center w-full transition-all btn btn-primary h-11 disabled:opacity-70"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 rounded-full border-white/30 border-t-white animate-spin"></span>
                    Logging in...
                  </span>
                ) : (
                  "Log in"
                )}
              </button>

              <button
                type="button"
                onClick={() => router.push("/register")}
                className="w-full text-gray-700 transition-colors bg-white border border-gray-300 btn btn-gray h-11 hover:bg-gray-50"
              >
                Create an account
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
