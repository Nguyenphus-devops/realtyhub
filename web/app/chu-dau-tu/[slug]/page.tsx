import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { InvestorService } from '@/modules/developer/services/investor.service';
import InvestorDetailPage from '@/modules/developer/components/DeveloperDetailPage';

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Server component chi tiet chu dau tu - doc data tu InvestorService roi
 * truyen xuong client de tranh hydration mismatch. generateMetadata SSR.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const investor = await InvestorService.detail(slug);
  if (!investor) {
    return { title: 'Không tìm thấy chủ đầu tư' };
  }
  return {
    title: `${investor.name} | Chủ đầu tư`,
    description: `Chủ đầu tư ${investor.name} - danh sách dự án, thông tin và liên hệ trên RealtyHub.`,
  };
}

export default async function ChuDauTuDetailRoutePage({ params }: Props) {
  const { slug } = await params;
  const investor = await InvestorService.detail(slug);

  if (!investor) {
    notFound();
  }

  // Lay summary cua investor nay (projectCount, availableUnitCount...) de
  // truyen xuong client cho InvestorDetailPage hien thi stats ngay.
  const { investors } = await InvestorService.list();
  const summary = investors.find((entry) => entry.slug === slug) ?? null;

  return (
    <InvestorDetailPage
      slug={slug}
      initialInvestor={investor}
      initialSummary={summary}
    />
  );
}
