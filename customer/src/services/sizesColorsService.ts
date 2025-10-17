import ApiCall from "@/utils/ApiCall";
import { SizesResponse, ColorsResponse } from "@/types/product.types";

// Sizes API calls
export const getSizes = async (): Promise<SizesResponse> => {
  const response = await ApiCall(`/admin/sizes`, "GET");
  return response;
};

// Colors API calls
export const getColors = async (): Promise<ColorsResponse> => {
  const response = await ApiCall(`/admin/colors`, "GET");
  return response;
};
