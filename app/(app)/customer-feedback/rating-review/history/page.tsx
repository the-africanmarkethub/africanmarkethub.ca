import { PageHeader } from "@/components/page-header";
import ReviewHistoryTable from "@/components/review-rating/ReviewHistoryTable";

export default function ReviewHistory() {
  return (
    <div className="p-8 space-y-8">
      <PageHeader title="Review History" />
      <ReviewHistoryTable />
    </div>
  );
}
