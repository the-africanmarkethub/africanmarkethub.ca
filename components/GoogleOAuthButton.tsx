"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useGoogleOAuth } from "@/hooks/useAuth";

interface GoogleOAuthButtonProps {
  text?: string;
  className?: string;
  disabled?: boolean;
}

interface GoogleResponse {
  credential: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: () => void;
          renderButton: (element: HTMLElement, config: any) => void;
        };
        oauth2: {
          initTokenClient: (config: any) => {
            requestAccessToken: () => void;
          };
        };
      };
    };
    googleOAuthCallback?: (response: GoogleResponse) => void;
  }
}

export function GoogleOAuthButton({
  text = "Continue with Google",
  className = "",
  disabled = false,
}: GoogleOAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const router = useRouter();
  const googleOAuth = useGoogleOAuth();

  useEffect(() => {
    // Check if Google is already loaded
    if (window.google) {
      console.log("Google already loaded, initializing...");
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "69494828527-jj605152tfo5ud2h1mqp60gf1r9breso.apps.googleusercontent.com",
        callback: (response: GoogleResponse) => {
          handleGoogleResponse(response);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      setIsGoogleLoaded(true);
      return;
    }

    // Load Google OAuth script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Global callback function
    window.googleOAuthCallback = (response) => {
      handleGoogleResponse(response);
    };

    script.onload = () => {
      console.log("Google script loaded");
      // Small delay to ensure Google APIs are fully loaded
      setTimeout(() => {
        if (window.google) {
          console.log("Initializing Google OAuth");
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "69494828527-jj605152tfo5ud2h1mqp60gf1r9breso.apps.googleusercontent.com",
            callback: window.googleOAuthCallback,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          setIsGoogleLoaded(true);
        }
      }, 100);
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
      window.googleOAuthCallback = undefined;
    };
  }, []);

  const handleGoogleResponse = async (response: GoogleResponse) => {
    setIsLoading(true);
    
    try {
      if (response.credential) {
        console.log("Google credential received:", response.credential.substring(0, 50) + "...");
        const result = await googleOAuth.mutateAsync(response.credential);
        
        if (result.data?.token) {
          toast.success("Successfully signed in with Google!");
          
          // Check if there's a return URL stored (from booking flow)
          const returnUrl = sessionStorage.getItem('oauth_return_url');
          if (returnUrl) {
            sessionStorage.removeItem('oauth_return_url');
            router.push(returnUrl);
          } else {
            // Route based on user role
            if (result.data.user?.role === "customer") {
              router.push("/");
            } else if (result.data.user?.role === "vendor") {
              router.push("/vendor");
            } else {
              router.push("/");
            }
          }
        }
      }
    } catch (error: unknown) {
      console.error("Google OAuth failed:", error);
      
      // Handle API errors
      const apiError = error as any;
      if (apiError?.errors) {
        const apiErrors = apiError.errors;
        Object.keys(apiErrors).forEach(field => {
          const messages = apiErrors[field];
          if (Array.isArray(messages)) {
            messages.forEach((message: string) => {
              toast.error(message);
            });
          } else if (typeof messages === 'string') {
            toast.error(messages);
          }
        });
      } else if (apiError?.message) {
        toast.error(apiError.message);
      } else {
        toast.error("Google sign in failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (window.google && isGoogleLoaded && !isLoading && !disabled) {
      // Use renderButton instead of prompt to avoid FedCM issues
      const buttonContainer = document.createElement('div');
      buttonContainer.style.position = 'fixed';
      buttonContainer.style.top = '-1000px';
      buttonContainer.style.left = '-1000px';
      document.body.appendChild(buttonContainer);
      
      window.google.accounts.id.renderButton(buttonContainer, {
        theme: 'outline',
        size: 'large',
        type: 'standard',
        shape: 'pill',
        text: 'continue_with',
        logo_alignment: 'left'
      });
      
      // Trigger click on the rendered button
      setTimeout(() => {
        const googleButton = buttonContainer.querySelector('[role="button"]');
        if (googleButton) {
          (googleButton as HTMLElement).click();
        }
        document.body.removeChild(buttonContainer);
      }, 100);
    } else {
      if (!window.google || !isGoogleLoaded) {
        toast.error("Google sign-in is still loading. Please try again.");
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading || googleOAuth.isPending}
      className={`w-full border border-gray-200 hover:border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-full transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
    >
      {isLoading || googleOAuth.isPending || !isGoogleLoaded ? (
        <>
          <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>{!isGoogleLoaded ? "Loading..." : "Signing in..."}</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>{text}</span>
        </>
      )}
    </button>
  );
}