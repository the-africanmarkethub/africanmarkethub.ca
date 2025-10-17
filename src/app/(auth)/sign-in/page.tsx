"use client";

import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React from "react";

import SignInForm from "@/components/forms/SignInForm";

const Page = () => {
  return (
    <MaxWidthWrapper className="flex items-center justify-center h-screen">
      <SignInForm />
    </MaxWidthWrapper>
  );
};

export default Page;
