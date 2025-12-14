import Skeleton from "react-loading-skeleton";

export const SkeletonOrderCard = () => {
  return (
    <div className="card">
      <Skeleton className="h-5 w-32 mb-2" />
      <Skeleton className="h-4 w-20 mb-2" />
      <Skeleton className="h-4 w-40 mb-4" />
      <div className="flex gap-3">
        <Skeleton className="w-16 h-16 rounded" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
};
