"use client";
import { DataTable } from "../ui/data-table/DataTable";
import { Badge } from "../ui/badge";

interface TransactionTax {
  id: string;
  date: string;
  customer: string;
  amount: string;
  salesTax: string;
  status: "Paid" | "Due";
}

const transactionTaxData: TransactionTax[] = [
  {
    id: "RM101",
    date: "2023-10-01",
    customer: "Alice Johnson",
    amount: "120 CAD",
    salesTax: "1,200 CAD",
    status: "Paid" as const,
  },
  {
    id: "RM102",
    date: "2023-10-01",
    customer: "Bob Smith",
    amount: "100 CAD",
    salesTax: "1,200 CAD",
    status: "Due" as const,
  },
];

const columns = [
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Transaction ID",
    accessorKey: "id",
  },
  {
    header: "Customer",
    accessorKey: "customer",
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
  {
    header: "Sales Tax",
    accessorKey: "salesTax",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (item: TransactionTax) => (
      <Badge variant={item.status === "Paid" ? "success" : "destructive"}>
        {item.status}
      </Badge>
    ),
  },
];

export default function TransactionTaxTable() {
  return (
    <div className="w-full rounded-2xl mx-auto pb-5 bg-white">
      <div className="flex items-center px-6 py-8">
        <h1 className="text-lg/6 font-semibold text-[#292929] xl:text-xl/8">
          Recent Refund Transaction
        </h1>
      </div>
      <DataTable
        data={transactionTaxData}
        columns={columns}
        enablePagination={false}
      />
    </div>
  );
}
