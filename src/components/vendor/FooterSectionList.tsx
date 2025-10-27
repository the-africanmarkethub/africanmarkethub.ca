import React from "react";

interface SectionListProps {
  title: string;
  items: string[];
}

function FooterSectionList({ title, items }: SectionListProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div>
        <h1 className="text-sm  font-medium">{title}</h1>
      </div>
      <div className="space-y-3 text-sm font-normal">
        {items.map((item, index) => (
          <div key={index}>{item}</div>
        ))}
      </div>
    </div>
  );
}

export default FooterSectionList;
