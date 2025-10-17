"use client";

import AuthFlowComponent from "@/components/AuthFlowComponent";
import EmailVerification from "@/components/forms/EmailVerification";
import React from "react";

function Page() {
  return (
    <AuthFlowComponent>
      <EmailVerification />
    </AuthFlowComponent>
  );
}

export default Page;
