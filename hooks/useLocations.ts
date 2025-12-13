"use client";

import { useQuery } from "@tanstack/react-query";
import { LocationsResponse } from "@/types/location";
import { QueryKeys } from "@/lib/query-keys";

const fetchLocations = async (): Promise<LocationsResponse> => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  if (!baseUrl) {
    throw new Error("API base URL is not configured");
  }

  const response = await fetch(`${baseUrl}/locations`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.statusText}`);
  }

  return response.json();
};

export const useLocations = () => {
  return useQuery({
    queryKey: QueryKeys.LOCATIONS,
    queryFn: fetchLocations,
    staleTime: 30 * 60 * 1000, // 30 minutes - locations don't change often
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};