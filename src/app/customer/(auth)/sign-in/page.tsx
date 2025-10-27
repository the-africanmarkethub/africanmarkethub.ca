"use client";

import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import React from "react";

import SignInForm from "@/components/customer/forms/SignInForm";

const Page = () => {
  return (
    <MaxWidthWrapper className="flex items-center justify-center h-screen">
      <SignInForm />
    </MaxWidthWrapper>
  );
};

export default Page;
