import type { Metadata } from "next";
import { EcommerceMetrics } from "@/common/components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "@/common/components/ecommerce/MonthlySalesChart";

export const metadata: Metadata = {
  title:
    "Trang quản trị",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 space-y-6">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>
    </div>
  );
}
