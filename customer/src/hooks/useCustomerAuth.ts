import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getCurrentUser } from "@/services/authService";

/**
 * Hook to ensure only customers can access the application
 * Redirects non-customer users and shows appropriate message
 */
export function useCustomerAuth() {
  const router = useRouter();

  useEffect(() => {
    const checkCustomerRole = async () => {
      try {
        const userData = await getCurrentUser();
        
        if (userData && userData.user?.role && userData.user.role !== "customer") {
          toast.error("Access denied. This application is for customers only.");
          
          // Clear authentication data
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
          
          // Redirect to sign in page
          router.push("/sign-in");
        }
      } catch (error) {
        console.error("Error checking user role:", error);
      }
    };

    checkCustomerRole();
  }, [router]);
}