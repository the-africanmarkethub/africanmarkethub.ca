"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuthGuard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("auth_token");
      const userData = localStorage.getItem("user");

      if (!token) {
        setIsAuthenticated(false);
        router.push("/auth/login");
        return;
      }

      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to parse user data:", error);
          setIsAuthenticated(false);
          router.push("/auth/login");
        }
      } else {
        setIsAuthenticated(false);
        router.push("/auth/login");
      }
    };

    checkAuth();
  }, [router]);

  return { isAuthenticated, user };
}