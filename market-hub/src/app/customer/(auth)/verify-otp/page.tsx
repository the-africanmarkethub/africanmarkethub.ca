"use client";
import VerifyOtpForm from "@/components/customer/forms/VerifyOtpForm";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import React from "react";

const Page = () => {
  return (
    <MaxWidthWrapper className="flex items-center justify-center min-h-screen py-8 px-4">
      <div className="w-full max-w-md">
        <VerifyOtpForm />
      </div>
    </MaxWidthWrapper>
  );
};

export default Page;
