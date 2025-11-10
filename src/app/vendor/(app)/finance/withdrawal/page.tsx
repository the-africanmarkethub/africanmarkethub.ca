"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, Column } from "@/components/vendor/ui/data-table/DataTable";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useWithdrawalHistory } from "@/hooks/vendor/useWithdrawalHistory";
import { useEarnings } from "@/hooks/vendor/useEarnings";
import { useWithdraw } from "@/hooks/vendor/useWithdraw";
import { WithdrawalModal } from "@/components/vendor/modals/withdrawal-modal";
import TableSkeletonLoader from "@/components/vendor/TableSkeletonLoader";
import { toast } from "sonner";

interface Withdrawal {
  id: string;
  date: string;
  amount: string;
  type: string;
  description: string;
  status: "Completed" | "Failed" | "Pending";
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

export default function WithdrawalPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

  // Fetch data using hooks
  const {
    data: withdrawalHistoryResponse,
    isLoading: withdrawalLoading,
    error: withdrawalError,
  } = useWithdrawalHistory({
    page: currentPage,
    search: searchQuery || undefined,
  });
  const { data: earningsResponse, isLoading: earningsLoading } = useEarnings();

  // Withdrawal mutation
  const withdrawMutation = useWithdraw();

  // Transform API data
  const transformWithdrawalToTableItem = (withdrawal: {
    id: number;
    amount: string;
    status: string;
    created_at: string;
  }): Withdrawal => ({
    id: withdrawal.id.toString(),
    date: new Date(withdrawal.created_at).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    }),
    amount: `${withdrawal.amount}CAD`,
    type: "Withdrawal",
    description: "Withdrawal request",
    status:
      withdrawal.status === "approved"
        ? "Completed"
        : withdrawal.status === "pending"
          ? "Pending"
          : "Failed",
  });

  const withdrawals: Withdrawal[] =
    withdrawalHistoryResponse?.data?.data?.map?.(
      transformWithdrawalToTableItem
    ) || [];
  const totalEarning = earningsResponse?.data?.total_earning || "0.00CAD";
  // const hasWithdrawals = !withdrawalLoading && withdrawals.length > 0;
  const isLoading = withdrawalLoading || earningsLoading;

  // Handle withdrawal
  const handleWithdrawClick = () => {
    const availableEarnings = parseFloat(totalEarning.replace(/[^\d.-]/g, ""));
    if (availableEarnings > 0) {
      setIsWithdrawalModalOpen(true);
    } else {
      toast.error("No funds available for withdrawal");
    }
  };

  const handleWithdrawConfirm = (amount: number) => {
    withdrawMutation.mutate(
      { amount },
      {
        onSuccess: () => {
          setIsWithdrawalModalOpen(false);
          toast.success("Withdrawal request submitted successfully!");
        },
        onError: (error: Error) => {
          toast.error(`Withdrawal failed: ${error?.message || "Unknown error"}`);
        },
      }
    );
  };

  const handleWithdrawalModalClose = () => {
    setIsWithdrawalModalOpen(false);
  };

  const columns: Column<Withdrawal>[] = [
    { header: "Date", accessorKey: "date" },
    { header: "Amount", accessorKey: "amount" },
    { header: "Type", accessorKey: "type" },
    { header: "Description", accessorKey: "description" },
    {
      header: "Status",
      accessorKey: "status",
      cell: (item: Withdrawal) => (
        <Badge
          className={
            item.status === "Completed"
              ? "bg-green-100 text-green-800 border-green-200"
              : item.status === "Pending"
                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                : "bg-red-100 text-red-800 border-red-200"
          }
        >
          {item.status}
        </Badge>
      ),
    },
  ];

  const rowActions = () => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        title="More actions"
      >
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );

  const filters: Filter[] = [
    {
      label: "Status",
      type: "select",
      options: [
        { label: "All", value: "all" },
        { label: "Completed", value: "completed" },
        { label: "Pending", value: "pending" },
        { label: "Failed", value: "failed" },
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
    <div className="flex-1 bg-[#F8F8F8] p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Withdrawal</h1>
        </div>

        {/* Total Earning Card */}
        <Card className="p-6 bg-white rounded-2xl border-none">
          <div className="flex gap-4 flex-col">
            <div className="flex rounded-full items-center justify-between">
              <Image
                src="/assets/icons/sale.svg"
                alt="Total Earning"
                width={24}
                height={32}
              />
              <Button
                className="bg-primary hover:bg-[#D35400] text-white rounded-[39px] px-8"
                onClick={handleWithdrawClick}
                disabled={isLoading}
              >
                Withdraw
              </Button>
            </div>
            <div className="flex-col flex gap-1">
              <p className="text-sm text-gray-600">Total Earning</p>
              <p className="text-2xl font-semibold">{totalEarning}</p>
            </div>
          </div>
        </Card>

        {/* Withdrawal History Section */}
        {isLoading ? (
          <TableSkeletonLoader />
        ) : withdrawalError ? (
          <div className="p-6 text-center text-red-500">
            Error loading withdrawal history: {withdrawalError.message}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Recent Withdrawals</h2>
            <Card className="p-0 bg-white border-none">
              <DataTable
                data={withdrawals}
                columns={columns}
                enableSelection
                enableSearch
                enablePagination
                filters={filters}
                onSearch={setSearchQuery}
                rowActions={rowActions}
                currentPage={withdrawalHistoryResponse?.data?.current_page || 1}
                totalItems={withdrawalHistoryResponse?.data?.total || 0}
                rowsPerPage={withdrawalHistoryResponse?.data?.per_page || 10}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={(rows) =>
                  console.log("Rows per page:", rows)
                }
              />
            </Card>
          </div>
        )}
      </div>

      {/* Withdrawal Modal */}
      <WithdrawalModal
        isOpen={isWithdrawalModalOpen}
        onClose={handleWithdrawalModalClose}
        onConfirm={handleWithdrawConfirm}
        totalEarning={totalEarning}
        isLoading={withdrawMutation.isPending}
      />
    </div>
  );
}
