"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getCurrentUser } from "@/services/authService";

interface CustomerProtectionProps {
  children: React.ReactNode;
}

/**
 * Component that protects routes to ensure only customers can access them
 * Wraps children and redirects non-customer users
 */
export default function CustomerProtection({ children }: CustomerProtectionProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkCustomerRole = async () => {
      try {
        const userData = await getCurrentUser();
        
        if (!userData) {
          // No user data, allow (let other auth checks handle this)
          setIsAuthorized(true);
          return;
        }

        const userRole = userData.user?.role;
        
        if (userRole && userRole !== "customer") {
          toast.error("Access denied. This application is for customers only.");
          
          // Clear authentication data
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
          
          // Redirect to sign in page
          router.push("/sign-in");
          setIsAuthorized(false);
        } else {
          setIsAuthorized(true);
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        setIsAuthorized(true); // Allow on error to prevent blocking
      }
    };

    checkCustomerRole();
  }, [router]);

  // Show loading or nothing while checking
  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Verifying access...</div>
      </div>
    );
  }

  // Don't render children if not authorized
  if (isAuthorized === false) {
    return null;
  }

  return <>{children}</>;
}