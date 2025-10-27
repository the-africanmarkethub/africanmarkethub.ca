"use client";
import { useState } from "react";
import { useGetVendorProducts } from "@/hooks/vendor/useGetVendorProducts";
import { Badge } from "@/components/vendor/ui/badge";
import { EllipsisVertical } from "lucide-react";
import { DataTable } from "@/components/vendor/ui/data-table/DataTable";
import TableSkeletonLoader from "../TableSkeletonLoader";
import Image from "next/image";
interface FeaturedProduct {
  id: number;
  title: string;
  images: string[];
  category: {
    type: string;
  };
  status: "active" | "inactive";
}

interface TableFeaturedProduct {
  id: number;
  image: string;
  title: string;
  category: {
    type: string;
  };
  status: "active" | "inactive";
}
export default function FeaturedProductsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: productsResponse, isLoading } =
    useGetVendorProducts(currentPage);
  const vendorProducts = productsResponse?.data?.data;

  const featuredproducts: TableFeaturedProduct[] =
    vendorProducts?.map((product: FeaturedProduct) => {
      return {
        id: product?.id || 0,
        image: product?.images?.[0] || "",
        category: product?.category?.type || "",
        status: product?.status || "",
        title: product?.title || "",
      };
    }) || [];

  const columns = [
    {
      header: "Image",
      accessorKey: "image",
      cell: (item: TableFeaturedProduct) => (
        <Image
          src={item.image}
          alt={item.title}
          width={42}
          height={42}
          className="rounded-[8px]"
        />
      ),
    },
    {
      header: "Product Name",
      accessorKey: "title",
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: TableFeaturedProduct) => (
        <Badge
          variant={item.status === "active" ? "success" : "destructive"}
          className="px-2"
        >
          {item.status}
        </Badge>
      ),
    },
  ];

  const rowActions = () => (
    <button className="">
      <EllipsisVertical />
    </button>
  );

  return (
    <div className="mt-5">
      {isLoading ? (
        <TableSkeletonLoader />
      ) : (
        <DataTable
          data={featuredproducts}
          columns={columns}
          enableSelection
          rowActions={rowActions}
          currentPage={productsResponse?.data.current_page || 1}
          rowsPerPage={productsResponse?.data.per_page || 10}
          totalItems={productsResponse?.data.total || 0}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </div>
  );
}
