"use client";
import AuthFlowComponent from "@/components/vendor/AuthFlowComponent";
import VerifyOtpForm from "@/components/vendor/forms/VerifyOtpForm";
import React from "react";

function Page() {
  return (
    <AuthFlowComponent>
      <VerifyOtpForm />
    </AuthFlowComponent>
  );
}

export default Page;
