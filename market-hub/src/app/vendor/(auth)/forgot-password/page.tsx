"use client";
import AuthFlowComponent from "@/components/vendor/AuthFlowComponent";
import ForgotPasswordForm from "@/components/vendor/forms/ForgotPasswordForm";
import React from "react";

function Page() {
  return (
    <AuthFlowComponent>
      <ForgotPasswordForm />
    </AuthFlowComponent>
  );
}

export default Page;
