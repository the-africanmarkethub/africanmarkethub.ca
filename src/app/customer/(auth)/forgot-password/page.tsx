"use client";

import ForgotPasswordForm from "@/components/customer/forms/ForgotPasswordForm";
import MaxWidthWrapper from "@/components/customer/MaxWidthWrapper";
import React from "react";

function Page() {
  return (
    <MaxWidthWrapper className="flex items-center justify-center h-screen">
      <ForgotPasswordForm />
    </MaxWidthWrapper>
  );
}

export default Page;
