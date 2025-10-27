import { useGetVendorProducts } from "@/hooks/vendor/useGetVendorProducts";
import VendorProductCard from "./vendor-product-card";
import { type VendorProduct } from "./vendor-product-card";

export default function VendorProductsTabContent() {
  const { data } = useGetVendorProducts();
  const vendorProducts = data?.data?.data;

  return (
    <div className="grid grid-cols-2 gap-4 bg-white px-6 pt-4 lg:grid-cols-3 lg:gap-6">
      {vendorProducts?.map((product: VendorProduct) => (
        <VendorProductCard key={product.id} {...product} />
      ))}
    </div>
  );
}
