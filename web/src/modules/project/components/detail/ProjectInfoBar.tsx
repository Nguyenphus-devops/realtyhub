'use client';

import type { ProjectDetail } from '../../models/project-detail.model';
import { STATUS_LABELS } from '../../models/project.model';

/**
 * Nhung thong so hero da noi roi - dua lai lan hai chi ton cho.
 * So khop theo nhan vi `specs` la mang phang khong co khoa dinh danh.
 */
const HERO_DUPLICATES = new Set(['Tên dự án', 'Vị trí', 'Chủ đầu tư']);

/**
 * Dai thong so nam ngang ngay duoi hero.
 *
 * Truoc day khoi nay la mot cot phai dinh theo man hinh. Van de: cot chi cao
 * khoang 500px trong khi trang dai gan 5000px, nen tu giua trang tro xuong mot
 * phan ba chieu ngang bo trong hoan toan. Trai ra thanh dai ngang thi vua lap
 * kin khoang do, vua dat thong so vao dung cho nguoi ta doc dau tien.
 */
const ProjectInfoBar = ({ project }: { project: ProjectDetail }) => {
  // `specs` da co "Loai hinh san pham" nen khong tu them o "Loai hinh" nua -
  // hai o cung mot gia tri chi lam loang dai thong so.
  const rows = [
    { label: 'Trạng thái', value: STATUS_LABELS[project.status], highlight: true },
    { label: 'Khu vực', value: project.regionName },
    ...project.specs
      .filter((spec) => !HERO_DUPLICATES.has(spec.label))
      .map((spec) => ({ label: spec.label, value: spec.value })),
  ];

  return (
    <section
      aria-label="Thông tin nhanh"
      className="border-b border-gray-200 bg-white shadow-card"
    >
      <div className="site-container">
        {/* Duong ke ve bang VIEN CUA TUNG O, khong dung gap-px tren nen xam:
            so o (7) khong chia het cho so cot, nen cach kia se de lo mang nen
            xam o nhung slot trong cuoi luoi - trong nhu bang bi cut.

            Luoi rong hon o hai chieu 1px va cha cat bot, de vien phai cua cot
            cuoi va vien duoi cua hang cuoi khong ve thanh net thua. */}
        <div className="overflow-hidden">
          <dl className="-mb-px -mr-px grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {rows.map((row) => (
              <div
                key={row.label}
                className="border-b border-r border-gray-100 px-4 py-3.5"
              >
                <dt className="truncate text-theme-xs uppercase tracking-wide text-gray-500">
                  {row.label}
                </dt>
                <dd
                  className={`mt-1 text-theme-sm font-semibold leading-snug ${
                    row.highlight ? 'text-jade-600' : 'text-navy-800'
                  }`}
                >
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default ProjectInfoBar;
