import React from "react";

const WorldMap = () => {
  return (
    <div className="relative w-full h-full bg-white">
      <svg
        viewBox="0 0 1000 500"
        className="w-full h-full"
        style={{ filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.1))" }}
      >
        {/* North America */}
        <path
          d="M 210 120 L 380 120 L 400 200 L 350 280 L 280 300 L 200 250 L 180 180 Z"
          fill="#2563eb"
          opacity="0.8"
        />

        {/* South America */}
        <path
          d="M 250 300 L 320 320 L 340 420 L 280 460 L 240 440 L 220 380 Z"
          fill="#e4e4e7"
          opacity="0.6"
        />

        {/* Europe */}
        <path
          d="M 480 100 L 560 100 L 580 160 L 540 200 L 500 180 L 470 140 Z"
          fill="#2563eb"
          opacity="0.6"
        />

        {/* Africa */}
        <path
          d="M 480 200 L 560 200 L 580 320 L 520 380 L 460 340 L 440 260 Z"
          fill="#e4e4e7"
          opacity="0.6"
        />

        {/* Asia */}
        <path
          d="M 600 80 L 800 80 L 820 200 L 760 300 L 640 280 L 580 200 Z"
          fill="#e4e4e7"
          opacity="0.6"
        />

        {/* Australia */}
        <path
          d="M 740 320 L 840 320 L 860 380 L 820 420 L 760 400 L 740 360 Z"
          fill="#e4e4e7"
          opacity="0.6"
        />

        {/* Highlight dots for top countries */}
        <circle cx="280" cy="180" r="8" fill="#2563eb" opacity="0.8">
          <title>United States</title>
        </circle>
        <circle cx="280" cy="150" r="8" fill="#2563eb" opacity="0.8">
          <title>Canada</title>
        </circle>
        <circle cx="500" cy="150" r="8" fill="#2563eb" opacity="0.8">
          <title>United Kingdom</title>
        </circle>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-600 opacity-80 rounded-sm"></div>
          <span>High Activity</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-gray-200 opacity-60 rounded-sm"></div>
          <span>Low Activity</span>
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
