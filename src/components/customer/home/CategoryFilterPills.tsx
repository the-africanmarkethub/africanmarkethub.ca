import React from "react";

interface CategoryFilterPillsProps {
  categories: string[];
  active: string;
  setActive: (cat: string) => void;
}

export default function CategoryFilterPills({
  categories,
  active,
  setActive,
}: CategoryFilterPillsProps) {
  const uniqueCategories = [...new Set(categories)];

  return (
    <div className="flex gap-3 mb-3 flex-nowrap overflow-x-auto whitespace-nowrap scrollbar-hide">
      {uniqueCategories.map((cat, index) => (
        <button
          key={`${cat}-${index}`}
          onClick={() => setActive(cat)}
          className={`px-3 md:px-5 py-2 rounded-full border text-[10px] md:text-base font-normal md:font-medium transition-all ${
            active === cat
              ? "bg-[#F6F6F6] border-primary text-primary shadow"
              : "bg-white border-[#E5E5E5] text-[#222]"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
