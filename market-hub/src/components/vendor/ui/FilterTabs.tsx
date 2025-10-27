import { cn } from "@/lib/utils";

export type FilterStatus = "All" | "Published" | "Deleted";

interface FilterTabsProps {
  filterTabs: FilterStatus[];
  setActiveFilter: (filter: FilterStatus) => void;
  activeFilter: FilterStatus;
}

export default function FilterTabs(props: FilterTabsProps) {
  return (
    <div className="w-full max-w-[300px] rounded-lg">
      <div className="flex bg-[#F8F8F8]">
        {props.filterTabs.map((filter) => (
          <button
            key={filter}
            onClick={() => props.setActiveFilter(filter)}
            className={cn(
              "px-2 py-3 text-sm font-medium text-[#525252] w-1/3",
              props.activeFilter === filter && "bg-[#FFF6D5]"
            )}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}
