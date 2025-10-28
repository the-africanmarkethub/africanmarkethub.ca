"use client";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import CreateAccountForm from "@/components/customer/forms/CreateAccountForm";

const SignUpContent = () => {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");

  return (
    <MaxWidthWrapper className="flex items-center justify-center min-h-screen py-8 px-4">
      <CreateAccountForm referralCode={referralCode} />
    </MaxWidthWrapper>
  );
};

const Page = () => {
  return (
    <Suspense fallback={
      <MaxWidthWrapper className="flex items-center justify-center min-h-screen py-8 px-4">
        <div>Loading...</div>
      </MaxWidthWrapper>
    }>
      <SignUpContent />
    </Suspense>
  );
};

export default Page;
