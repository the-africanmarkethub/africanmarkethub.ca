import { Banner } from "@/interfaces/banners";
import api from "./axios";

export async function listBanners(type?: string): Promise<{ data: Banner[] }> {
  const response = await api.get(`/banners${type ? `?type=${type}` : ""}`);
  return response.data;
}
