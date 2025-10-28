"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";

import CreateAccountForm from "@/components/customer/forms/CreateAccountForm";

const SignUpContent = () => {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get("ref");

  return <CreateAccountForm referralCode={referralCode} />;
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignUpContent />
    </Suspense>
  );
};

export default Page;
