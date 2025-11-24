"use client";

import { useState, useEffect, useCallback } from "react";
import { StatsCard } from "@/components/vendor/dashboard/StatsCard";
import { DataTable } from "@/components/vendor/ui/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useGetProducts } from "@/hooks/vendor/useGetProducts";
import { useDeleteProduct } from "@/hooks/vendor/useProduct";
import { ConfirmationModal } from "@/components/vendor/ui/confirmation-modal";
import TableSkeletonLoader from "@/components/vendor/TableSkeletonLoader";
import { useShopDetails } from "@/hooks/vendor/useShopDetails";
import { useProductStatistics } from "@/hooks/vendor/useProductStatistics";
import { useGetOrderStats } from "@/hooks/vendor/useGetOrderStats";
import Image from "next/image";

// Use the Product type from the API hook
interface ProductTableItem {
  id: number;
  slug: string;
  product: string;
  image?: string; // Add image field
  category: string;
  qty: number;
  price: string;
  discount: string;
  status: "In Stock" | "Out of stock" | "Low Stock";
  date: string;
}

// Transform API product to table format
const transformProductToTableItem = (product: {
  id: number;
  slug: string;
  title: string;
  images: string[];
  sales_price: string;
  regular_price: string;
  quantity: number;
  status: string;
  created_at: string;
  category?: { name: string };
}): ProductTableItem => {
  // Determine stock status based on quantity
  const getStockStatus = (
    qty: number
  ): "In Stock" | "Out of stock" | "Low Stock" => {
    if (qty === 0) return "Out of stock";
    if (qty < 10) return "Low Stock";
    return "In Stock";
  };

  // Default shipping option (you might want to add this to your API)
  const getShippingOption = (): "Free Shipping" | "Expedited Shipment" => {
    return Math.random() > 0.5 ? "Free Shipping" : "Expedited Shipment";
  };

  // Calculate discount percentage
  const calculateDiscount = (
    regularPrice: string,
    salesPrice: string
  ): string => {
    const regular = parseFloat(regularPrice);
    const sales = parseFloat(salesPrice);

    // If sales price is 0, it means the product uses regular price
    if (sales === 0) return "0%";

    if (regular > 0 && sales > 0 && regular > sales) {
      return `${Math.round(((regular - sales) / regular) * 100)}%`;
    }
    return "0%";
  };

  // Get display price (use sales_price if > 0, otherwise use regular_price)
  const getDisplayPrice = (
    regularPrice: string,
    salesPrice: string
  ): string => {
    const sales = parseFloat(salesPrice);
    const regular = parseFloat(regularPrice);

    if (sales > 0) {
      return `${salesPrice}CAD`;
    } else if (regular > 0) {
      return `${regularPrice}CAD`;
    }
    return "0.00CAD";
  };

  return {
    id: product.id,
    slug: product.slug,
    product: product.title || "Unknown Product",
    image:
      product.images && product.images.length > 0
        ? product.images[0]
        : undefined,
    category: product.category?.name || "Uncategorized",
    qty: product.quantity || 0,
    price: getDisplayPrice(
      product.regular_price || "0",
      product.sales_price || "0"
    ),
    discount: calculateDiscount(
      product.regular_price || "0",
      product.sales_price || "0"
    ),
    status: getStockStatus(product.quantity || 0),
    date: new Date(product.created_at).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    }),
  };
};

const getStatsData = (stats: any) => [
  {
    icon: "/icons/box.svg",
    items: [
      {
        label: "Total Products",
        value: stats?.total_products?.toString() || "0",
      },
      {
        label: "Active Products",
        value: stats?.active_products?.toString() || "0",
      },
    ],
  },
  {
    icon: "/icons/eyes.svg",
    items: [
      { label: "Views", value: stats?.views?.toString() || "0" },
      {
        label: "Reviewed Products",
        value: stats?.reviewed_products?.toString() || "0",
      },
    ],
  },
  {
    icon: "/icons/shoppingbag.svg",
    items: [
      {
        label: "Ordered Products",
        value: stats?.ordered_products?.toString() || "0",
      },
      {
        label: "Inactive Products",
        value: stats?.inactive_products?.toString() || "0",
      },
    ],
  },
];

const getOrderStatsData = (stats: any) => [
  {
    icon: "/icons/shoppingbag.svg",
    items: [
      { label: "Total Orders", value: stats?.total_orders?.toString() || "0" },
      { label: "New Orders", value: stats?.new_orders?.toString() || "0" },
      {
        label: "Ongoing Orders",
        value: stats?.ongoing_orders?.toString() || "0",
      },
    ],
  },
  {
    icon: "/icons/shoppingbag.svg",
    items: [
      {
        label: "Shipped Orders",
        value: stats?.shipped_orders?.toString() || "0",
      },
      {
        label: "Cancelled Orders",
        value: stats?.cancelled_orders?.toString() || "0",
      },
      {
        label: "Returned Orders",
        value: stats?.returned_orders?.toString() || "0",
      },
    ],
  },
];

const getStatusBadge = (status: string) => {
  const statusStyles = {
    "In Stock": "bg-green-100 text-green-800",
    "Out of stock": "bg-red-100 text-red-800",
    "Low Stock": "bg-yellow-100 text-yellow-800",
  };

  return (
    <Badge className={statusStyles[status as keyof typeof statusStyles]}>
      {status}
    </Badge>
  );
};

const getShippingBadge = (shippingOption: string) => {
  const shippingStyles = {
    "Free Shipping": "bg-green-100 text-green-800",
    "Expedited Shipment": "bg-orange-100 text-orange-800",
  };

  return (
    <Badge
      className={shippingStyles[shippingOption as keyof typeof shippingStyles]}
    >
      {shippingOption}
    </Badge>
  );
};

const getColumns = (itemType: string) => [
  {
    header: itemType,
    accessorKey: "product",
    cell: (item: ProductTableItem) => (
      <div className="flex items-center gap-3">
        {item.image ? (
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <Image
              src={item.image}
              alt={item.product}
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-400 text-xs">No img</span>
          </div>
        )}
        <span className="font-medium text-gray-900 truncate">
          {item.product}
        </span>
      </div>
    ),
  },
  {
    header: "Category",
    accessorKey: "category",
  },
  {
    header: "Qty",
    accessorKey: "qty",
  },
  {
    header: "Price",
    accessorKey: "price",
  },
  {
    header: "Discount",
    accessorKey: "discount",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (item: ProductTableItem) => getStatusBadge(item.status),
  },
  // {
  //   header: "Shipping Option",
  //   accessorKey: "shippingOption",
  //   cell: (item: ProductTableItem) => getShippingBadge(item.shippingOption),
  // },
  {
    header: "Date",
    accessorKey: "date",
  },
];

const filters = [
  {
    label: "Status",
    type: "select" as const,
    options: [
      { label: "All", value: "all" },
      { label: "In Stock", value: "in_stock" },
      { label: "Out of Stock", value: "out_of_stock" },
      { label: "Low Stock", value: "low_stock" },
    ],
  },
  {
    label: "Date",
    type: "dateRange" as const,
  },
  {
    label: "Location",
    type: "select" as const,
    options: [
      { label: "All Locations", value: "all" },
      { label: "North America", value: "na" },
      { label: "Europe", value: "eu" },
    ],
  },
];

export default function ProductManagement() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] =
    useState<ProductTableItem | null>(null);

  // Get shop details to determine if it's a service or product shop
  const { data: shopDetails } = useShopDetails();
  const { data: productStats } = useProductStatistics();
  const { data: orderStats } = useGetOrderStats();
  const isService = shopDetails?.shops?.[0]?.type === "services";
  const itemType = isService ? "Service" : "Product";

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      // Reset to page 1 when searching
      if (searchInput !== debouncedSearch) {
        setCurrentPage(1);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchInput, debouncedSearch]);

  // Handle search input change
  const handleSearchChange = useCallback((query: string) => {
    setSearchInput(query);
  }, []);

  // Fetch products using the new hook with debounced search
  const {
    data: productsResponse,
    isLoading,
    error,
  } = useGetProducts({
    page: currentPage,
    per_page: rowsPerPage,
    search: debouncedSearch || undefined,
    type: isService ? "services" : "products",
  });

  // Transform API data for the table
  const products: ProductTableItem[] =
    productsResponse?.data.data?.map(transformProductToTableItem) || [];

  // Delete product mutation
  const deleteProduct = useDeleteProduct();

  const handleViewProduct = (product: ProductTableItem) => {
    router.push(`/vendor/products/new?slug=${product.slug}&mode=view`);
  };

  const handleDeleteProduct = (product: ProductTableItem) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct.mutate(productToDelete.id);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleRowActions = (item: ProductTableItem) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0"
        onClick={() => handleViewProduct(item)}
        title="View Product"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0"
        onClick={() => handleDeleteProduct(item)}
        disabled={deleteProduct.isPending}
        title="Delete Product"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-[#F8F9FA] min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{itemType} Management</h1>
        <Button className="bg-[#E67E22] hover:bg-[#D35400]">Export</Button>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getStatsData(productStats?.data).map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {getOrderStatsData(orderStats?.data).map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Products Table */}
      {isLoading ? (
        <TableSkeletonLoader />
      ) : error ? (
        <div className="p-6 text-center text-red-500">
          Error loading {itemType.toLowerCase()}s: {error.message}
        </div>
      ) : products.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-4xl mb-4">📦</div>
            <h3 className="text-lg font-medium mb-2">
              No {itemType.toLowerCase()}s found
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {debouncedSearch
                ? `No ${itemType.toLowerCase()}s match your search criteria.`
                : `You haven't added any ${itemType.toLowerCase()}s yet.`}
            </p>
            {!debouncedSearch && (
              <button
                onClick={() => (window.location.href = "/vendor/products/new")}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
              >
                Add Your First {itemType}
              </button>
            )}
          </div>
        </div>
      ) : (
        <DataTable
          heading={itemType}
          data={products}
          columns={getColumns(itemType)}
          enableSelection
          enablePagination
          enableSearch
          filters={filters}
          onSearch={handleSearchChange}
          currentPage={productsResponse?.data.current_page || 1}
          rowsPerPage={productsResponse?.data.per_page || 7}
          totalItems={productsResponse?.data.total || 0}
          onPageChange={setCurrentPage}
          onRowsPerPageChange={setRowsPerPage}
          rowActions={handleRowActions}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title={`Delete ${itemType}`}
        description={
          productToDelete
            ? `Are you sure you want to delete the ${itemType.toLowerCase()} "${productToDelete.product}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteProduct.isPending}
      />
    </div>
  );
}
