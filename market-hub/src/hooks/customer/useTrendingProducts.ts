import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/customer/queryKeys";
import APICall from "@/utils/ApiCall";
import { Product } from "@/types/customer/product.types";

async function fetchTrendingProducts(): Promise<Product[]> {
  const response = await APICall("/products/trending", "GET");
  
  console.log("Trending products API response:", response);

  // The API returns { message: string, status: string, data: Product[] }
  // We need to access response.data to get the products array
  const products = response?.data || response || [];
  
  // Handle potential duplicate data from API
  if (Array.isArray(products)) {
    // Remove duplicates based on product ID
    const uniqueProducts = products.filter(
      (product: Product, index: number, self: Product[]) =>
        index === self.findIndex((p: Product) => p.id === product.id)
    );
    console.log("Unique products after filtering:", uniqueProducts);
    return uniqueProducts;
  }

  return [];
}

export function useTrendingProducts() {
  const query = useQuery<Product[]>({
    queryKey: [QUERY_KEY.trendingProducts],
    queryFn: fetchTrendingProducts,
  });

  return query;
}
