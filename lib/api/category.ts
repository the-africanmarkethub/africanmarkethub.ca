import api from "./axios";

export async function listCategories(
  limit: number,
  offset: number,
  search?: string,
  type?: string,
  status?: string
) {
  const response = await api.get("/categories", {
    params: {
      limit,
      offset,
      ...(search ? { search } : {}),
      ...(type ? { type } : {}),
      ...(status ? { status } : {}),
    },
  });

  const { categories, banner } = response.data;
  return { categories, banner };
}

export async function getCategoryItems(category_slug: string) {
  const response = await api.get(`/category/products/${category_slug}`);
  return response.data;
}
