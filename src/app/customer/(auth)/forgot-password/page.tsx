"use client";

import ForgotPasswordForm from "@/components/customer/forms/ForgotPasswordForm";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import React from "react";

function Page() {
  return (
    <MaxWidthWrapper className="flex items-center justify-center min-h-screen py-8 px-4">
      <ForgotPasswordForm />
    </MaxWidthWrapper>
  );
}

export default Page;
