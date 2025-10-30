import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FAQResponse, FAQParams } from "@/types/vendor/api/faq.types";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const fetchFAQs = async (params?: FAQParams): Promise<FAQResponse> => {
  const { data } = await axios.get(`${API_URL}/faqs`, {
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

export function useFAQs(params?: FAQParams) {
  return useQuery({
    queryKey: ["faqs", "vendor", params],
    queryFn: () => fetchFAQs(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}