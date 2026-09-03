'use client';

import type { ProjectDetail } from '../../../models/project-detail.model';
import { MediaFrame, PlayOverlay, TabEmptyState } from '../shared';

const TrainingTab = ({ project }: { project: ProjectDetail }) => {
  if (project.trainingVideos.length === 0) {
    return <TabEmptyState message="Dự án chưa có tài liệu đào tạo." />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {project.trainingVideos.map((video) => (
        <article key={video.publicId}>
          <a href={video.videoUrl} className="group block">
            <div className="relative overflow-hidden rounded-lg shadow-card transition group-hover:shadow-card-hover">
              <MediaFrame
                seed={video.publicId}
                src={video.thumbnailUrl}
                alt={video.title}
                className="rounded-none"
              />
              <PlayOverlay label={`Phát video: ${video.title}`} />
            </div>

            <h3 className="mt-3 text-center text-base font-semibold uppercase leading-snug tracking-wide text-gray-800 transition group-hover:text-brand-600">
              {video.title}
            </h3>
          </a>
        </article>
      ))}
    </div>
  );
};

export default TrainingTab;
