import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Unified logout hook that handles all cleanup operations
 * Ensures consistent logout behavior across the entire application
 */
export function useLogout() {
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    try {
      // 1. Clear all authentication tokens and user data from localStorage
      const localStorageKeys = [
        "accessToken",
        "refreshToken",
        "user",
        "userProfile",
        // "cart",
        "wishlist",
      ];

      localStorageKeys.forEach((key) => {
        localStorage.removeItem(key);
      });

      // 2. Clear session storage data
      const sessionStorageKeys = [
        "email",
        "phoneNumber",
        "tempAuth",
        "verificationData",
      ];

      sessionStorageKeys.forEach((key) => {
        sessionStorage.removeItem(key);
      });

      // 3. Clear all React Query cached data
      // This ensures no stale user data remains in memory
      console.log("Clearing React Query cache...");
      await queryClient.cancelQueries(); // Cancel any ongoing queries
      await queryClient.invalidateQueries(); // Invalidate all queries
      queryClient.clear(); // Clear the entire cache
      console.log("React Query cache cleared");

      // 4. Optional: Call backend logout endpoint if needed
      // This would handle server-side session cleanup
      try {
        // If you have a logout endpoint, uncomment this:
        // await APICall("/logout", "POST");
      } catch (error) {
        // Silent fail - user will still be logged out locally
        console.error("Server logout failed:", error);
      }

      // 5. Reset any global state (if using context or zustand)
      // Add any global state reset logic here if needed

      // 6. Redirect to sign-in page
      // Using window.location.href for a full page refresh
      // This ensures all React state is completely reset
      window.location.href = "/sign-in";
    } catch (error) {
      console.error("Logout error:", error);
      // Even if there's an error, still redirect to sign-in
      window.location.href = "/sign-in";
    }
  }, [queryClient]);

  return { logout };
}

/**
 * Utility function for direct logout without hook
 * Useful for non-component contexts like API interceptors
 */
export async function performLogout() {
  // Clear all authentication tokens and user data from localStorage
  const localStorageKeys = [
    "accessToken",
    "refreshToken",
    "user",
    "userProfile",
    "cart",
    "wishlist",
  ];

  localStorageKeys.forEach((key) => {
    localStorage.removeItem(key);
  });

  // Clear session storage data
  const sessionStorageKeys = [
    "email",
    "phoneNumber",
    "tempAuth",
    "verificationData",
  ];

  sessionStorageKeys.forEach((key) => {
    sessionStorage.removeItem(key);
  });

  // Redirect to sign-in page with full refresh
  window.location.href = "/sign-in";
}
