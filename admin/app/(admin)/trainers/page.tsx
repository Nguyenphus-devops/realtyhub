import type { Metadata } from "next";
import TrainersAdminPage from "@/modules/trainer/components/TrainersAdminPage";

export const metadata: Metadata = {
  title: "Quản lý huấn luyện viên",
};

export default function AdminTrainersRoutePage() {
  return <TrainersAdminPage />;
}
