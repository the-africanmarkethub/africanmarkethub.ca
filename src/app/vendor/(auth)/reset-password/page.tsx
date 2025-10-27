"use client";
import AuthFlowComponent from "@/components/vendor/AuthFlowComponent";
import ResetPasswordForm from "@/components/vendor/forms/ResetPasswordForm";
import React from "react";

function Page() {
  return (
    <AuthFlowComponent>
      <ResetPasswordForm />
    </AuthFlowComponent>
  );
}

export default Page;
