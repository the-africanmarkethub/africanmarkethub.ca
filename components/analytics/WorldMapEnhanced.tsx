"use client";

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

interface MapData {
  country: string;
  users: number;
  percentage: number;
  coordinates?: [number, number];
}

interface WorldMapEnhancedProps {
  data?: MapData[];
  highlightedCountries?: string[];
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const countryCoordinates: Record<string, [number, number]> = {
  "United States": [-101, 40],
  "USA": [-101, 40],
  "United State (USA)": [-101, 40],
  "Canada": [-106, 56],
  "United Kingdom": [-3, 54],
  "UK": [-3, 54],
  "Germany": [10, 51],
  "France": [2, 47],
  "Japan": [138, 36],
  "Australia": [133, -27],
  "Brazil": [-47, -14],
  "India": [78, 20],
  "China": [105, 35],
  "Nigeria": [8, 9],
  "South Africa": [24, -29],
  "Mexico": [-102, 23],
  "Spain": [-4, 40],
  "Italy": [12, 42],
  "Russia": [100, 60],
  "South Korea": [127, 36],
  "Indonesia": [113, -1],
};

const WorldMapEnhanced: React.FC<WorldMapEnhancedProps> = ({ 
  data = []
}) => {
  const maxUsers = Math.max(...data.map(d => d.users), 1);

  const getCountryFillColor = (geo: { properties: { NAME?: string; name?: string } }) => {
    const countryName = geo.properties.NAME || geo.properties.name;
    const countryData = data.find(d => 
      countryName && (
        d.country.toLowerCase().includes(countryName.toLowerCase()) ||
        countryName.toLowerCase().includes(d.country.toLowerCase())
      )
    );
    
    if (!countryData) return "#E5E7EB";
    
    const intensity = countryData.users / maxUsers;
    if (intensity > 0.7) return "#1E40AF";
    if (intensity > 0.4) return "#3B82F6";
    if (intensity > 0.2) return "#93C5FD";
    return "#DBEAFE";
  };

  return (
    <div className="w-full h-full relative">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 100,
          center: [0, 20],
        }}
        className="w-full h-full"
      >
        <ZoomableGroup zoom={1} minZoom={0.5} maxZoom={2}>
          <Geographies geography={geoUrl}>
            {({ geographies }: { geographies: Array<{ rsmKey: string; properties: { NAME?: string; name?: string } }> }) =>
              geographies.map((geo: { rsmKey: string; properties: { NAME?: string; name?: string } }) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getCountryFillColor(geo)}
                  stroke="#FFFFFF"
                  strokeWidth={0.5}
                  style={{
                    default: {
                      outline: "none",
                    },
                    hover: {
                      fill: "#2563EB",
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "#1E40AF",
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
          
          {/* Add markers for top countries */}
          {data.slice(0, 5).map((location, index) => {
            const coordinates = 
              countryCoordinates[location.country] || 
              countryCoordinates[location.country.split("(")[0].trim()] ||
              [0, 0];
            
            return (
              <Marker key={index} coordinates={coordinates}>
                <circle
                  r={6}
                  fill="#DC2626"
                  stroke="#fff"
                  strokeWidth={2}
                  className="animate-pulse"
                />
                <text
                  textAnchor="middle"
                  y={-10}
                  style={{
                    fontSize: "10px",
                    fill: "#374151",
                    fontWeight: "600",
                  }}
                >
                  {location.percentage}%
                </text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>
      
      {/* Legend */}
      <div className="absolute bottom-2 left-2 bg-white/90 p-2 rounded shadow-sm">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#1E40AF] rounded-sm"></div>
            <span>High Activity (&gt;70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#3B82F6] rounded-sm"></div>
            <span>Medium Activity (40-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#93C5FD] rounded-sm"></div>
            <span>Low Activity (20-40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#DBEAFE] rounded-sm"></div>
            <span>Minimal Activity (&lt;20%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldMapEnhanced;