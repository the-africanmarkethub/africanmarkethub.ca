"use client";
import EmailVerification from "@/components/forms/EmailVerification";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React from "react";

const Page = () => {
  return (
    <MaxWidthWrapper className="flex items-center justify-center h-screen">
      <EmailVerification />
    </MaxWidthWrapper>
  );
};

export default Page;
