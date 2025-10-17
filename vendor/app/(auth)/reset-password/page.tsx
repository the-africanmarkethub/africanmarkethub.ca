"use client";
import AuthFlowComponent from "@/components/AuthFlowComponent";
import ResetPasswordForm from "@/components/forms/ResetPasswordForm";
import React from "react";

function Page() {
  return (
    <AuthFlowComponent>
      <ResetPasswordForm />
    </AuthFlowComponent>
  );
}

export default Page;
