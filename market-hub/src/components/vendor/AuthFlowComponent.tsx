import Image from "next/image";
import React from "react";

function AuthFlowComponent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen max-h-screen">
      {/* TODO: OTP Verification | PasskeyModal */}

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        alt="patient"
        className="side-img  max-w-[50%] h-full"
      />

      <section className="relative overflow-y-auto flex h-full container">
        <div className="flex flex-col items-center sub-container max-w-[496px] mx-auto py-12">
          <Image
            src="/assets/icons/logo.svg"
            alt="patient"
            width={1000}
            height={1000}
            className="mb-12 h-[60px] w-fit"
          />

          {children}
        </div>
      </section>
    </div>
  );
}

export default AuthFlowComponent;
