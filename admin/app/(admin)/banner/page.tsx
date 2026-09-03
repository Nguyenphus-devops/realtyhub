import BannersAdminPage from "@/modules/banner/components/BannersAdminPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Banner & hero",
};

export default function AdminBannersRoutePage() {
  return <BannersAdminPage />;
}
