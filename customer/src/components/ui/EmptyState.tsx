import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  iconClassName?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
  iconClassName = "",
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      {Icon && (
        <div className="w-32 h-32 bg-[#FFF4E6] rounded-full flex items-center justify-center mb-6">
          <Icon className={`w-12 h-12 text-[#F28C0D] ${iconClassName}`} />
        </div>
      )}
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-500 text-center mb-6 max-w-sm">
          {description}
        </p>
      )}
      
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="bg-[#F28C0D] hover:bg-[#E67C00] text-white px-8 py-3 rounded-full font-medium flex items-center gap-2"
        >
          <span className="text-xl">+</span>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}