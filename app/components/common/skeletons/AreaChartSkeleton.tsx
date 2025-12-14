"use client";

export default function AreaChartSkeleton() {
  return (
    <div className="animate-pulse w-full h-72 bg-gray-100 rounded-lg relative overflow-hidden">
      {/* Optional: draw some fake bars */}
      <div className="absolute bottom-0 left-4 w-4 h-32 bg-gray-200 rounded"></div>
      <div className="absolute bottom-0 left-12 w-4 h-24 bg-gray-200 rounded"></div>
      <div className="absolute bottom-0 left-20 w-4 h-40 bg-gray-200 rounded"></div>
      <div className="absolute bottom-0 left-28 w-4 h-20 bg-gray-200 rounded"></div>
      <div className="absolute bottom-0 left-36 w-4 h-28 bg-gray-200 rounded"></div>
      <div className="absolute bottom-0 left-44 w-4 h-16 bg-gray-200 rounded"></div>
    </div>
  );
}
