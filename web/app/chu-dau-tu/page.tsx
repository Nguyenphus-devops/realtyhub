import type { Metadata } from 'next';
import InvestorListPage from '@/modules/developer/components/DeveloperListPage';
import { InvestorService } from '@/modules/developer/services/investor.service';

export const metadata: Metadata = {
  title: 'Chủ đầu tư',
  description:
    'Danh sách các chủ đầu tư đang có dự án trên RealtyHub. Mỗi chủ đầu tư hiển thị số dự án, số căn còn hàng và liên kết tới chi tiết.',
};

/**
 * Trang chu dau tu - server component doc 25 Investor (dong bo voi section
 * "CAC CHU DAU TU" tren trang chu) roi truyen xuong client de HTML SSR co
 * noi dung ngay.
 *
 * Source data: InvestorService (single source of truth).
 */
export default async function ChuDauTuRoutePage() {
  const data = await InvestorService.list();
  return <InvestorListPage initialInvestors={data.investors} />;
}
