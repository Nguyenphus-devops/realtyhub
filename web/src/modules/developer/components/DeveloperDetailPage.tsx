'use client';

import Link from 'next/link';
import { FiArrowRight, FiBriefcase } from 'react-icons/fi';
import { formatNumber } from '@/common/utils/format';
import { STATUS_LABELS } from '@/modules/project/models/project.model';
import type { Project, ProjectStatus } from '@/modules/project/models/project.model';
import { useInvestorDetail } from '../hooks/useInvestors';
import { InvestorService } from '../services/investor.service';
import type { Investor, InvestorSummary } from '../models/investor.model';

/**
 * Trang /chu-dau-tu/[slug] - chi tiet mot chu dau tu.
 *
 * Single source of truth: InvestorService (25 records, dong bo voi
 * section "CAC CHU DAU TU" tren trang chu va trang /chu-dau-tu list).
 *
 * Server component route doc data roi truyen xuong qua props de tranh
 * hydration mismatch. Client chi refetch khi can.
 *
 * Cac section:
 *   1. Hero: logo that (URL tu realtyhub.com.vn) + ten + 3 stats
 *   2. Thong tin chinh (so du an, tong so can/san pham)
 *   3. CTA sang /quy-can loc theo chu dau tu
 *   4. Danh sach cac du an thuoc chu dau tu
 */

type InvestorDetailPageProps = {
  slug: string;
  initialInvestor?: Investor | null;
  initialSummary?: InvestorSummary | null;
};

const InvestorDetailPage = ({
  slug,
  initialInvestor,
  initialSummary,
}: InvestorDetailPageProps) => {
  // Hook tra ve investor ngay tu query cache (initialData), chi refetch
  // khi stale. Server truyen initialInvestor roi nen luon co data.
  const detailQuery = useInvestorDetail(slug, initialInvestor);
  const investor = detailQuery.data ?? initialInvestor;

  if (!investor) {
    return (
      <div className="site-container py-16 text-center">
        <p className="text-theme-sm text-gray-500">Đang tải...</p>
      </div>
    );
  }

  // Lay project list dong bo (projectsSync) - khong can them query.
  const projects: Project[] = InvestorService.projectsSync(slug);

  const sortedProjects: Project[] = [...projects].sort((a, b) => {
    const order: Record<ProjectStatus, number> = {
      'dang-mo-ban': 0,
      'sap-mo-ban': 1,
      'da-ban-giao': 2,
    };
    return order[a.status] - order[b.status];
  });

  return (
    <div className="bg-white">
      {/* ── 1. HERO ─────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden bg-navy-900 pb-24 pt-12 text-white md:pb-28 md:pt-16">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-linear-to-br from-navy-900/95 via-navy-900/85 to-brand-900/80" />
        </div>

        <div className="site-container">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            {/* Logo that tu realtyhub.com.vn - khoi logo lon */}
            <div className="lg:col-span-4">
              <div className="relative mx-auto flex aspect-square w-full max-w-xs items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-white p-6 shadow-card-hover">
                <img
                  src={investor.logo}
                  alt={investor.name}
                  width={256}
                  height={256}
                  className="max-h-full w-auto max-w-full object-contain"
                />
              </div>
            </div>

            {/* Thong tin chinh */}
            <div className="min-w-0 lg:col-span-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-theme-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
                <FiBriefcase aria-hidden className="text-sm" />
                Chủ đầu tư
              </span>

              <h1 className="mt-4 text-3xl font-bold uppercase leading-tight tracking-tight md:text-5xl">
                {investor.name}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
                {investor.name} là một trong những chủ đầu tư đang có dự án trên
                RealtyHub. Xem các dự án đang mở bán, bảng giá và thông tin pháp lý
                bên dưới.
              </p>

              {/* 3 chi so nhanh */}
              <dl className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
                <Stat
                  label="Dự án"
                  value={formatNumber(
                    initialSummary?.projectCount ?? projects.length,
                  )}
                  suffix="dự án"
                />
                <Stat
                  label="Đang mở bán"
                  value={formatNumber(
                    initialSummary?.openingProjectCount ??
                      projects.filter((p) => p.status === 'dang-mo-ban').length,
                  )}
                  suffix="mở bán"
                  highlight
                />
                <Stat
                  label="Căn còn hàng"
                  value={formatNumber(initialSummary?.availableUnitCount ?? 0)}
                  suffix="căn"
                  highlight
                />
              </dl>

              <Link
                href={`/quy-can?cdt=${encodeURIComponent(slug)}`}
                className="group mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-theme-sm font-semibold text-white shadow-card-hover transition hover:bg-brand-600"
              >
                Xem căn hộ đang bán của {investor.name}
                <FiArrowRight
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. DU AN THUOC CHU DAU TU ──────────────────────────────────── */}
      <section className="site-container py-16 md:py-20">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-theme-xs font-bold uppercase tracking-[0.22em] text-brand-600">
              <span aria-hidden className="h-px w-8 bg-current opacity-60" />
              Danh mục
            </span>
            <h2 className="mt-4 text-2xl font-bold uppercase leading-tight tracking-tight text-navy-800 md:text-3xl">
              Dự án thuộc {investor.name}
              <span className="ml-2 align-middle text-lg font-bold text-gray-400">
                ({projects.length})
              </span>
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-600">
              Toàn bộ dự án của {investor.name} đang được giới thiệu trên
              RealtyHub. Click vào từng thẻ để xem chi tiết, bảng giá và pháp lý.
            </p>
          </div>

          {projects.length > 0 && (
            <Link
              href={`/du-an?cdt=${encodeURIComponent(slug)}`}
              className="group inline-flex shrink-0 items-center gap-2 text-theme-sm font-semibold text-brand-600 transition hover:text-brand-700"
            >
              Lọc dự án của {investor.name} trong trang /du-an
              <FiArrowRight
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          )}
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-theme-sm text-gray-500">
              Hiện chưa có dự án nào của {investor.name} trên hệ thống.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sortedProjects.map((project) => (
              <article
                key={project.publicId}
                className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-card transition hover:border-brand-200 hover:shadow-card-hover"
              >
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/du-an/${project.slug}`}
                    className="line-clamp-2 text-base font-bold uppercase tracking-wide text-gray-900 transition hover:text-brand-600"
                  >
                    {project.name}
                  </Link>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                      project.status === 'dang-mo-ban'
                        ? 'bg-success-50 text-success-700'
                        : project.status === 'sap-mo-ban'
                          ? 'bg-warning-50 text-warning-700'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {STATUS_LABELS[project.status]}
                  </span>
                </div>

                <p className="line-clamp-2 text-theme-xs leading-relaxed text-gray-600">
                  {project.tagline}
                </p>

                <Link
                  href={`/du-an/${project.slug}`}
                  className="mt-2 inline-flex items-center gap-1.5 self-start text-theme-sm font-semibold text-brand-600 transition hover:text-brand-700"
                >
                  Xem chi tiết dự án
                  <FiArrowRight
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

/** Vai thanh KPI nho trong hero (compact, co highlight) */
const Stat = ({
  label,
  value,
  suffix,
  highlight,
}: {
  label: string;
  value: string;
  suffix?: string;
  highlight?: boolean;
}) => (
  <div
    className={`rounded-xl border p-5 backdrop-blur-sm transition ${
      highlight
        ? 'border-brand-400/50 bg-brand-500/15'
        : 'border-white/20 bg-white/5'
    }`}
  >
    <dt className="text-theme-xs uppercase tracking-[0.18em] text-white/65">
      {label}
    </dt>
    <dd className="mt-2 flex items-baseline gap-1">
      <span className="text-2xl font-bold leading-none text-white md:text-3xl">
        {value}
      </span>
      {suffix && (
        <span className="text-theme-xs font-medium text-white/65">{suffix}</span>
      )}
    </dd>
  </div>
);

export default InvestorDetailPage;
