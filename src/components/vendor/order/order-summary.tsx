import { CircleCheckBig, Clock, X } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface Props {
  subtotal: number;
  shipping: number;
  tax: number;
  grandTotal: number;
  paymentStatus?: string;
}

export default function OrderSummary(props: Props) {
  const getPaymentStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return {
          icon: CircleCheckBig,
          text: "Paid",
          bgColor: "bg-[#0099000D]",
          textColor: "text-[#009900]",
        };
      case "paid":
        return {
          icon: CircleCheckBig,
          text: "Paid",
          bgColor: "bg-[#0099000D]",
          textColor: "text-[#009900]",
        };
      case "pending":
        return {
          icon: Clock,
          text: "Pending",
          bgColor: "bg-[#FFF3CD]",
          textColor: "text-[#856404]",
        };
      case "failed":
        return {
          icon: X,
          text: "Failed",
          bgColor: "bg-[#F8D7DA]",
          textColor: "text-[#721C24]",
        };
      default:
        return {
          icon: Clock,
          text: "Pending",
          bgColor: "bg-[#FFF3CD]",
          textColor: "text-[#856404]",
        };
    }
  };

  const paymentConfig = getPaymentStatusConfig(
    props.paymentStatus || "pending"
  );
  const PaymentIcon = paymentConfig.icon;
  return (
    <div className="mt-4 bg-white p-2 space-y-2.5 rounded-[16px] md:space-y-0 md:pr-6 md:pb-8 md:flex md:justify-end md:mt-0 md:rounded-none">
      <div className="flex items-start md:hidden">
        <Badge className="p-1" variant="destructive">
          Pending
        </Badge>
      </div>
      <div className="w-full space-y-5 py-2.5 border-y md:space-y-6 md:p-0 md:border-0 md:w-80">
        <div className="flex justify-between text-sm font-normal">
          <div className="flex gap-x-4 text-sm text-[#525252]">
            <span className="font-medium md:font-normal">Subtotal</span>
            <span className="font-normal md:hidden">1 Item</span>
          </div>
          <span className="text-[#202224]">{props.subtotal.toFixed(2)}CAD</span>
        </div>
        <div className="flex justify-between text-sm font-normal">
          <div className="flex gap-x-4 text-sm text-[#525252]">
            <span className="font-medium md:font-normal">Discount</span>
            <span className="font-normal md:hidden">Mid-Year Sales</span>
          </div>
          <span className="text-[#202224]">20.00CAD</span>
        </div>
        <div className="flex justify-between text-sm font-normal">
          <div className="flex gap-x-4 text-sm text-[#525252]">
            <span className="font-medium md:font-normal">Shipping</span>
            <span className="font-normal md:hidden">Expedited Shipping</span>
          </div>
          <span className="text-[#202224]">{props.subtotal.toFixed(2)}CAD</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#525252] font-medium md:font-normal">Tax</span>
          <span className="text-[#202224]">{props.tax.toFixed(2)}CAD</span>
        </div>
        <div className="pt-0 md:pt-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-[#525252] md:text-lg">
              Grand Total
            </span>
            <span className="text-sm font-semibold text-[#525252] md:text-lg">
              {props.grandTotal.toFixed(2)}CAD
            </span>
          </div>
        </div>
        <div className="hidden justify-end md:flex">
          <div
            className={`flex items-center gap-x-3 ${paymentConfig.bgColor} ${paymentConfig.textColor} px-4 py-2 rounded-[28px]`}
          >
            <PaymentIcon className="h-[41px] w-[41px]" />
            <span className="font-semibold">{paymentConfig.text}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 md:hidden">
        <Button
          variant="outline"
          className="rounded-full font-semibold bg-[#FFFFFF] px-5 py-2.5 border border-[#9C5432]"
        >
          Collect Payment
        </Button>
        <Button className="flex font-semibold rounded-full text-[#FFFFFF] px-5 py-2.5 items-center gap-2">
          Send Invoice
        </Button>
      </div>
    </div>
  );
}
