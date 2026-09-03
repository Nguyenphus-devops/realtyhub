import LeadsAdminPage from "@/modules/leads/components/LeadsAdminPage";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Quản lý Leads",
};
export default function AdminLeadsPage() {
  return <LeadsAdminPage />;
}
