'use client';

import type { ProjectPhase } from '../../../models/project-detail.model';
import { MediaFrame } from '../../detail/shared';

const PhaseOverviewTab = ({ phase }: { phase: ProjectPhase }) => (
  <div>
    <h2 className="mb-4 text-base font-bold uppercase tracking-wide text-gray-900">
      Thông tin chung:
    </h2>

    {/* Hai cot tren man hinh rong, mot cot tren dien thoai */}
    <dl className="mb-10 grid grid-cols-1 gap-x-12 sm:grid-cols-2">
      {phase.specs.map((spec) => (
        <div
          key={spec.label}
          className="flex items-baseline justify-between gap-4 border-b border-gray-100 py-2.5"
        >
          <dt className="shrink-0 text-theme-sm text-gray-500">{spec.label}:</dt>
          <dd className="text-right text-theme-sm font-semibold text-gray-900">
            {spec.value}
          </dd>
        </div>
      ))}
    </dl>

    <h3 className="mb-3 text-lg font-bold leading-snug text-gray-900">{phase.headline}</h3>

    <p className="mb-8 text-theme-sm leading-relaxed text-gray-600">
      <strong className="font-semibold text-gray-900">Phân khu {phase.name}</strong>{' '}
      {phase.description}
    </p>

    <div className="space-y-6">
      {phase.masterPlanImages.map((sheet) => (
        <figure key={sheet.publicId}>
          <div className="rounded-xl bg-jade-600 p-2 shadow-panel sm:p-3">
            {/* Ban ve mat bang phai xem tron - xem chu thich o OverviewTab */}
            <MediaFrame
              seed={sheet.publicId}
              src={sheet.imageUrl}
              alt={sheet.caption}
              label={sheet.caption}
              ratio="aspect-3/2"
              fit="contain"
              className="bg-white"
            />
          </div>
          <figcaption className="mt-2 text-center text-theme-xs text-gray-500">
            {sheet.caption}
          </figcaption>
        </figure>
      ))}
    </div>
  </div>
);

export default PhaseOverviewTab;
