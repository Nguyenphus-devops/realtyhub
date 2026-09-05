'use client';

import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { formatNumber } from '@/common/utils/format';
import { useInvestorList } from '../hooks/useInvestors';
import type { InvestorSummary } from '../models/investor.model';

/**
 * Trang /chu-dau-tu - tong hop 25 chu dau tu chinh thuc tren RealtyHub.
 *
 * Dung CHUNG data voi section "CAC CHU DAU TU" tren trang chu (via
 * InvestorService - single source of truth). Server component doc data roi
 * truyen xuong qua `initialInvestors` de HTML tra ve co 25 card ngay.
 *
 * Moi card la 1 logo + ten + 2 thong so (so du an, so can con hang). Click
 * chuyen den /chu-dau-tu/[slug] - cung route voi section tren trang chu.
 */

type InvestorListPageProps = {
  initialInvestors?: InvestorSummary[];
};

const GRID_CLASS = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

const CardSkeleton = () => (
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card">
    <div className="aspect-16/10 w-full animate-pulse bg-gray-100" />
    <div className="space-y-3 p-5">
      <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
      <div className="h-12 animate-pulse rounded-lg bg-gray-100" />
    </div>
  </div>
);

const InvestorListPage = ({ initialInvestors }: InvestorListPageProps) => {
  const listQuery = useInvestorList();
  // Lay tu SSR initial data; fallback neu hook chua co (lucid khi chuyen trang).
  const investors = listQuery.data?.investors ?? initialInvestors ?? [];
  const total = investors.length;

  return (
    <div className="site-container py-8">
      {/* ── Tieu de + mo ta ────────────────────────────────────────────── */}
      <header className="mb-8">
        <h1 className="text-center text-3xl font-bold uppercase tracking-wide text-gray-900 md:text-4xl">
          Danh sách Chủ đầu tư
        </h1>
        {/* <p className="mx-auto mt-3 max-w-2xl text-center text-theme-sm leading-relaxed text-gray-600">
          Danh sách các chủ đầu tư đang có dự án trên RealtyHub. Mỗi chủ đầu tư
          hiển thị số dự án, số căn còn hàng, và danh sách các dự án đang mở bán.
        </p> */}
      </header>

      {/* ── So lieu tong hop ──────────────────────────────────────────── */}
      <div className="mb-4 flex min-h-5 items-center justify-between text-theme-sm text-gray-500">
        {listQuery.isLoading && !initialInvestors ? (
          <span className="h-4 w-32 animate-pulse rounded bg-gray-100" />
        ) : (
          <span aria-live="polite">
            Có <strong className="text-gray-800">{total}</strong> chủ đầu tư trên hệ thống
          </span>
        )}
        {listQuery.isFetching && !listQuery.isLoading && (
          <span className="text-gray-400">Đang cập nhật...</span>
        )}
      </div>

      {/* ── Luoi chu dau tu ───────────────────────────────────────────── */}
      {listQuery.isError ? (
        <div className="rounded-xl border border-error-500/30 bg-error-50 p-8 text-center">
          <p className="mb-4 text-theme-sm text-error-600">
            Không tải được danh sách chủ đầu tư.
          </p>
          <button
            type="button"
            onClick={() => listQuery.refetch()}
            className="rounded-md bg-brand-500 px-4 py-2 text-theme-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Thử lại
          </button>
        </div>
      ) : listQuery.isLoading && !initialInvestors ? (
        <div className={GRID_CLASS}>
          {Array.from({ length: 8 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      ) : investors.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <p className="text-theme-sm text-gray-500">Chưa có chủ đầu tư nào.</p>
        </div>
      ) : (
        <div
          className={`${GRID_CLASS} transition-opacity duration-200 ${
            listQuery.isFetching ? 'opacity-70' : 'opacity-100'
          }`}
        >
          {investors.map((investor) => (
            <InvestorCard
              key={investor.slug}
              slug={investor.slug}
              name={investor.name}
              logo={investor.logo}
              projectCount={investor.projectCount}
              availableUnitCount={investor.availableUnitCount}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/** Card danh sach: logo + ten + 2 stats. Click -> /chu-dau-tu/[slug]. */
type InvestorCardProps = {
  slug: string;
  name: string;
  logo: string;
  projectCount: number;
  availableUnitCount: number;
};

const InvestorCard = ({
  slug,
  name,
  logo,
  projectCount,
  availableUnitCount,
}: InvestorCardProps) => {
  const detailHref = `/chu-dau-tu/${slug}`;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card transition hover:border-brand-200 hover:shadow-card-hover">
      <Link
        href={detailHref}
        aria-label={`Xem chi tiết chủ đầu tư ${name}`}
        className="group relative block aspect-16/10 w-full overflow-hidden bg-gray-50"
      >
        <div className="flex h-full items-center justify-center px-6 py-4">
          <img
            src={logo}
            alt={name}
            loading="lazy"
            width={256}
            height={160}
            className="max-h-full w-auto max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link
          href={detailHref}
          className="line-clamp-2 text-base font-bold uppercase tracking-wide text-gray-900 transition hover:text-brand-600"
        >
          {name}
        </Link>

        <dl className="grid grid-cols-2 gap-2 rounded-lg border border-gray-100 bg-gray-25 p-3 text-center">
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Dự án
            </dt>
            <dd className="mt-0.5 text-theme-sm font-bold text-gray-900">
              {projectCount}
            </dd>
          </div>
          <div className="border-l border-gray-100">
            <dt className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Còn hàng
            </dt>
            <dd className="mt-0.5 text-theme-sm font-bold text-brand-600">
              {formatNumber(availableUnitCount)}
              <span className="ml-0.5 text-[10px] font-medium text-gray-400">căn</span>
            </dd>
          </div>
        </dl>

        <div className="mt-auto pt-1">
          <Link
            href={detailHref}
            aria-label={`Xem chi tiết chủ đầu tư ${name}`}
            className="flex w-full items-center justify-center gap-1.5 rounded-md bg-brand-500 px-4 py-2.5 text-theme-sm font-semibold text-white transition hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Xem chi tiết
            <FiArrowRight aria-hidden className="text-base" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default InvestorListPage;
