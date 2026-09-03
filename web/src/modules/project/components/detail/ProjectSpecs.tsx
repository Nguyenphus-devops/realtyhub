'use client';

import type { ProjectDetail } from '../../models/project-detail.model';
import { STATUS_LABELS } from '../../models/project.model';

/**
 * Bang thong so trong muc "Tong quan du an".
 *
 * Truoc day khoi nay la mot dai ngang cap trang nam giua hero va thanh tab.
 * Chuyen vao trong muc thi vai tro doi han: khong con la cho liec nhanh ma la
 * bang tra cuu chi tiet, nen liet ke DU ca ten du an / vi tri / chu dau tu -
 * nhung dong ma ban dai ngang phai bo di vi hero da noi roi.
 *
 * Hai cot thay vi bon: 10 dong chia het cho 2 nen khong con hang cut, va o rong
 * gap doi du cho dia chi dai khong phai xuong dong.
 */
const ProjectSpecs = ({ project }: { project: ProjectDetail }) => {
  const rows = [
    { label: 'Trạng thái', value: STATUS_LABELS[project.status], highlight: true },
    { label: 'Khu vực', value: project.regionName },
    ...project.specs.map((spec) => ({ label: spec.label, value: spec.value })),
  ];

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {/* Luoi rong doi 1px moi chieu va cha cat bot, de vien phai cot cuoi va
          vien duoi hang cuoi khong ve thanh net thua trong the. */}
      <dl className="-mb-px -mr-px grid grid-cols-1 md:grid-cols-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex gap-4 border-b border-r border-gray-100 px-5 py-4"
          >
            {/* w-44 chu khong phai w-36: chu nhan to len 12->14px nen "loai hinh
                san pham" se xuong hai dong neu giu nguyen be rong cu. */}
            <dt className="w-44 shrink-0 text-theme-sm uppercase leading-relaxed tracking-wide text-gray-500">
              {row.label}
            </dt>
            <dd
              className={`min-w-0 flex-1 text-base font-semibold leading-relaxed ${
                row.highlight ? 'text-jade-600' : 'text-navy-800'
              }`}
            >
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default ProjectSpecs;
