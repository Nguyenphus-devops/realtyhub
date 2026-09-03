import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProjectDetailPage from '@/modules/project/components/detail/ProjectDetailPage';
import { ProjectService } from '@/modules/project/services/project.service';

type ProjectDetailRouteProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProjectDetailRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await ProjectService.detail(slug);

  if (!project) return { title: 'Không tìm thấy dự án' };

  return {
    title: project.name,
    description: project.tagline,
    openGraph: {
      title: project.name,
      description: project.tagline,
      images: project.thumbnailUrl ? [project.thumbnailUrl] : undefined,
    },
  };
}

/** Khung xuong hien trong luc cho doc tham so ?tab= tu URL */
const PageFallback = () => (
  <div className="site-container py-8">
    <div className="mb-6 h-24 animate-pulse rounded-lg bg-gray-100" />
    <div className="mb-6 h-11 animate-pulse rounded bg-gray-100" />
    <div className="aspect-21/9 w-full animate-pulse rounded-xl bg-gray-100" />
  </div>
);

export default async function ProjectDetailRoute({ params }: ProjectDetailRouteProps) {
  const { slug } = await params;

  // Chan 404 ngay tren server de bot tim kiem khong index trang rong
  const project = await ProjectService.detail(slug);
  if (!project) notFound();

  // ProjectDetailPage doc tab qua useSearchParams nen bat buoc nam trong Suspense.
  // Truyen luon `project` xuong de HTML tu server da co noi dung, khong phai
  // doi client goi lai lan hai.
  return (
    <Suspense fallback={<PageFallback />}>
      <ProjectDetailPage slug={slug} initialProject={project} />
    </Suspense>
  );
}
