import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TutorialResponse, TutorialParams } from "@/types/vendor/api/tutorial.types";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchTutorials = async (params?: TutorialParams): Promise<TutorialResponse> => {
  const { data } = await axios.get(`${API_URL}/tutorials`, {
    params: {
      type: "vendor",
      limit: 10,
      offset: 0,
      ...params,
    },
    headers: {
      "Content-Type": "application/json",
      "accept": "application/json",
    },
  });
  return data;
};

export function useTutorials(params?: TutorialParams) {
  return useQuery({
    queryKey: ["tutorials", "vendor", params],
    queryFn: () => fetchTutorials(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}