"use client";

import React from "react";
import SignInForm from "@/components/customer/forms/SignInForm";

const Page = () => {
  // useEffect(() => {
  //   // Clear any conflicting auth data on the sign-in page to prevent auto-redirects
  //   const userData = localStorage.getItem("user");
  //   if (userData) {
  //     try {
  //       const user = JSON.parse(userData);
  //       // If stored user is not a customer, clear the data
  //       if (user?.user?.role && user.user.role !== "customer") {
  //         localStorage.removeItem("user");
  //         localStorage.removeItem("accessToken");
  //         localStorage.removeItem("vendorAccessToken");
  //         localStorage.removeItem("vendorUser");
  //       }
  //     } catch {
  //       // Invalid data, clear it
  //       localStorage.removeItem("user");
  //       localStorage.removeItem("accessToken");
  //     }
  //   }
  // }, []);

  return <SignInForm />;
};

export default Page;
