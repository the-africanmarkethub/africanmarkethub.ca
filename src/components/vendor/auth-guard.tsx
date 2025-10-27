"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/vendor/auth-context";
import { useRouter, usePathname } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setIsChecking(false);
      if (!isAuthenticated) {
        // Store the attempted URL for redirect after login
        if (pathname !== "/") {
          localStorage.setItem("redirectUrl", pathname);
        }
        router.push("/");
      }
    }
  }, [isAuthenticated, isLoading, router, pathname, user]);

  // Show loading while checking auth
  if (isLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Verifying authentication...
          </p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
