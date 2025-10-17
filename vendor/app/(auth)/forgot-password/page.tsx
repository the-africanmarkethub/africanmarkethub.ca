"use client";
import AuthFlowComponent from "@/components/AuthFlowComponent";
import ForgotPasswordForm from "@/components/forms/ForgotPasswordForm";
import React from "react";

function Page() {
  return (
    <AuthFlowComponent>
      <ForgotPasswordForm />
    </AuthFlowComponent>
  );
}

export default Page;
