"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/**
 * Handles Google OAuth flow and calls /continue-with-google on client-side
 */
export function AuthSyncProvider() {
  const { data: session, status } = useSession();
  const [processedToken, setProcessedToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || status === "loading") return;

    // Check if we have a Google ID token that we haven't processed yet
    const googleIdToken = (session as any)?.googleIdToken;

    if (googleIdToken && googleIdToken !== processedToken) {
      // Call /continue-with-google API
      const continueWithGoogle = async () => {
        try {
          const formData = new FormData();
          formData.append("id_token", googleIdToken);
          formData.append("device_name", "web-browser");
          formData.append("ip_address", "127.0.0.1");

          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/continue-with-google`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (response.ok) {
            const data = await response.json();
            // Store in localStorage (same as normal login)
            localStorage.setItem("accessToken", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
          }
        } catch (error) {
          // Silent fail - authentication errors are handled by the auth system
        }
      };

      continueWithGoogle();
      setProcessedToken(googleIdToken); // Mark as processed
    }
  }, [session, status, processedToken]);

  return null; // This component doesn't render anything
}
