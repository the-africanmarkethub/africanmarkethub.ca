"use client";

import AuthFlowComponent from "@/components/vendor/AuthFlowComponent";
import SignInForm from "@/components/vendor/forms/SignInForm";
import { AuthChecker } from "@/components/vendor/auth-checker";
import { useEffect } from "react";

export default function VendorSignInPage() {
  // useEffect(() => {
  //   // Clear any conflicting auth data on the vendor sign-in page to prevent auto-redirects
  //   const userData = localStorage.getItem("user");
  //   const vendorUserData = localStorage.getItem("vendorUser");

  //   if (userData) {
  //     try {
  //       const user = JSON.parse(userData);
  //       // If stored user is not a vendor, clear the customer data
  //       if (user?.user?.role && user.user.role !== "vendor") {
  //         localStorage.removeItem("user");
  //         localStorage.removeItem("accessToken");
  //       }
  //     } catch {
  //       // Invalid data, clear it
  //       localStorage.removeItem("user");
  //       localStorage.removeItem("accessToken");
  //     }
  //   }

  //   if (vendorUserData) {
  //     try {
  //       const vendorUser = JSON.parse(vendorUserData);
  //       // If stored vendor user is not a vendor, clear the vendor data
  //       if (vendorUser?.user?.role && vendorUser.user.role !== "vendor") {
  //         localStorage.removeItem("vendorUser");
  //         localStorage.removeItem("vendorAccessToken");
  //       }
  //     } catch {
  //       // Invalid data, clear it
  //       localStorage.removeItem("vendorUser");
  //       localStorage.removeItem("vendorAccessToken");
  //     }
  //   }
  // }, []);

  return (
    <>
      <AuthChecker />
      <AuthFlowComponent>
        <SignInForm />
      </AuthFlowComponent>
    </>
  );
}
