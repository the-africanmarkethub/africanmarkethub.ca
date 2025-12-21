import api from "../axios";

export async function listCoupons(
  limit: number = 10,
  offset: number = 0,
  search: string = ""
) {
  const response = await api.get("/vendor/discounts", {
    params: {
      limit,
      offset,
      search,
    },
  });
  return response.data;
}
