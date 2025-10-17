import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva("flex-center rounded-sm py-2 text-sm font-normal", {
  variants: {
    variant: {
      default: "bg-primary/10 text-primary hover:bg-primary/20",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      destructive: "bg-[#F1352B1A] text-[#F1352B]",
      success: "bg-[#0099000D] text-[#009900]",
      shipping: "bg-[#FFFBED] text-[#F28C0D]",
      warning: "bg-[#F1BB131A] text-[#F1BB13]",
      outline:
        "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
