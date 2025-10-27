"use client";

import { useEffect } from "react";
import { clearAuthData } from "@/utils/auth-utils";

export function AuthChecker() {
  useEffect(() => {
    // Clear any stale auth data when landing on the login page
    // This ensures users can't bypass auth by having old tokens
    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");

    if (token || user) {
      clearAuthData();
    }
  }, []);

  return null;
}
