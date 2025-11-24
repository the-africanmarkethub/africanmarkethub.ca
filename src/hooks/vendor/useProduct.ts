import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { QUERY_KEY } from "@/constants/vendor/queryKeys";
import APICall from "@/utils/ApiCall";

async function fetchProduct(productSlug: string | number) {
  const response = await APICall(`/product/${productSlug}`, "GET");
  return response.data;
}

async function deleteProduct(productId: number) {
  const response = await APICall(
    `/vendor/product/delete/${productId}`,
    "DELETE"
  );
  return response.data;
}

export function useProduct(productSlug: string | number) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QUERY_KEY.products, productSlug],
    queryFn: () => fetchProduct(productSlug),
    initialData: () =>
      queryClient.getQueryData([QUERY_KEY.products, productSlug]),
    staleTime: 1000 * 60 * 5, // 5 minutes cache duration
    enabled: !!productSlug,
  });

  return query;
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      // Invalidate and refetch products list after successful deletion
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.products] });
    },
  });
}
