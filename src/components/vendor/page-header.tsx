import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div>
      <h2 className="text-xl/8 font-medium lg:text-2xl">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}
