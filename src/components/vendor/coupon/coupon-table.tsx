"use client";

import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/vendor/ui/button";
import { DataTable, Column } from "@/components/vendor/ui/data-table/DataTable";
import { Card } from "@/components/vendor/ui/card";
import { Badge } from "@/components/vendor/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/vendor/ui/tabs";
import { ConfirmationModal } from "@/components/vendor/ui/confirmation-modal";
import React from "react";
import Image from "next/image";
import SubmitButton from "../SubmitButton";
import { useRouter } from "next/navigation";
import { useGetCoupons } from "@/hooks/vendor/useGetCoupons";
import { useDeleteCoupon } from "@/hooks/vendor/useDeleteCoupon";
import TableSkeletonLoader from "../TableSkeletonLoader";

interface CouponTableItem {
  id: number;
  title: string;
  code: string;
  amount: string;
  active: string;
  expiry: string;
  limitNumber: string;
  status: string;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface Filter {
  label: string;
  type?: "select" | "dateRange";
  options?: { label: string; value: string }[];
  onSelect?: (value: string) => void;
  onDateRangeChange?: (range: DateRange) => void;
  dateRange?: DateRange;
}

export function CouponTable() {
  const [dateRange, setDateRange] = React.useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [couponToDelete, setCouponToDelete] =
    React.useState<CouponTableItem | null>(null);

  const router = useRouter();

  // Fetch coupons using the new hook
  const {
    data: couponsResponse,
    isLoading,
    error,
  } = useGetCoupons({
    page: currentPage,
    search: searchQuery || undefined,
  });

  // Mutation hooks for CRUD operations
  const deleteCouponMutation = useDeleteCoupon();

  // Transform API data for the table
  const transformCouponToTableItem = (coupon: {
    id: number;
    discount_code: string;
    discount_rate: string;
    discount_type: string;
    start_time: string;
    end_time: string;
    status: string;
    product?: {
      title?: string;
    };
  }): CouponTableItem => ({
    id: coupon.id,
    title: coupon.product?.title || "Unknown Product",
    code: coupon.discount_code,
    amount: `${coupon.discount_rate}${coupon.discount_type === "percentage" ? "%" : "CAD"}`,
    active: new Date(coupon.start_time).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    }),
    expiry: new Date(coupon.end_time).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    }),
    limitNumber: "-", // Not provided in API response
    status: coupon.status,
  });

  const coupons: CouponTableItem[] =
    couponsResponse?.data?.map(transformCouponToTableItem) || [];
  const hasCoupons = !isLoading && coupons.length > 0;

  // Debug logging
  console.log("CouponTable Debug:", {
    isLoading,
    error,
    couponsResponse,
    couponsLength: coupons.length,
    hasCoupons,
  });

  // Handler functions
  const handleEditCoupon = (coupon: CouponTableItem) => {
    // Find the full coupon data from the response
    const fullCoupon = couponsResponse?.data?.find(
      (c: { id: number }) => c.id === coupon.id
    );

    if (fullCoupon) {
      // Encode the coupon data and pass as URL parameter
      const encodedData = encodeURIComponent(JSON.stringify(fullCoupon));
      router.push(
        `/products/promotion/edit-coupon/${coupon.id}?data=${encodedData}`
      );
    }
  };

  const handleDeleteCoupon = (coupon: CouponTableItem) => {
    setCouponToDelete(coupon);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (couponToDelete) {
      deleteCouponMutation.mutate(couponToDelete.id);
      setDeleteDialogOpen(false);
      setCouponToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setCouponToDelete(null);
  };

  const columns: Column<CouponTableItem>[] = [
    { header: "Coupon Title", accessorKey: "title" },
    { header: "Code", accessorKey: "code" },
    { header: "Amount", accessorKey: "amount" },
    { header: "Active", accessorKey: "active" },
    { header: "Expiry", accessorKey: "expiry" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: CouponTableItem) => (
        <Badge
          className={
            item.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        >
          {item.status}
        </Badge>
      ),
    },
    { header: "Limit Number", accessorKey: "limitNumber" },
  ];

  const rowActions = (item: CouponTableItem) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => handleEditCoupon(item)}
        title="Edit Coupon"
      >
        <Pencil className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => handleDeleteCoupon(item)}
        disabled={deleteCouponMutation.isPending}
        title="Delete Coupon"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const filters: Filter[] = [
    {
      label: "Status",
      type: "select",
      options: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
        { label: "Expired", value: "expired" },
      ],
      onSelect: (value: string) => console.log("Status filter:", value),
    },
    {
      label: "Date",
      type: "dateRange",
      dateRange,
      onDateRangeChange: (range: DateRange) => {
        setDateRange(range);
        console.log("Date range:", range);
      },
    },
    {
      label: "Location",
      type: "select",
      options: [
        { label: "All", value: "all" },
        { label: "Local", value: "local" },
        { label: "International", value: "international" },
      ],
      onSelect: (value: string) => console.log("Location filter:", value),
    },
  ];

  return (
    <>
      <Tabs defaultValue="discount" className="space-y-6">
        <TabsList className="w-full">
          <TabsTrigger className="w-[503px]" value="discount">
            Discount & Coupon
          </TabsTrigger>
          <TabsTrigger className="w-[503px] text-[#8B909A]" value="advertising">
            Advertising
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discount">
          {isLoading ? (
            <TableSkeletonLoader />
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              Error loading coupons: {error.message}
            </div>
          ) : hasCoupons ? (
            <div className="w-full space-y-6">
              {/* Header with Create Button */}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Discount & Coupon</h2>
                <Button
                  onClick={() =>
                    router.push("/vendor/products/promotion/add-coupon")
                  }
                  className="bg-[#E67E22] hover:bg-[#D35400] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Coupon
                </Button>
              </div>

              <DataTable
                data={coupons}
                columns={columns}
                enableSelection
                enableSearch
                enablePagination
                filters={filters}
                onSearch={setSearchQuery}
                rowActions={rowActions}
                currentPage={1}
                totalItems={coupons.length}
                rowsPerPage={coupons.length}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={(rows) =>
                  console.log("Rows per page:", rows)
                }
              />
            </div>
          ) : (
            <div className="w-full py-[189px] flex flex-col items-center justify-center space-y-6 bg-[#FFFFFF] h-full">
              <div className=" bg-[#FFF6D5] w-[120px] h-[120px] rounded-full flex items-center justify-center">
                <Image
                  alt="tag"
                  src="/assets/icons/tag.svg"
                  width={64}
                  height={64}
                />
              </div>
              <p className="text-base font-semibold">
                There are no open promotions
              </p>
              <SubmitButton
                onClick={() =>
                  router.push("/vendor/products/promotion/add-coupon")
                }
                className="text-[#FFFFFF] h-[56px] rounded-[39px] w-[349px]"
              >
                <Plus width={24} height={24} /> Create Promotional Discount
              </SubmitButton>
            </div>
          )}
        </TabsContent>

        <TabsContent value="advertising" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-6">
              <p className="text-center text-muted-foreground">
                Advertising features coming soon
              </p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Coupon"
        description={
          couponToDelete
            ? `Are you sure you want to delete the coupon "${couponToDelete.code}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deleteCouponMutation.isPending}
      />
    </>
  );
}
