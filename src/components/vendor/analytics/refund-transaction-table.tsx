"use client";
import Image from "next/image";
import { DataTable } from "../ui/data-table/DataTable";
import { Badge } from "../ui/badge";

interface RefundTransaction {
  id: string;
  date: string;
  customer: string;
  product: {
    title: string;
    imgUrl: string;
  };
  amount: string;
  reason: string;
  status: "Processed" | "Pending";
}

const refundTransactionData: RefundTransaction[] = [
  {
    id: "RM101",
    date: "2023-10-01",
    customer: "Alice Johnson",
    product: {
      title: "Laptop",
      imgUrl: "/assets/images/product.png",
    },
    amount: "1,200 CAD",
    reason: "Defective Products",
    status: "Processed" as const,
  },
  {
    id: "RM102",
    date: "2023-10-01",
    customer: "Bob Smith",
    product: {
      title: "Desktop",
      imgUrl: "/assets/images/product.png",
    },
    amount: "1,200 CAD",
    reason: "Defective Products",
    status: "Pending" as const,
  },
];

const columns = [
  {
    header: "Refund ID",
    accessorKey: "id",
  },
  {
    header: "Date",
    accessorKey: "date",
  },
  {
    header: "Customer",
    accessorKey: "customer",
  },
  {
    header: "Product",
    accessorKey: "product",
    cell: (item: RefundTransaction) => (
      <div className="flex gap-x-1 items-start">
        <Image
          src={item.product.imgUrl}
          alt={item.product.title}
          width={42}
          height={42}
        />
        <p className="text-sm font-normal text-[#464646]">
          {item.product.title}
        </p>
      </div>
    ),
  },
  {
    header: "Amount",
    accessorKey: "amount",
  },
  {
    header: "Reason",
    accessorKey: "reason",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: (item: RefundTransaction) => (
      <Badge variant={item.status === "Processed" ? "success" : "destructive"}>
        {item.status}
      </Badge>
    ),
  },
];

export default function RefundTransactionTable() {
  return (
    <div className="w-full rounded-2xl mx-auto pb-5 bg-white">
      <div className="flex justify-between items-center px-6 py-8">
        <h1 className="text-lg/6 font-semibold text-[#292929] xl:text-xl/8">
          Recent Refund Transaction
        </h1>
      </div>
      <DataTable
        data={refundTransactionData}
        columns={columns}
        enablePagination={false}
      />
    </div>
  );
}
