'use client';

import { FiAlertCircle, FiExternalLink } from 'react-icons/fi';
import type { ProjectDetail } from '../../../models/project-detail.model';
import { TabEmptyState } from '../shared';

const DocumentsTab = ({ project }: { project: ProjectDetail }) => {
  if (project.documents.length === 0) {
    return <TabEmptyState message="Dự án chưa có tài liệu." />;
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900">
          Tài liệu dự án
        </h2>
        <span aria-hidden className="mx-auto mt-2 block h-1 w-16 rounded-full bg-gold-400" />
      </div>

      {/* gap-px tren nen xam tao duong ke 1px giua cac o ma khong can border le */}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-gray-200 bg-gray-100 shadow-card lg:grid-cols-3">
        {project.documents.map((document) => (
          <a
            key={document.publicId}
            href={document.url}
            className="group flex items-center gap-3 bg-white px-4 py-4 transition hover:bg-gray-25"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gold-400 text-base font-bold text-jade-800">
              {document.order}
            </span>

            <span className="min-w-0 flex-1 truncate text-base font-semibold uppercase tracking-wide text-gray-800 transition group-hover:text-brand-600">
              {document.name}
            </span>

            <FiExternalLink
              aria-hidden
              className="shrink-0 text-gray-400 transition group-hover:text-brand-600"
            />
          </a>
        ))}
      </div>

      <p className="mt-5 flex items-start gap-2 rounded-lg border-l-4 border-gold-400 bg-gold-200/25 px-4 py-3 text-base text-gray-700">
        <FiAlertCircle aria-hidden className="mt-0.5 shrink-0 text-gold-500" />
        <span>
          <strong className="font-semibold">Lưu ý:</strong> Thông tin tài liệu dự án ban đầu
          có thể được cập nhật, chỉnh sửa theo từng đợt mở bán.
        </span>
      </p>
    </div>
  );
};

export default DocumentsTab;
