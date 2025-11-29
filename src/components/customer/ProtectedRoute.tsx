"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallbackUrl?: string;
}

export function ProtectedRoute({ children, fallbackUrl }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && status !== "loading" && !session) {
      signIn("google", {
        callbackUrl: fallbackUrl || window.location.href
      });
    }
  }, [session, status, mounted, fallbackUrl]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Redirecting to sign in...</div>
      </div>
    );
  }

  return <>{children}</>;
}