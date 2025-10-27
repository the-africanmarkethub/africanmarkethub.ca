import { PageHeader } from "@/components/vendor/page-header";
import ReviewHistoryTable from "@/components/vendor/review-rating/ReviewHistoryTable";

export default function ReviewHistory() {
  return (
    <div className="p-8 space-y-8">
      <PageHeader title="Review History" />
      <ReviewHistoryTable />
    </div>
  );
}
