import type { Metadata } from "next";
import FeedbacksAdminPage from "@/modules/feedback/components/FeedbacksAdminPage";

export const metadata: Metadata = {
  title: "Quản lý ý kiến hội viên",
};

export default function AdminFeedbacksRoutePage() {
  return <FeedbacksAdminPage />;
}
