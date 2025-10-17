"use client";

import { useState, useEffect, useCallback } from "react";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { DataTable } from "@/components/ui/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useGetProducts } from "@/hooks/useGetProducts";
import { useDeleteProduct } from "@/hooks/useProduct";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import TableSkeletonLoader from "@/components/TableSkeletonLoader";

// Use the Product type from the API hook
interface ProductTableItem {
  id: number;
  product: string;
  category: string;
  qty: number;
  price: string;
  discount: string;
  status: "In Stock" | "Out of stock" | "Low Stock";
  shippingOption: "Free Shipping" | "Expedited Shipment";
  date: string;
}

// Transform API product to table format
const transformProductToTableItem = (product: {
  id: number;
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
  const getStockStatus = (qty: number): "In Stock" | "Out of stock" | "Low Stock" => {
    if (qty === 0) return "Out of stock";
    if (qty < 10) return "Low Stock"; 
    return "In Stock";
  };

  // Default shipping option (you might want to add this to your API)
  const getShippingOption = (): "Free Shipping" | "Expedited Shipment" => {
    return Math.random() > 0.5 ? "Free Shipping" : "Expedited Shipment";
  };

  // Calculate discount percentage
  const calculateDiscount = (regularPrice: string, salesPrice: string): string => {
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
  const getDisplayPrice = (regularPrice: string, salesPrice: string): string => {
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
    product: product.title || "Unknown Product",
    category: product.category?.name || "Uncategorized",
    qty: product.quantity || 0,
    price: getDisplayPrice(product.regular_price || "0", product.sales_price || "0"),
    discount: calculateDiscount(product.regular_price || "0", product.sales_price || "0"),
    status: getStockStatus(product.quantity || 0),
    shippingOption: getShippingOption(),
    date: new Date(product.created_at).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit", 
      year: "2-digit"
    }),
  };
};

const statsData = [
  {
    icon: "/icons/dollar-circle.svg",
    items: [
      { label: "Sales", value: "250,000CAD" },
      { label: "Revenue", value: "130,000CAD" },
    ],
  },
  {
    icon: "/icons/eye.svg",
    items: [
      { label: "Views", value: "30" },
      { label: "Clicks", value: "24" },
      { label: "Star Rating", value: "30" },
    ],
  },
  {
    icon: "/icons/box.svg",
    items: [
      { label: "Low Stock", value: "250" },
      { label: "Expired", value: "10" },
      { label: "Returns", value: "10" },
    ],
  },
];

const orderStatsData = [
  {
    icon: "/icons/shopping-bag.svg",
    items: [
      { label: "All Orders", value: "250" },
      { label: "Pending", value: "10" },
      { label: "Completed", value: "240" },
    ],
  },
  {
    icon: "/icons/alert-triangle.svg",
    items: [
      { label: "Cancelled", value: "30" },
      { label: "Return", value: "24" },
      { label: "Damaged", value: "24" },
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

const columns = [
  {
    header: "Product",
    accessorKey: "product",
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
  {
    header: "Shipping Option",
    accessorKey: "shippingOption",
    cell: (item: ProductTableItem) => getShippingBadge(item.shippingOption),
  },
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
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductTableItem | null>(null);

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
  const { data: productsResponse, isLoading, error } = useGetProducts({
    page: currentPage,
    per_page: rowsPerPage,
    search: debouncedSearch || undefined,
    type: "products"
  });

  // Transform API data for the table
  const products: ProductTableItem[] = productsResponse?.data.data?.map(transformProductToTableItem) || [];

  // Delete product mutation
  const deleteProduct = useDeleteProduct();

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
      {/* <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0"
      >
        <Pencil className="h-4 w-4" />
      </Button> */}
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
      {/* <Button
        variant="ghost"
        size="sm"
        className="h-4 w-4 p-0"
      >
        <Eye className="h-4 w-4" />
      </Button> */}
    </div>
  );

  return (
    <div className="p-6 space-y-6 bg-[#F8F9FA] min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Button className="bg-[#E67E22] hover:bg-[#D35400]">Export</Button>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {orderStatsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Products Table */}
      {isLoading ? (
        <TableSkeletonLoader />
      ) : error ? (
        <div className="p-6 text-center text-red-500">
          Error loading products: {error.message}
        </div>
      ) : (
        <DataTable
          heading="Product"
          data={products}
          columns={columns}
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
        title="Delete Product"
        description={
          productToDelete
            ? `Are you sure you want to delete the product "${productToDelete.product}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteProduct.isPending}
      />
    </div>
  );
}
