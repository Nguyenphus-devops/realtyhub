'use client';

import Link from 'next/link';
import { FiHome, FiMapPin } from 'react-icons/fi';
import PlaceholderThumb from '@/common/components/PlaceholderThumb';
import {
  formatBillion,
  formatMillionPerSqm,
  formatNumber,
} from '@/common/utils/format';
import { SEGMENT_BADGE_LABELS } from '@/modules/project/models/project.model';
import {
  UNIT_STATUS_LABELS,
  type UnitWithProject,
} from '@/modules/project/models/project-detail.model';

/**
 * Card san pham/căn - dung cho section "San pham noi bat" tren trang chu.
 *
 * Click vao the di chuyen den tab "Quy can" cua du an tuong ung (trang
 * detail co san). Khong tao route moi vi he thong chua co trang chi tiet
 * can rieng.
 *
 * Thong tin hien thi (giong UnitsTab + them metadata du an):
 *   - Anh bia (PlaceholderThumb sinh gradient tu ma can - chua co anh that)
 *   - Nhan trang thai "Con hang" + nhan HOT neu du an isHot
 *   - Ma can + loai hinh
 *   - Ten du an + chu dau tu
 *   - Phan khu
 *   - Dien tich dat / xay dung / huong
 *   - 3 gia: niem yet, thanh toan som (TTS), tri tue do (TTTD)
 *   - Nut "Xem chi tiet can" mo tab Quy can cua du an
 */
type UnitCardProps = {
  unit: UnitWithProject;
};

const UnitCard = ({ unit }: UnitCardProps) => {
  const detailHref = `/du-an/${unit.projectSlug}?tab=quy-can`;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card transition hover:shadow-card-hover">
      {/* ── Anh bia ─────────────────────────────────────────────────── */}
      <Link
        href={detailHref}
        aria-label={`Xem căn ${unit.code} - dự án ${unit.projectName}`}
        className="group relative block aspect-16/10 w-full overflow-hidden"
      >
        <PlaceholderThumb
          seed={unit.publicId}
          label={unit.code}
          className="transition duration-500 group-hover:scale-105"
        />

        {/* Lop phu toi tu duoi len de cac nhan tren anh luon doc duoc */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent"
        />

        {/* Nhan HOT (tren cung ben trai) */}
        {unit.projectIsHot && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-error-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
            HOT
          </span>
        )}

        {/* Nhan trang thai (tren cung ben phai) */}
        <span className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-full bg-success-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-[0_2px_8px_rgba(0,0,0,0.35)]">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-white" />
          {UNIT_STATUS_LABELS[unit.status]}
        </span>

        {/* Ma can + loai hinh (duoi day anh) */}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 px-4 pb-3 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
          <span className="rounded bg-error-500/95 px-2 py-1 text-theme-xs font-bold uppercase tracking-wide">
            {unit.code}
          </span>
          <span className="text-theme-xs font-semibold uppercase tracking-wide">
            {unit.propertyTypeLabel}
          </span>
        </span>
      </Link>

      {/* ── Noi dung ────────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Ten du an */}
        <div>
          <Link
            href={`/du-an/${unit.projectSlug}`}
            className="line-clamp-2 text-base font-bold uppercase tracking-wide text-gray-900 transition hover:text-brand-600"
          >
            {unit.projectName}
          </Link>
          <p className="mt-1 flex items-center gap-1 text-theme-xs text-gray-500">
            <FiHome aria-hidden className="shrink-0" />
            <span className="truncate">{unit.developerName}</span>
            <span aria-hidden className="mx-1 text-gray-300">
              ·
            </span>
            <FiMapPin aria-hidden className="shrink-0" />
            <span className="truncate uppercase">{unit.phaseName}</span>
          </p>
        </div>

        {/* Thong so ngan: DT dat / XD / Huong */}
        <dl className="grid grid-cols-3 gap-2 rounded-lg border border-gray-100 bg-gray-25 p-3 text-center">
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Đất
            </dt>
            <dd className="mt-0.5 text-theme-sm font-bold text-gray-900">
              {formatNumber(unit.landArea)}
              <span className="ml-0.5 text-[10px] font-medium text-gray-400">m²</span>
            </dd>
          </div>
          <div className="border-x border-gray-100">
            <dt className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Xây dựng
            </dt>
            <dd className="mt-0.5 text-theme-sm font-bold text-gray-900">
              {formatNumber(unit.buildArea)}
              <span className="ml-0.5 text-[10px] font-medium text-gray-400">m²</span>
            </dd>
          </div>
          <div>
            <dt className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Hướng
            </dt>
            <dd className="mt-0.5 text-theme-sm font-bold uppercase text-gray-900">
              {unit.direction}
            </dd>
          </div>
        </dl>

        {/* Bang gia: niem yet, TTS, TTTĐ */}
        <div className="space-y-1.5">
          <div className="flex items-baseline justify-between gap-2 text-theme-xs">
            <span className="text-gray-500">Giá niêm yết</span>
            <span className="font-bold text-gray-900">
              {formatBillion(unit.listedPrice)}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2 text-theme-xs">
            <span className="text-gray-500">Giá TTS</span>
            <span className="font-semibold text-brand-600">
              {formatBillion(unit.netPrice)}
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-2 border-t border-dashed border-gray-100 pt-1.5 text-theme-xs">
            <span className="text-gray-500">Giá TTTĐ</span>
            <span className="font-semibold text-gray-700">
              {formatMillionPerSqm(unit.unitPrice)}
            </span>
          </div>
        </div>

        {/* Phan khuc (nhan nho, khong noi bat - chi de biet) */}
        <span className="self-start rounded-full bg-gray-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
          {SEGMENT_BADGE_LABELS[unit.segment]}
        </span>

        {/* Nut bam - day xuong day the */}
        <div className="mt-auto pt-1">
          <Link
            href={detailHref}
            aria-label={`Xem chi tiết căn ${unit.code}`}
            className="flex w-full items-center justify-center gap-1.5 rounded-md bg-brand-500 px-4 py-2.5 text-theme-sm font-semibold text-white transition hover:bg-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
          >
            Xem chi tiết căn
          </Link>
        </div>
      </div>
    </article>
  );
};

export default UnitCard;
