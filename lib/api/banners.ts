import { Banner } from "@/interfaces/banners";
import api from "./axios";

// Fixed Next.js function
export async function listBanners(type?: string): Promise<{ data: Banner[] }> {
  const response = await api.get('/banners', {
    params: { type } 
  });
  return response.data;
}