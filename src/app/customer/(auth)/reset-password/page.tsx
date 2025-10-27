"use client";
import ResetPasswordForm from "@/components/customer/forms/ResetPasswordForm";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import React from "react";

function Page() {
  return (
    <MaxWidthWrapper className="flex items-center justify-center h-screen">
      <ResetPasswordForm />
    </MaxWidthWrapper>
  );
}

export default Page;
