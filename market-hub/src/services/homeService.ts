import { Category } from "@/types/customer/category.types";
import APICall from "@/utils/ApiCall";

export async function fetchCategories(
  type: string = "products"
): Promise<Category[]> {
  const res = await APICall(`/categories?type=${type}`, "GET");

  return res.categories;
}
