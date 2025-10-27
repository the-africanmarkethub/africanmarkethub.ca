import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/vendor/ui/table";
import { Search } from "lucide-react";
import Image from "next/image";
import OrderSummary from "./order-summary";
import OrderItemCard from "./order-items-card";

export type ShippingStatus =
  | "Completed"
  | "Ongoing"
  | "Shipped"
  | "Processing"
  | "Cancelled"
  | "Returned";

export interface OrderItem {
  id: number;
  name: string;
  image: string;
  quantity: number;
  color?: string;
  price: number;
  discount: number;
  total: number;
  status?: "Pending" | "Unfufilled";
  shippingStatus: ShippingStatus;
  onFulfillItem?: () => void;
  onCreateShippingLabel?: () => void;
}

const orderItems: OrderItem[] = [
  {
    id: 1,
    name: "Beigi Coffe (Navy)",
    image: "/assets/images/photo_product.png",
    quantity: 1,
    price: 105.12,
    color: "green",
    discount: 20.0,
    total: 85.12,
    status: "Pending",
    shippingStatus: "Shipped" as const,
  },
  {
    id: 2,
    name: "Beigi Coffe (Navy)",
    image: "/assets/images/photo_product.png",
    quantity: 1,
    price: 105.12,
    color: "red",
    discount: 20.0,
    status: "Unfufilled",
    total: 85.12,
    shippingStatus: "Shipped" as const,
  },
];

export const getStatusColor = (status: ShippingStatus) => {
  switch (status.toLowerCase()) {
    case "shipped":
      return "text-orange-600 bg-orange-50";
    case "completed":
      return "text-green-600 bg-green-50";
    case "processing":
      return "text-blue-600 bg-blue-50";
    case "cancelled":
      return "text-red-600 bg-red-50";
    case "returned":
      return "text-gray-600 bg-gray-50";
    case "ongoing":
      return "text-yellow-600 bg-yellow-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
};

interface OrderItemsTableProps {
  orderData?: {
    order_items: Array<{
      id: number;
      product: {
        title: string;
        images: string[];
      };
      quantity: number;
      price: string;
      subtotal: string;
    }>;
    shipping_status: string;
    payment_status: string;
    shipping_fee: string;
    total: string;
  };
}

export default function OrderItemsTable({ orderData }: OrderItemsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Transform API data to component format (React Query will handle reactivity)
  const items: OrderItem[] =
    orderData?.order_items?.map((item) => ({
      id: item.id,
      name: item.product?.title || "Unknown Product",
      image: item.product?.images?.[0] || "/assets/images/photo_product.png",
      quantity: item.quantity,
      price: parseFloat(item.price) || 0,
      discount: 0, // API doesn't seem to have discount field
      total: parseFloat(item.subtotal) || 0,
      shippingStatus:
        (orderData.shipping_status as ShippingStatus) || "Processing",
    })) || orderItems; // Fallback to hardcoded data if no API data

  // Calculate totals from API data or fallback to calculated values
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const shipping = orderData?.shipping_fee
    ? parseFloat(orderData.shipping_fee)
    : 40.0;
  const tax =
    orderData?.total && subtotal + shipping !== parseFloat(orderData.total)
      ? parseFloat(orderData.total) - subtotal - shipping
      : 0; // Calculate tax as difference between total and subtotal + shipping
  const grandTotal = orderData?.total
    ? parseFloat(orderData.total)
    : subtotal + shipping + tax;

  const summary = {
    subtotal,
    shipping,
    tax,
    grandTotal,
    paymentStatus: orderData?.payment_status,
  };

  return (
    <div className="w-full rounded-[16px] overflow-hidden">
      {/* Header */}
      <div className="hidden bg-white items-center px-8 py-6 justify-between md:flex">
        <h2 className="text-lg font-semibold">Order Items</h2>
        <div className="relative w-[60%] pr-4 py-1 border border-[#DCDCDC] rounded-sm">
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white pl-16 border-none focus:ring-0 placeholder:text-[#525252] placeholder:font-normal text-sm focus:outline-none"
          />
          <div className="absolute inset-y-0 left-3 top-2 flex items-center w-8 h-8 bg-[#FBF7F1] rounded-full justify-center">
            <Search className="h-5 w-5 text-[#F8A317]" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="hidden bg-white overflow-hidden md:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#EEEEEE]">
              <TableHead className="w-16 pl-8 text-[#454545] text-sm font-semibold">
                S/N
              </TableHead>
              <TableHead className="text-[#454545] text-sm font-semibold">
                Products
              </TableHead>
              <TableHead className="w-20 text-[#454545] text-sm font-semibold">
                Qty
              </TableHead>
              <TableHead className="w-32 text-[#454545] text-sm font-semibold">
                Price
              </TableHead>
              <TableHead className="w-32 text-[#454545] text-sm font-semibold">
                Discount
              </TableHead>
              <TableHead className="w-32 text-[#454545] text-sm font-semibold">
                Total
              </TableHead>
              <TableHead className="w-40 text-[#454545] text-sm font-semibold">
                Shipping Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id} className="border-none">
                <TableCell className="pl-8 text-sm text-[#202224] font-normal">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm text-[#202224] font-normal">
                      {item.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-[#202224] font-normal">
                  {item.quantity}
                </TableCell>
                <TableCell className="text-sm text-[#202224] font-normal">
                  {item.price.toFixed(2)}CAD
                </TableCell>
                <TableCell className="text-sm text-[#202224] font-normal">
                  {item.discount.toFixed(2)}CAD
                </TableCell>
                <TableCell className="text-sm text-[#202224] font-normal">
                  {item.total.toFixed(2)}CAD
                </TableCell>
                <TableCell className="">
                  <div
                    className={`w-32 px-3 py-2 rounded-md text-sm font-medium ${getStatusColor(
                      item.shippingStatus
                    )}`}
                  >
                    {item.shippingStatus}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Card (mobile screens) */}
      <div className="space-y-4 mt-4 md:hidden">
        {items.map((item) => (
          <OrderItemCard key={item.id} {...item} />
        ))}
      </div>

      {/* Summary */}
      <div className="hidden w-full h-10 bg-white md:block"></div>
      <OrderSummary {...summary} />
    </div>
  );
}
