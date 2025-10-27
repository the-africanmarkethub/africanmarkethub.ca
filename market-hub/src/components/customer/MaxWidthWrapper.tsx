import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface MaxWidthWrapperProps {
  className?: string;
  children: ReactNode;
}

const MaxWidthWrapper = ({ className, children }: MaxWidthWrapperProps) => {
  return (
    <div
      className={cn(
        "container mx-auto px-4 lg:px-0 w-full max-w-screen-xl ",
        className
      )}
    >
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
// px-4 md:px-6 lg:px-8
