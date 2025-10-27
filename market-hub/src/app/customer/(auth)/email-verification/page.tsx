"use client";
import EmailVerification from "@/components/customer/forms/EmailVerification";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import React from "react";

const Page = () => {
  return (
    <MaxWidthWrapper className="flex items-center justify-center h-screen">
      <EmailVerification />
    </MaxWidthWrapper>
  );
};

export default Page;
