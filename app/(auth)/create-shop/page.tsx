"use client";
import AuthFlowComponent from "@/components/AuthFlowComponent";
import RegisterForm from "@/components/forms/RegisterForm";
import React from "react";

function Page() {
  return (
    <AuthFlowComponent>
      <RegisterForm />
    </AuthFlowComponent>
  );
}

export default Page;
