"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { ContinueWithGoogle } from "@/lib/api/auth/auth";
import AppleSignInButton from "./AppleSignInButton";
import Script from "next/script";

export default function GoogleSignInButton() {
  const router = useRouter();
  const [isSdkLoaded, setIsSdkLoaded] = useState(false);
  const scriptLoadedRef = useRef(false);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // 1. Use useCallback so this function reference stays stable
  const handleCredentialResponse = useCallback(
    async (response: any) => {
      const idToken = response.credential;
      if (!idToken) {
        toast.error("Google login failed: Missing token.");
        return;
      }

      const payload = {
        id_token: idToken,
        device_name:
          typeof window !== "undefined" ? navigator.userAgent : "unknown",
      };

      try { 
        const result = await ContinueWithGoogle(payload);
 
        useAuthStore.getState().setAuth(result.token, result.user);
 
        document.cookie = `token=${result.token}; path=/; SameSite=Lax; Secure`;
        document.cookie = `role=${result.user.role}; path=/; SameSite=Lax; Secure`;

        toast.success("Welcome Back");

        // Role-based redirect
        if (result.user.role === "customer") {
          router.push("/account");
        } else if (result.user.role === "vendor") {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Auth Error:", error);
        toast.error("Login failed. Please try again.");
      }
    },
    [router]
  );

  useEffect(() => {
    const initializeGsi = () => {
      const google = (window as any).google;
      if (!google?.accounts?.id || !clientId) return;

      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
        ux_mode: "popup", // Explicitly set the mode
        use_fedcm_for_prompt: false, // <--- Add this line
        auto_select: false,
        cancel_on_tap_outside: true,
        itp_support: true, // Helps with Safari/Intelligent Tracking Protection
      });

      google.accounts.id.renderButton(document.getElementById("g_id_signin"), {
        theme: "filled_blue",
        size: "large",
        shape: "pill",
        width: "300", // Standardized production width
        logo_alignment: "left",
        text: "continue_with",
      });
      setIsSdkLoaded(true);
    };

    // 4. Handle script loading for Next.js hydration
    if ((window as any).google?.accounts?.id) {
      initializeGsi();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGsi;
      document.head.appendChild(script);
    }
  }, [clientId, handleCredentialResponse]);

  const handleCustomClick = () => {
    (window as any).google?.accounts?.id.prompt();
  };

  return (
    <>
      {/* <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={initializeGsi}
      /> */}
      <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border border-gray-100 gap-4">
        <button
          onClick={handleCustomClick}
          className="cursor-pointer flex items-center justify-center w-75 h-11 bg-white border border-gray-300 text-gray-700 rounded-full font-medium hover:bg-gray-50 transition-all shadow-sm"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          Continue with Google
        </button>

        <AppleSignInButton />
      </div>
    </>
  );
}
