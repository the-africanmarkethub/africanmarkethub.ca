import { Card } from "@/components/vendor/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";
import Image from "next/image";

interface Props {
  title: string;
  value: string;
  percentage: number;
  increase: boolean;
  icon: string;
}

export default function AnalyticsStatsCard(props: Props) {
  const { title, value, percentage, increase, icon } = props;

  return (
    <div>
      <Card className="p-6 bg-[#FFFFFF] border-none rounded-[16px]">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-[#626C70]">{title}</p>
            <h3 className="text-[28px] leading-8 font-semibold mt-2">
              {value}
            </h3>
            <div
              className={`flex items-center text-sm mt-6 font-medium ${
                increase ? "text-[#009900]" : "text-[#F1352B]"
              }`}
            >
              {increase ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              <span className="ml-1">
                {percentage}% {increase ? "Increase" : "Decrease"}
              </span>
            </div>
          </div>
          <div className="bg-[#FFFBED] p-5 rounded-full">
            <Image src={icon} alt="icon" width={24} height={24} />
          </div>
        </div>
      </Card>
    </div>
  );
}
