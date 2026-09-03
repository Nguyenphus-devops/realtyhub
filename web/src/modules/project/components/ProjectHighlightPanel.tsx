'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { FiChevronRight, FiClock } from 'react-icons/fi';
import { HiOutlineBuildingOffice2, HiOutlineHomeModern } from 'react-icons/hi2';
import PlaceholderThumb from '@/common/components/PlaceholderThumb';
import type { ProjectHighlightGroup } from '../models/project.model';

/**
 * Mau va nhan theo nhom. Xanh cho cao tang, cam cho thap tang - trung mau nhan
 * phan khuc tren the du an de nguoi xem noi duoc hai cho voi nhau.
 *
 * `badgeLabel` tach rieng vi nhom "moi nhat" khong phai bang xep hang ban chay,
 * dan nhan "TOP 1" len do se sai nghia.
 */
type GroupTone = {
  icon: ReactNode;
  chip: string;
  rank: string;
  badge: string;
  badgeLabel: string;
};

const GROUP_TONES: Record<string, GroupTone> = {
  'cao-tang': {
    icon: <HiOutlineBuildingOffice2 aria-hidden />,
    chip: 'bg-brand-50 text-brand-600',
    rank: 'bg-brand-50 text-brand-600',
    badge: 'bg-brand-500',
    badgeLabel: 'Top 1',
  },
  'thap-tang': {
    icon: <HiOutlineHomeModern aria-hidden />,
    chip: 'bg-accent-50 text-accent-600',
    rank: 'bg-accent-50 text-accent-600',
    badge: 'bg-accent-500',
    badgeLabel: 'Top 1',
  },
  'moi-nhat': {
    icon: <FiClock aria-hidden />,
    chip: 'bg-success-50 text-success-600',
    rank: 'bg-success-50 text-success-600',
    badge: 'bg-success-500',
    badgeLabel: 'Mới nhất',
  },
};

const FALLBACK_TONE: GroupTone = {
  icon: <HiOutlineBuildingOffice2 aria-hidden />,
  chip: 'bg-gray-100 text-gray-600',
  rank: 'bg-gray-100 text-gray-600',
  badge: 'bg-gray-500',
  badgeLabel: 'Top 1',
};

/** Khop so nhom va so dong ma ProjectService.highlights() tra ve */
const GROUP_COUNT = 3;
const ROWS_BELOW_TOP = 4;

const GroupSkeleton = () => (
  <div className="p-6">
    <div className="mb-4 flex items-center gap-2.5">
      <div className="h-9 w-9 animate-pulse rounded-lg bg-gray-100" />
      <div className="h-4 w-36 animate-pulse rounded bg-gray-100" />
    </div>
    <div className="mb-4 aspect-16/10 w-full animate-pulse rounded-xl bg-gray-100" />
    <div className="space-y-3.5">
      {Array.from({ length: ROWS_BELOW_TOP }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 px-2">
          <div className="h-6 w-6 shrink-0 animate-pulse rounded-md bg-gray-100" />
          <div className="h-4 flex-1 animate-pulse rounded bg-gray-100" />
        </div>
      ))}
    </div>
  </div>
);

type ProjectHighlightPanelProps = {
  groups: ProjectHighlightGroup[];
  isLoading: boolean;
};

const ProjectHighlightPanel = ({ groups, isLoading }: ProjectHighlightPanelProps) => (
  <section className="pb-6 pt-8" aria-labelledby="du-an-ban-chay">
    <h2
      id="du-an-ban-chay"
      className="mb-5 text-xl font-bold uppercase tracking-wide text-gray-900"
    >
      Dự án bán chạy
    </h2>

    {/* Mot mat phang trang lien mach, khong vien - ba cot chi ngan nhau bang
        mot duong ke mo. Duoi lg thi xep doc nen duong ke chuyen thanh ngang.
        Grid nhay thang tu 1 cot len 3 cot: neu co moc 2 cot o giua thi cot thu
        ba tut xuong hang duoi va duong ke doc se nam sai cho. */}
    <div className="overflow-hidden rounded-2xl bg-white shadow-panel">
      <div className="grid grid-cols-1 divide-y divide-gray-100 lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {isLoading
          ? Array.from({ length: GROUP_COUNT }).map((_, index) => (
              <GroupSkeleton key={index} />
            ))
          : groups.map((group) => {
              const tone = GROUP_TONES[group.key] ?? FALLBACK_TONE;
              // Hang 1 duoc tach ra lam the anh lon, phan con lai la danh sach gon
              const [top, ...rest] = group.projects;

              if (!top) return null;

              return (
                <div key={group.key} className="p-6">
                  <h3 className="mb-4 flex items-center gap-2.5">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-lg ${tone.chip}`}
                    >
                      {tone.icon}
                    </span>
                    <span className="text-theme-sm font-bold uppercase tracking-wide text-gray-800">
                      {group.title}
                    </span>
                  </h3>

                  <Link
                    href={`/gio-hang/${top.slug}`}
                    className="group relative mb-4 block aspect-16/10 w-full overflow-hidden rounded-xl bg-gray-100"
                  >
                    <PlaceholderThumb
                      seed={top.publicId}
                      src={top.thumbnailUrl || undefined}
                      alt={`Phối cảnh dự án ${top.name}`}
                      className="transition duration-500 group-hover:scale-105"
                    />

                    {/* Lop phu toi dan tu duoi len de ten luon doc duoc tren moi anh */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/25 to-transparent"
                    />

                    <span
                      className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-theme-xs font-bold uppercase tracking-wide text-white ${tone.badge}`}
                    >
                      {tone.badgeLabel}
                    </span>

                    <span className="pointer-events-none absolute inset-x-0 bottom-0 line-clamp-2 px-4 pb-3.5 text-base font-bold uppercase leading-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                      {top.name}
                    </span>
                  </Link>

                  <ol className="space-y-0.5">
                    {rest.map((project, index) => (
                      <li key={project.publicId}>
                        <Link
                          href={`/gio-hang/${project.slug}`}
                          className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-gray-50"
                        >
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-theme-xs font-bold ${tone.rank}`}
                            aria-hidden
                          >
                            {index + 2}
                          </span>

                          <span className="line-clamp-2 min-w-0 flex-1 text-theme-sm font-semibold uppercase leading-snug text-gray-700 transition group-hover:text-brand-600">
                            {project.name}
                          </span>

                          <FiChevronRight
                            aria-hidden
                            className="shrink-0 text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-brand-500"
                          />
                        </Link>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
      </div>
    </div>
  </section>
);

export default ProjectHighlightPanel;
