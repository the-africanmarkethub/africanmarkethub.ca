import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import FeaturedProductsTable from "./featured-products-table";

export default function FeaturedProducts() {
  return (
    <>
      <div className="flex items-center justify-between mt-5 mb-4">
        <h2 className="text-xl font-semibold text-[#292929]">
          Featured Products
        </h2>
        <Button className="bg-[#F28C0D] text-sm font-semibold hover:bg-[#F28C0D] text-white rounded-[32px]">
          <Plus className="w-6 h-6" />
          Featured Products
        </Button>
      </div>
      <FeaturedProductsTable />
    </>
  );
}
