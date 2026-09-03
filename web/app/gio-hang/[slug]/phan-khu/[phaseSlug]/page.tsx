import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PhaseDetailPage from '@/modules/project/components/phase/PhaseDetailPage';
import { ProjectService } from '@/modules/project/services/project.service';

type PhaseRouteProps = {
  params: Promise<{ slug: string; phaseSlug: string }>;
};

export async function generateMetadata({ params }: PhaseRouteProps): Promise<Metadata> {
  const { slug, phaseSlug } = await params;
  const data = await ProjectService.phase(slug, phaseSlug);

  if (!data) return { title: 'Không tìm thấy phân khu' };

  return {
    title: `Phân khu ${data.phase.name} - ${data.projectName}`,
    description: data.phase.headline,
    openGraph: {
      title: `Phân khu ${data.phase.name} - ${data.projectName}`,
      description: data.phase.headline,
      images: data.phase.imageUrl ? [data.phase.imageUrl] : undefined,
    },
  };
}

const PageFallback = () => (
  <div className="site-container py-8">
    <div className="mb-6 h-24 animate-pulse rounded-lg bg-gray-100" />
    <div className="mb-6 h-11 animate-pulse rounded bg-gray-100" />
    <div className="h-96 w-full animate-pulse rounded-xl bg-gray-100" />
  </div>
);

export default async function PhaseDetailRoute({ params }: PhaseRouteProps) {
  const { slug, phaseSlug } = await params;

  const data = await ProjectService.phase(slug, phaseSlug);
  if (!data) notFound();

  // PhaseDetailPage doc tab qua useSearchParams nen bat buoc nam trong Suspense
  return (
    <Suspense fallback={<PageFallback />}>
      <PhaseDetailPage projectSlug={slug} phaseSlug={phaseSlug} initialPhase={data} />
    </Suspense>
  );
}
