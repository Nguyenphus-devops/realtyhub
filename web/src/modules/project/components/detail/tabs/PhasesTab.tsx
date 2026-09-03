'use client';

import Link from 'next/link';
import { HiOutlineBuildingOffice2, HiOutlineSquares2X2 } from 'react-icons/hi2';
import { FiArrowRight, FiEye, FiMaximize2, FiTag } from 'react-icons/fi';
import { formatNumber, formatPriceRange } from '@/common/utils/format';
import type { ProjectDetail, ProjectPhase } from '../../../models/project-detail.model';
import { MediaFrame, TabEmptyState } from '../shared';


const specValue = (phase: ProjectPhase, label: string) =>
  phase.specs.find((spec) => spec.label === label)?.value ?? '';

const compactRange = (value: string) =>
  value.replace(/^từ\s+(\S+)\s+đến\s+(\S+)\s+/i, '$1 - $2 ');

/** Mot o so lieu nho o hang duoi cung: icon + nhan ben tren, gia tri ben duoi */
const PhaseFact = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="min-w-0 flex-1 px-3 first:pl-0 last:pr-0">
    <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
      {icon}
      {label}
    </p>
    <p className="mt-0.5 truncate text-base font-bold text-gray-800">{value}</p>
  </div>
);

const PhasesTab = ({ project }: { project: ProjectDetail }) => {
  if (project.phases.length === 0) {
    return <TabEmptyState message="Dự án chưa công bố thông tin phân khu." />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {project.phases.map((phase) => (
        <article key={phase.publicId}>
          {/* Ca the la mot lien ket duy nhat: truoc day ten va anh la hai the
              <a> rieng tro cung mot noi, doc bang trinh doc man hinh se nghe
              lap hai lan. */}
          <Link
            href={`/gio-hang/${project.slug}/phan-khu/${phase.slug}`}
            aria-label={`Xem chi tiết phân khu ${phase.name}`}
            className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <div className="relative overflow-hidden">
              <div className="transition duration-500 group-hover:scale-105">
                <MediaFrame
                  seed={phase.publicId}
                  src={phase.imageUrl}
                  alt={`Phối cảnh phân khu ${phase.name}`}
                  ratio="aspect-4/3"
                  className="rounded-none"
                />
              </div>

              {/* Nen toi luon co o day de ten phan khu doc duoc tren moi anh */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-linear-to-t from-black/75 via-black/25 to-transparent"
              />

              <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                <HiOutlineSquares2X2 aria-hidden />
                Phân khu
              </span>

              <h3 className="absolute inset-x-4 bottom-3 truncate text-xl font-bold uppercase tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                {phase.name}
              </h3>

              {/* Lop phu chi hien khi ro chuot. Tailwind v4 da boc san bien the
                  `hover:` trong @media (hover: hover), nen tren dien thoai lop
                  nay khong bao gio bat - khong lo dinh trang thai hover khi cham. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 flex items-center justify-center bg-navy-900/45 opacity-0 backdrop-blur-xs transition duration-300 group-hover:opacity-100"
              >
                <span className="flex translate-y-2 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-base font-semibold text-navy-800 shadow-card-hover transition duration-300 group-hover:translate-y-0">
                  <FiEye aria-hidden />
                  Xem chi tiết
                  <FiArrowRight aria-hidden className="transition group-hover:translate-x-0.5" />
                </span>
              </span>
            </div>

            <div className="space-y-3.5 p-4">
              {/* Cau dan cua phan khu - thu duy nhat phan biet bon the voi nhau
                  khi so lieu sinh ra gan giong het nhau. */}
              <p className="line-clamp-2 min-h-10 text-theme-sm leading-snug text-gray-500">
                {phase.headline}
              </p>

              {/* Gia la thong tin nguoi xem tim dau tien nen tach han ra mot
                  khoi rieng co nen, thay vi xep ngang hang voi cac so khac. */}
              <div className="rounded-xl border border-brand-100 bg-brand-25 px-3.5 py-2.5">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-brand-500">
                  <FiTag aria-hidden />
                  Khoảng giá
                </p>
                <p className="mt-0.5 truncate text-lg font-bold leading-tight text-brand-700">
                  {formatPriceRange(phase.priceFrom, phase.priceTo)}
                </p>
              </div>

              <div className="flex divide-x divide-gray-100 border-t border-gray-100 pt-3">
                <PhaseFact
                  icon={<HiOutlineBuildingOffice2 aria-hidden className="text-gold-500" />}
                  label="Tổng căn"
                  value={formatNumber(phase.totalUnits)}
                />
                <PhaseFact
                  icon={<FiMaximize2 aria-hidden className="text-jade-600" />}
                  label="Diện tích"
                  value={compactRange(specValue(phase, 'Diện tích căn')) || 'Đang cập nhật'}
                />
              </div>

              {/* Tren dien thoai lop phu hover khong bao gio hien, nen dat o day
                  mot dong thay the de nguoi dung biet ca the bam duoc. */}
              <span className="hidden items-center justify-center gap-1.5 border-t border-gray-100 pt-3 text-base font-semibold text-brand-600 no-hover:flex">
                <FiEye aria-hidden />
                Xem chi tiết
                <FiArrowRight aria-hidden />
              </span>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
};

export default PhasesTab;
