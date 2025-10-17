"use client";
import AuthFlowComponent from "@/components/AuthFlowComponent";
import VerifyOtpForm from "@/components/forms/VerifyOtpForm";
import React from "react";

function Page() {
  return (
    <AuthFlowComponent>
      <VerifyOtpForm />
    </AuthFlowComponent>
  );
}

export default Page;
