"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";

interface User {
  message?: string;
  token: string;
  user: {
    id: number;
    name: string;
    last_name: string;
    phone: string;
    email: string;
    role: string;
    is_active: number;
    city: string;
    state: string;
    country: string;
    referral_code: string;
    referred_by: string | null;
    profile_photo: string;
    google_id: string | null;
    fcm_token: string | null;
    email_verified_at: string;
    phone_verified_at: string;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  };
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
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
  "/email-verification",
  "/verify-otp",
  "/create-shop",
  "/vendor/sign-in",
  "/vendor/sign-up",
  "/vendor/forgot-password",
  "/vendor/reset-password",
  "/vendor/email-verification",
  "/vendor/verify-otp",
  "/vendor/create-shop"
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const login = useCallback((token: string, userData: User) => {
    console.log("Vendor AuthProvider login called with:", { token, userData });
    console.log("User role is:", userData.user?.role);
    
    // Check if user role is vendor
    if (userData.user?.role !== "vendor") {
      console.log("BLOCKING: Non-vendor attempting to login to vendor platform:", userData.user?.role);
      toast.error("Access denied. This platform is for vendors only.");
      // Don't save anything to localStorage or set user state
      return; // Just return instead of throw to avoid complications
    }
    
    console.log("ALLOWING: Vendor login proceeding");
    if (typeof window !== "undefined") {
      localStorage.setItem("vendorAccessToken", token);
      localStorage.setItem("vendorUser", JSON.stringify(userData));
      
      // Verify it was saved
      console.log("Saved to localStorage - vendorAccessToken:", localStorage.getItem("vendorAccessToken"));
      console.log("Saved to localStorage - vendorUser:", localStorage.getItem("vendorUser"));
    }
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("vendorAccessToken");
    localStorage.removeItem("vendorUser");
    localStorage.removeItem("vendorRefreshToken");
    setUser(null);
    router.push("/");
    toast.success("Logged out successfully");
  }, [router]);

  const checkAuth = useCallback(async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem("vendorAccessToken");
      const storedUser = localStorage.getItem("vendorUser");
      
      if (!token || !storedUser) {
        setUser(null);
        return false;
      }

      // Parse and validate user data
      try {
        const userData = JSON.parse(storedUser);
        // Basic validation - ensure required fields exist
        if (!userData.user?.id || !userData.user?.email) {
          throw new Error("Invalid user data");
        }
        setUser(userData);
        return true;
      } catch (parseError) {
        // Invalid user data, clear storage
        localStorage.removeItem("vendorAccessToken");
        localStorage.removeItem("vendorUser");
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
      // Only apply vendor auth logic to vendor routes
      const isVendorRoute = pathname.startsWith("/vendor");
      const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
      const isCustomerRoute = pathname.startsWith("/customer");
      const isAuthRoute = pathname.startsWith("/verify-otp") || 
                         pathname.startsWith("/email-verification") ||
                         pathname.startsWith("/forgot-password") ||
                         pathname.startsWith("/reset-password") ||
                         pathname.startsWith("/create-shop");

      // Check if customer is trying to access vendor routes FIRST, before any loading
      if (isVendorRoute && !isPublicRoute && !isAuthRoute) {
        const customerToken = localStorage.getItem("accessToken");
        const customerUser = localStorage.getItem("user");
        
        if (customerToken && customerUser) {
          try {
            const userData = JSON.parse(customerUser);
            if (userData.user?.role === "customer") {
              console.log("Customer detected trying to access vendor route, blocking access");
              router.replace("/customer");
              return;
            }
          } catch (error) {
            console.error("Error parsing customer data:", error);
          }
        }
      }

      setIsLoading(true);
      const isValid = await checkAuth();

      console.log("Vendor AuthProvider check:", {
        pathname,
        isVendorRoute,
        isValid,
        isPublicRoute,
        isAuthRoute,
        userRole: user?.user?.role
      });

      // If user is a vendor and authenticated
      if (isValid && user?.user?.role === "vendor") {
        // If vendor is trying to access non-vendor routes (but not customer routes), redirect to vendor dashboard
        if (!isVendorRoute && !isPublicRoute && !isCustomerRoute) {
          console.log("Vendor trying to access non-vendor route, redirecting to vendor overview");
          router.push("/vendor/overview");
          return;
        }
      }
      
      // Only redirect if it's a vendor route and user is not authenticated
      // BUT allow create-shop for customers who want to become vendors
      const isCreateShop = pathname.includes("/create-shop");
      if (isVendorRoute && !isValid && !isPublicRoute && !isAuthRoute && !isCreateShop) {
        console.log("Redirecting to vendor sign-in");
        router.push("/vendor/sign-in");
      }
      
      // Don't interfere with customer routes - let customer auth context handle them
      if (isCustomerRoute) {
        setIsLoading(false);
        return;
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