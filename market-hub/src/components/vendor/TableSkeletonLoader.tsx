import React from "react";
import { Skeleton } from "./ui/skeleton";

function TableSkeletonLoader() {
  return (
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex gap-2">
          <Skeleton className="h-10 w-full bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export default TableSkeletonLoader;
