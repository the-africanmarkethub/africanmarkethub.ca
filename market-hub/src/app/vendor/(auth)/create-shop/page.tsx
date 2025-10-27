"use client";
import AuthFlowComponent from "@/components/vendor/AuthFlowComponent";
import RegisterForm from "@/components/vendor/forms/RegisterForm";
import React from "react";

function Page() {
  return (
    <AuthFlowComponent>
      <RegisterForm />
    </AuthFlowComponent>
  );
}

export default Page;
