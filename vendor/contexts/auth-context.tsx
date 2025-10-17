"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  name: string;
  shopId?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const PUBLIC_ROUTES = [
  "/",
  "/forgot-password",
  "/reset-password",
  "/email-verification",
  "/verify-otp",
  "/create-shop"
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/");
    toast.success("Logged out successfully");
  }, [router]);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");
      
      if (!token || !storedUser) {
        setUser(null);
        return false;
      }

      // Parse and validate user data
      try {
        const userData = JSON.parse(storedUser);
        // Basic validation - ensure required fields exist
        if (!userData.id || !userData.email) {
          throw new Error("Invalid user data");
        }
        setUser(userData);
        return true;
      } catch (parseError) {
        // Invalid user data, clear storage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        setUser(null);
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      return false;
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const isValid = await checkAuth();
      
      // Redirect logic
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
      const isAuthRoute = pathname.startsWith("/verify-otp") || 
                         pathname.startsWith("/email-verification") ||
                         pathname.startsWith("/forgot-password") ||
                         pathname.startsWith("/reset-password") ||
                         pathname.startsWith("/create-shop");

      if (!isValid && !isPublicRoute && !isAuthRoute) {
        router.push("/");
      } else if (isValid && pathname === "/") {
        router.push("/overview");
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, [pathname, router, checkAuth]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Higher-order component for protecting routes
export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.push("/");
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null;
    }

    return <Component {...props} />;
  };
}