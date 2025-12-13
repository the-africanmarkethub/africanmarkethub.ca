"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export function useLogout() {
  const router = useRouter();

  const logout = () => {
    try {
      // Clear authentication data
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      
      // Show success message
      toast.success("Logged out successfully");
      
      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return { logout };
}