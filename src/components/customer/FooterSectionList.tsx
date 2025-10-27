import Link from "next/link";
import React from "react";

interface FooterItem {
  text: string;
  href: string;
}

interface SectionListProps {
  title: string;
  items: FooterItem[];
}

function FooterSectionList({ title, items }: SectionListProps) {
  return (
    <div className="flex text-xs flex-col gap-4 w-full">
      <div>
        <h1 className="font-medium">{title}</h1>
      </div>
      <div className="space-y-3 font-normal">
        {items.map((item, index) => (
          <div key={index}>
            <Link
              href={item.href}
              className="hover:text-gray-300 transition-colors"
            >
              {item.text}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FooterSectionList;
