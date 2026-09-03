'use client';

import { useState } from 'react';
import { formatShortDate } from '@/common/utils/format';
import type { ProjectDetail } from '../../../models/project-detail.model';
import { MediaFrame, PlayOverlay, TabEmptyState } from '../shared';

const VISIBLE_MILESTONES = 3;

const ProgressTab = ({ project }: { project: ProjectDetail }) => {
  const [index, setIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  if (project.progress.length === 0) {
    return <TabEmptyState message="Dự án chưa cập nhật tiến độ." />;
  }

  const milestone = project.progress[Math.min(index, project.progress.length - 1)];
  const visible = isExpanded
    ? project.progress
    : project.progress.slice(0, VISIBLE_MILESTONES);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <aside>
          <h2 className="mb-4 text-base font-bold uppercase tracking-wide text-gray-900">
            Tiến độ dự án
          </h2>

          {/* Duong doc cua timeline ve bang border trai cua <ol> */}
          <ol className="space-y-2 border-l-2 border-gray-200 pl-4">
            {visible.map((item, itemIndex) => {
              const isActive = itemIndex === index;

              return (
                <li key={item.publicId} className="relative">
                  <span
                    aria-hidden
                    className={`absolute -left-5.5 top-3.5 h-2.5 w-2.5 rounded-full ring-2 ring-white ${
                      isActive ? 'bg-accent-500' : 'bg-gray-300'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setIndex(itemIndex)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`w-full rounded-md border px-3 py-2.5 text-left text-base transition ${
                      isActive
                        ? 'border-accent-400 bg-accent-50 font-semibold text-accent-600'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-brand-300 hover:text-brand-600'
                    }`}
                  >
                    {itemIndex === 0 ? item.label : formatShortDate(item.date)}
                  </button>
                </li>
              );
            })}
          </ol>

          {project.progress.length > VISIBLE_MILESTONES && (
            <button
              type="button"
              onClick={() => setIsExpanded((open) => !open)}
              className="mt-3 w-full text-center text-base font-medium text-brand-600 transition hover:text-brand-700"
            >
              {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            </button>
          )}
        </aside>

        <div>
          <a href={milestone.videoUrl} className="group block">
            <div className="relative overflow-hidden rounded-lg shadow-card">
              <MediaFrame
                seed={`${milestone.publicId}-video`}
                src={milestone.videoThumbnailUrl}
                alt={`Video tiến độ ${project.name}`}
                className="rounded-none"
              />
              <PlayOverlay label="Phát video tiến độ" />
            </div>
          </a>
        </div>
      </div>

      <section>
        <h3 className="mb-4 text-base font-bold uppercase tracking-wide text-gray-900">
          Hình ảnh tiến độ
        </h3>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {milestone.images.map((imageUrl, imageIndex) => (
            <MediaFrame
              key={`${milestone.publicId}-image-${imageIndex}`}
              seed={`${milestone.publicId}-image-${imageIndex}`}
              src={imageUrl}
              alt={`Hình ảnh tiến độ ${imageIndex + 1} - ${project.name}`}
              ratio="aspect-4/3"
              className="shadow-card"
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProgressTab;
