"use client";

import AuthFlowComponent from "@/components/vendor/AuthFlowComponent";
import EmailVerification from "@/components/vendor/forms/EmailVerification";
import React from "react";

function Page() {
  return (
    <AuthFlowComponent>
      <EmailVerification />
    </AuthFlowComponent>
  );
}

export default Page;
