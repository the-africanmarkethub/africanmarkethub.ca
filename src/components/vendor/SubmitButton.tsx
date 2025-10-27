import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

interface SubmitButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const SubmitButton = ({
  isLoading = false,
  className = "",
  children,
  onClick,
  type = "submit",
  ...props
}: SubmitButtonProps) => {
  return (
    <Button
      type={type}
      disabled={isLoading}
      onClick={onClick}
      className={`text-white ${
        className ??
        "bg-primary w-full rounded-[39px] py-4 font-semibold"
      }`}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            width={24}
            height={24}
            alt="loader"
            className="animate-spin"
          />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
