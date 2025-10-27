import AnalyticsStatsCard from "./analytics-stats-card";
import RefundProdctCategory from "./refund-product-category";
import RefundTransactionTable from "./refund-transaction-table";
import ReturnReasons from "./return-reasons";

const mockData = {
  refundRate: {
    value: "5.2%",
    percentage: 8.5,
    increase: true,
  },
  returnRate: {
    value: "9.73%",
    percentage: 4.5,
    increase: false,
  },
  totalRefund: {
    value: "2,400 CAD",
    percentage: 2.4,
    increase: true,
  },
  processingTime: {
    value: "2 Days",
    percentage: 2.4,
    increase: true,
  },
};

export default function RefundTabContent() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnalyticsStatsCard
          title="Refund Rate"
          value={mockData.refundRate.value}
          percentage={mockData.refundRate.percentage}
          increase={mockData.refundRate.increase}
          icon="/assets/icons/box.svg"
        />
        <AnalyticsStatsCard
          title="Return Rate"
          value={mockData.returnRate.value}
          percentage={mockData.returnRate.percentage}
          increase={mockData.returnRate.increase}
          icon="/assets/icons/box.svg"
        />
        <AnalyticsStatsCard
          title="Total Refund"
          value={mockData.totalRefund.value}
          percentage={mockData.totalRefund.percentage}
          increase={mockData.totalRefund.increase}
          icon="/assets/icons/coffee.svg"
        />
        <AnalyticsStatsCard
          title="Total Refund"
          value={mockData.processingTime.value}
          percentage={mockData.processingTime.percentage}
          increase={mockData.processingTime.increase}
          icon="/assets/icons/trending-down.svg"
        />
      </div>

      <ReturnReasons />
      <RefundProdctCategory />
      <RefundTransactionTable />
    </div>
  );
}
