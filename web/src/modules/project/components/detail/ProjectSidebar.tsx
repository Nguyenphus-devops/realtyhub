'use client';

import { FiPhone } from 'react-icons/fi';
import type { ProjectDetail } from '../../models/project-detail.model';
import { PROPERTY_TYPE_LABELS, STATUS_LABELS } from '../../models/project.model';

/** So dong thong tin nhanh toi da - dai hon thi cot phai vuot qua man hinh */
const MAX_SPEC_ROWS = 6;

const telHref = (phone: string) => `tel:${phone.replace(/\s/g, '')}`;

/**
 * Cot phai dinh theo man hinh tren trang chi tiet du an.
 *
 * Thu tu: THONG TIN NHANH truoc, LIEN HE TU VAN sau. Nguoi xem can nam thong so
 * du an truoc khi quyet dinh goi dien, nen dat khoi tra cuu len tren khoi hanh
 * dong. Ca hai deu nam trong vung dinh nen nut goi van luon trong tam mat.
 *
 * Tab Quy can / Mat bang / Anh 360 khong dung cot nay - xem ProjectDetailPage.
 */
const ProjectSidebar = ({ project }: { project: ProjectDetail }) => (
  <aside className="space-y-5 lg:sticky lg:top-32">
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card">
      {/* Cung mot lop `brand-gradient` voi the "Lien he tu van" ben duoi, de hai
          the doc ra la mot cap chu khong phai hai khoi roi rac */}
      <h2 className="brand-gradient px-5 py-3.5 text-theme-sm font-bold uppercase tracking-wide text-white">
        Thông tin nhanh
      </h2>

      <dl className="divide-y divide-gray-100">
        <div className="flex items-baseline justify-between gap-3 px-5 py-3">
          <dt className="shrink-0 text-theme-xs uppercase tracking-wide text-gray-500">
            Trạng thái
          </dt>
          <dd className="text-right text-theme-sm font-semibold text-jade-600">
            {STATUS_LABELS[project.status]}
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-3 px-5 py-3">
          <dt className="shrink-0 text-theme-xs uppercase tracking-wide text-gray-500">
            Loại hình
          </dt>
          <dd className="text-right text-theme-sm font-medium text-gray-700">
            {PROPERTY_TYPE_LABELS[project.propertyType]}
          </dd>
        </div>

        <div className="flex items-baseline justify-between gap-3 px-5 py-3">
          <dt className="shrink-0 text-theme-xs uppercase tracking-wide text-gray-500">
            Khu vực
          </dt>
          <dd className="text-right text-theme-sm font-medium text-gray-700">
            {project.regionName}
          </dd>
        </div>

        {project.specs.slice(0, MAX_SPEC_ROWS).map((spec) => (
          <div
            key={spec.label}
            className="flex items-baseline justify-between gap-3 px-5 py-3"
          >
            <dt className="shrink-0 text-theme-xs uppercase tracking-wide text-gray-500">
              {spec.label}
            </dt>
            <dd className="text-right text-theme-sm font-medium text-gray-700">
              {spec.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>

    {project.consultants.length > 0 && (
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card">
        <h2 className="brand-gradient px-5 py-3.5 text-theme-sm font-bold uppercase tracking-wide text-white">
          Liên hệ tư vấn
        </h2>

        <ul className="divide-y divide-gray-100">
          {project.consultants.map((consultant) => (
            <li key={consultant.publicId} className="p-4">
              <p className="text-theme-xs font-semibold uppercase tracking-wide text-accent-600">
                {consultant.role}
              </p>
              <p className="mt-0.5 text-theme-sm font-medium text-gray-700">
                {consultant.name}
              </p>

              <a
                href={telHref(consultant.phone)}
                className="mt-3 flex items-center justify-center gap-2 rounded-full bg-jade-600 px-4 py-2.5 text-theme-sm font-bold text-white transition duration-200 hover:scale-105 hover:bg-jade-500 active:scale-95"
              >
                <FiPhone aria-hidden />
                {consultant.phone}
              </a>
            </li>
          ))}
        </ul>
      </section>
    )}
  </aside>
);

export default ProjectSidebar;
