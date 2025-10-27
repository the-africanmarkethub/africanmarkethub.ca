"use client";

import { DataTable, Column } from "@/components/vendor/ui/data-table/DataTable";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { StatsCard } from "@/components/vendor/dashboard/StatsCard";
import { useTransactions } from "@/hooks/vendor/useTransactions";
import { useEarnings } from "@/hooks/vendor/useEarnings";
import TableSkeletonLoader from "@/components/vendor/TableSkeletonLoader";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: string;
  orderId: string;
  customer: string;
  product: {
    name: string;
    icon: string;
  };
  amount: number;
  date: string;
  paymentStatus: "Pending" | "Paid" | "Refunded";
  status: "Pending" | "Processing" | "Delivered" | "Shipped" | "Cancelled";
}

export default function EarningOverview() {
  // Fetch data using hooks
  const {
    data: transactionsResponse,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useTransactions();
  const { data: earningsResponse, isLoading: earningsLoading } = useEarnings();

  // Transform API data to match table structure
  const transformTransactionToTableItem = (transaction: {
    id: number;
    reference: string;
    amount: string;
    status: string;
    type: string;
    created_at: string;
    transaction_data?: {
      vendor?: {
        name?: string;
        last_name?: string;
      };
    };
  }): Transaction => ({
    id: transaction.id?.toString() || "",
    orderId: transaction.reference || `TXN-${transaction.id}`,
    customer: transaction.transaction_data?.vendor?.name
      ? `${transaction.transaction_data.vendor.name} ${
          transaction.transaction_data.vendor.last_name || ""
        }`.trim()
      : "Unknown Customer",
    product: {
      name:
        transaction.type === "withdrawal"
          ? "Withdrawal Request"
          : "Transaction",
      icon: transaction.type === "withdrawal" ? "💸" : "💳",
    },
    amount: parseFloat(transaction.amount) || 0,
    date: transaction.created_at || new Date().toISOString(),
    paymentStatus:
      transaction.status === "approved"
        ? "Paid"
        : transaction.status === "declined"
        ? "Refunded"
        : "Pending",
    status:
      transaction.status === "approved"
        ? "Delivered"
        : transaction.status === "declined"
        ? "Cancelled"
        : "Pending",
  });

  const transactions: Transaction[] =
    transactionsResponse?.data?.data?.map?.(transformTransactionToTableItem) ||
    [];
  const isLoading = transactionsLoading || earningsLoading;

  const totalEarningStats = {
    icon: "/assets/icons/sale.svg",
    items: [
      {
        label: "Total Earning",
        value: earningsResponse?.data?.total_earning || "0.00CAD",
      },
    ],
    period: "This Week",
  };

  const currentBalanceStats = {
    icon: "/assets/icons/sale.svg",
    items: [
      {
        label: "Current Balance",
        value: earningsResponse?.data?.current_balance || "0.00CAD",
      },
    ],
    period: "This Week",
  };

  const totalUnpaidStats = {
    icon: "/assets/icons/sale.svg",
    items: [
      {
        label: "Total Unpaid",
        value: earningsResponse?.data?.total_unpaid || "0.00CAD",
      },
    ],
    period: "This Week",
  };

  // Remove duplicate transactions declaration - already defined above

  const columns: Column<Transaction>[] = [
    {
      accessorKey: "orderId",
      header: "Order ID",
      cell: (item: Transaction) => (
        <span className="block max-w-[200px] truncate" title={item.orderId}>
          {item.orderId}
        </span>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: (item: Transaction) => (
        <span className="block max-w-[120px] truncate" title={item.customer}>
          {item.customer}
        </span>
      ),
    },
    {
      accessorKey: "product",
      header: "Product",
      cell: (item: Transaction) => (
        <div className="flex items-center gap-2 max-w-[150px]">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100 flex-shrink-0">
            {item.product.icon}
          </div>
          <span className="text-gray-700 truncate" title={item.product.name}>
            {item.product.name}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: (item: Transaction) => <span>{item.amount.toFixed(2)}CAD</span>,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: (item: Transaction) => <span>{item.date}</span>,
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment Status",
      cell: (item: Transaction) => (
        <Badge
          variant={
            item.paymentStatus === "Paid"
              ? "default"
              : item.paymentStatus === "Pending"
              ? "secondary"
              : "destructive"
          }
        >
          {item.paymentStatus}
        </Badge>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (item: Transaction) => (
        <Badge
          variant={
            item.status === "Delivered"
              ? "default"
              : item.status === "Pending"
              ? "secondary"
              : "destructive"
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      accessorKey: "actions",
      header: "Action",
      cell: () => (
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="p-8 space-y-8 xl:p-8 xl:space-y-8">
      <h1 className="text-2xl font-semibold">Earning Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatsCard {...totalEarningStats} />
        <StatsCard {...currentBalanceStats} />
        <StatsCard {...totalUnpaidStats} />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Transaction History</h2>
        {isLoading ? (
          <TableSkeletonLoader />
        ) : transactionsError ? (
          <div className="p-6 text-center text-red-500">
            Error loading transactions: {transactionsError.message}
          </div>
        ) : transactions.length > 0 ? (
          <DataTable
            data={transactions}
            columns={columns}
            enableSelection={false}
            enableSearch
            enablePagination
            onSearch={(query: string) => console.log("Search:", query)}
            currentPage={transactionsResponse?.data?.current_page || 1}
            totalItems={transactionsResponse?.data?.total || 0}
            rowsPerPage={transactionsResponse?.data?.per_page || 10}
            onPageChange={(page: number) => console.log("Page:", page)}
            onRowsPerPageChange={() => {}}
          />
        ) : (
          <div className="p-6 text-center text-gray-500">
            No transactions found
          </div>
        )}
      </div>
    </div>
  );
}
