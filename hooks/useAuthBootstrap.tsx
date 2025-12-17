"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { getUserProfile } from "@/lib/api/auth/profile";

export function useAuthBootstrap() {
  const { token, _hasHydrated, setAuth, clearAuth } = useAuthStore();
  const ranRef = useRef(false);

  useEffect(() => {
    if (!_hasHydrated || !token || ranRef.current) return;

    ranRef.current = true;

    const bootstrap = async () => {
      try {
        const userData = await getUserProfile();
        if (userData) {
          setAuth(token, userData);
        } else {
          throw new Error("Invalid user data");
        }
      } catch (err) {
        console.error("Session expired or invalid token:", err);
        clearAuth();
      }
    };

    bootstrap();
  }, [_hasHydrated, token, setAuth, clearAuth]);
}
