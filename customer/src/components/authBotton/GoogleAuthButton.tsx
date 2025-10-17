"use client";

import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { signIn } from "next-auth/react";

const GoogleAuthButton = () => {
  const handleGoogleSignIn = () => {
    signIn("google", { 
      callbackUrl: "/" // Redirect to home page after successful login
    });
  };

  return (
    <Button
      onClick={handleGoogleSignIn}
      type="button"
      className="w-full rounded-[32px] text-sm md:text-base font-semibold h-11 md:h-14 border-[1px] border-[#9C5432] text-[#292929] bg-[#FFFFFF] hover:bg-[#F7F7F7] active:bg-[#F7F7F7]"
    >
      <Image
        src="/assets/icons/Google Devicon.svg"
        width={24}
        height={24}
        alt="google"
      />{" "}
      Google
    </Button>
  );
};

export default GoogleAuthButton;
