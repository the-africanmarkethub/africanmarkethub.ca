import AnalyticsStatsCard from "./analytics-stats-card";
import SalesTaxSummary from "./sales-tax-summary";
import TransactionTaxTable from "./transaction-tax-table";

const mockData = {
  totalSales: {
    value: "5.2%",
    percentage: 8.5,
    increase: true,
  },
  taxDue: {
    value: "9.73%",
    percentage: 4.5,
    increase: false,
  },
};

export default function TaxReportsTabContent() {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <AnalyticsStatsCard
          title="Total Sales Tax"
          value={mockData.totalSales.value}
          percentage={mockData.totalSales.percentage}
          increase={mockData.totalSales.increase}
          icon="/assets/icons/box.svg"
        />
        <AnalyticsStatsCard
          title="Sales Tax Due"
          value={mockData.taxDue.value}
          percentage={mockData.taxDue.percentage}
          increase={mockData.taxDue.increase}
          icon="/assets/icons/coffee.svg"
        />
      </div>
      <SalesTaxSummary />
      <TransactionTaxTable />
    </div>
  );
}
