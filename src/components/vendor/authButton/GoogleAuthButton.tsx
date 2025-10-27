"use client";

import React, { useEffect } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const GoogleAuthButton = () => {
  // const { data: session } = useSession();
  // const router = useRouter();

  // useEffect(() => {
  //   if (session && (session as any).userRole && (session as any).accessToken) {
  //     const userRole = (session as any).userRole;
  //     const accessToken = (session as any).accessToken;
  //     const userData = (session as any).userData;

  //     console.log("Vendor portal - User authenticated with role:", userRole);

  //     // Store data in localStorage
  //     try {
  //       localStorage.setItem("vendorAccessToken", accessToken);
  //       localStorage.setItem("user", JSON.stringify(userData));
  //     } catch (error) {
  //       console.warn("Could not store in localStorage:", error);
  //     }

  //     if (userRole === "customer") {
  //       // Redirect customers to customer portal
  //       console.log("Redirecting customer to customer portal");
  //       window.location.href = "/customer";
  //     } else if (userRole === "vendor") {
  //       // Redirect vendors to vendor home
  //       console.log("Redirecting vendor to vendor portal");
  //       window.location.href = "/vendor/overview";
  //     }
  //   }
  // }, [session, router]);

  const handleGoogleSignIn = () => {
    signIn("google", {
      callbackUrl: "/vendor/overview", // Default callback for vendors
      prompt: "select_account", // Force Google to show account selection
    });
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      type="button"
      className="w-full flex items-center gap-[6px] rounded-[32px] text-sm md:text-base font-semibold h-11 md:h-14 border-[1px] border-[#9C5432] text-[#292929] bg-[#FFFFFF] hover:bg-[#F7F7F7] active:bg-[#F7F7F7]"
    >
      <Image
        src="/assets/icons/Google Devicon.svg"
        width={24}
        height={24}
        alt="google"
      />{" "}
      Google
    </Button>
  );
};

export default GoogleAuthButton;
