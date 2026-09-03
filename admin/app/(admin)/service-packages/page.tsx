import type { Metadata } from "next";
import ServicePackagesAdminPage from "@/modules/service-package/components/ServicePackagesAdminPage";

export const metadata: Metadata = {
  title: "Quản lý gói dịch vụ",
};

export default function AdminServicePackagesRoutePage() {
  return <ServicePackagesAdminPage />;
}
