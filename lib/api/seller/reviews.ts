import api from "../axios";

export async function listVendorReviews({
  limit,
  offset,
}: {
  limit: number;
  offset: number;
}) {
  const response = await api.get("/reviews", {
    params: {
      limit,
      offset,
    },
  });
  return response.data;
}