import React from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ButtonProps {
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

const SubmitButton = ({
  isLoading,
  disabled,
  className,
  children,
  onClick,
}: ButtonProps) => {
  return (
    <Button
      type="submit"
      onClick={onClick}
      disabled={isLoading || disabled}
      className={
        className ?? "bg-primary w-full py-4 font-semibold rounded-[39px]"
      }
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/loader.svg"
            width={24}
            height={24}
            alt="loader"
            className="animate-spin"
          />
          Loading ...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};

export default SubmitButton;
