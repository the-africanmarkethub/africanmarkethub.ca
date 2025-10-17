"use client";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import CreateAccountForm from "@/components/forms/CreateAccountForm";

const SignUpContent = () => {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");

  return (
    <MaxWidthWrapper className="mt-36">
      <CreateAccountForm referralCode={referralCode} />
    </MaxWidthWrapper>
  );
};

const Page = () => {
  return (
    <Suspense fallback={
      <MaxWidthWrapper className="mt-36">
        <div>Loading...</div>
      </MaxWidthWrapper>
    }>
      <SignUpContent />
    </Suspense>
  );
};

export default Page;
