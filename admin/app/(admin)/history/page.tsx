import ActivityHistoryPage from "@/modules/history/components/ActivityHistoryPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title:
    "Lịch sử hoạt động",
};
export default function HistoryPage() {
  return <ActivityHistoryPage />;
}
