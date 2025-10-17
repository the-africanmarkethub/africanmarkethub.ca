"use client";
import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import React from "react";

function Page() {
  return (
    <MaxWidthWrapper className="flex items-center justify-center h-screen">
      <ResetPasswordForm />
    </MaxWidthWrapper>
  );
}

export default Page;
