'use client';

import Link from 'next/link';
import { FiArrowRight, FiBriefcase } from 'react-icons/fi';
import PlaceholderThumb from '@/common/components/PlaceholderThumb';
import { formatNumber } from '@/common/utils/format';
import type { DeveloperSummary } from '../models/developer.model';

/**
 * Card Chu dau tu - dung cho trang /chu-dau-tu.
 *
 * Hien thi:
 *   - Logo (PlaceholderThumb deterministic tu ten) hoac Initial neu logo that
 *   - Ten chu dau tu
 *   - Tagline (mo ta ngan)
 *   - So du an + so can con hang
 *   - Nut "Xem chi tiet" di den /chu-dau-tu/:slug
 *
 * Click ca the ca di den trang chi tiet (giong ProjectCard) - khong dung
 * onClick rieng de tranh ghi de Link mac dinh cua Next.
 */
type DeveloperCardProps = {
  developer: DeveloperSummary;
};

const DeveloperCard = ({ developer }: DeveloperCardProps) => {
  const detailHref = `/chu-dau-tu/${developer.slug}`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card transition hover:border-brand-200 hover:shadow-card-hover">
      {/* ── Logo ─────────────────────────────────────────────────────── */}
      <Link
        href={detailHref}
        aria-label={`Xem chi tiết chủ đầu tư ${developer.name}`}
        className="group relative block aspect-16/10 w-full overflow-hidden"
      >
        <PlaceholderThumb
          seed={developer.publicId}
          label=""
          className="transition duration-500 group-hover:scale-105"
        />

        {/* Lop phu toi tu duoi de chu tren anh luon doc duoc */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/65 via-black/15 to-transparent"
        />

        {/* Initial can giua (du phong khi placeholder khong can label) */}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-4xl font-bold uppercase tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          {developer.name.charAt(0)}
        </span>

        {/* Ten CDT (duoi day anh, goc phai) */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-end gap-2 px-4 pb-3 text-white">
          <span className="rounded bg-black/40 px-2 py-1 text-theme-xs font-bold uppercase tracking-wide backdrop-blur-sm">
            {developer.name}
          </span>
        </span>
      </Link>

      {/* ── Noi dung ────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Ten (link chinh, nho them de SEO va de copy/paste) */}
        <div>
          <Link
            href={detailHref}
            className="line-clamp-2 text-base font-bold uppercase tracking-wide text-gray-900 transition hover:text-brand-600"
          >
            {developer.name}
          </Link>
          <p className="mt-1.5 line-clamp-2 text-theme-xs text-gray-500">
            {developer.tagline}
          </p>
        </div>

        {/* Thong so ngan: so du an + so can con hang */}
        <dl className="grid grid-cols-2 gap-2 rounded-lg border border-gray-100 bg-gray-25 p-3 text-center">
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Dự án
            </dt>
            <dd className="mt-0.5 text-theme-sm font-bold text-gray-900">
              {developer.projectCount}
            </dd>
          </div>
          <div className="border-l border-gray-100">
            <dt className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Còn hàng
            </dt>
            <dd className="mt-0.5 text-theme-sm font-bold text-brand-600">
              {formatNumber(developer.availableUnitCount)}
              <span className="ml-0.5 text-[10px] font-medium text-gray-400">căn</span>
            </dd>
          </div>
        </dl>

        {/* Nut bam - day xuong day the */}
        <div className="mt-auto pt-1">
          <Link
            href={detailHref}
            aria-label={`Xem chi tiết chủ đầu tư ${developer.name}`}
            className="flex w-full items-center justify-center gap-1.5 rounded-md bg-brand-500 px-4 py-2.5 text-theme-sm font-semibold text-white transition hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            <FiBriefcase aria-hidden className="text-base" />
            Xem chi tiết
            <FiArrowRight aria-hidden className="text-base" />
          </Link>
        </div>
      </div>
    </article>
  );
};

export default DeveloperCard;
