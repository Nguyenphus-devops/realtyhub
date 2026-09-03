'use client';

import { useState, type ReactNode } from 'react';
import Link from 'next/link';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { TbLayoutGrid, TbMap2, TbView360 } from 'react-icons/tb';
import ThumbCarousel from '@/common/components/ThumbCarousel';
import ShineSweep from '@/common/components/ShineSweep';
import { useFavorites } from '../hooks/useFavorites';
import type { ProjectDetailTabKey } from '../models/project-detail.model';
import {
  SEGMENT_BADGE_LABELS,
  type Project,
  type ProjectSegment,
} from '../models/project.model';

/**
 * Nhan phan khuc: nen chuyen mau + bong do cung tong.
 *
 * Khai bao Record<ProjectSegment, ...> nen neu them mot phan khuc moi ben model
 * ma quen khai bao mau o day, TypeScript bao loi ngay - truoc kia dung toan tu
 * ba ngoi nen moi gia tri la khong phai 'cao-tang' deu am tham ra mau cam.
 */
const SEGMENT_BADGES: Record<ProjectSegment, { gradient: string; glow: string }> = {
  // `brand-gradient` khai bao trong globals.css, dung chung voi nut tim kiem
  'cao-tang': {
    gradient: 'brand-gradient',
    glow: 'shadow-[0_4px_16px_-4px_rgba(15,111,209,0.75)]',
  },
  'thap-tang': {
    gradient: 'bg-linear-to-r from-accent-600 via-accent-500 to-accent-400',
    glow: 'shadow-[0_4px_16px_-4px_rgba(240,135,26,0.8)]',
  },
};

/**
 * Ba loi tat nhay thang vao tab ben trong trang chi tiet.
 *
 * `key` khai bao kieu ProjectDetailTabKey nen neu ai doi ten tab trong
 * PROJECT_DETAIL_TABS, TypeScript bao loi ngay tai day thay vi de card tro
 * toi mot tab khong ton tai - luc do parseTabKey se am tham roi ve "Tong quan".
 */
const QUICK_TABS: { key: ProjectDetailTabKey; label: string; icon: ReactNode }[] = [
  { key: 'anh-360', label: '360°', icon: <TbView360 aria-hidden /> },
  { key: 'mat-bang-quy-can', label: 'Mặt bằng', icon: <TbMap2 aria-hidden /> },
  { key: 'quy-can', label: 'Quỹ căn', icon: <TbLayoutGrid aria-hidden /> },
];

type ProjectCardProps = {
  project: Project;
};

const ProjectCard = ({ project }: ProjectCardProps) => {
  const { isFavorite: checkFavorite, toggle } = useFavorites();
  // Ro chuot len the thi dung chuyen anh, de con kip nhin tam dang xem
  const [isHovered, setIsHovered] = useState(false);
  const isFavorite = checkFavorite(project.publicId);

  const badge = SEGMENT_BADGES[project.segment];

  return (
    <article
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card transition hover:shadow-card-hover"
    >
      <div className="relative aspect-16/10 w-full overflow-hidden">
        <Link href={project.detailUrl} className="block h-full w-full">
          <ThumbCarousel
            seed={project.publicId}
            images={project.thumbnailUrls}
            alt={`Phối cảnh dự án ${project.name}`}
            paused={isHovered}
            className="transition duration-500 group-hover:scale-105"
          />

          {/* Lop phu toi dan tu duoi len de chu luon doc duoc tren moi anh */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent"
          />
          <span className="pointer-events-none absolute inset-x-0 bottom-0 px-5 pb-4 text-center text-xl font-bold uppercase leading-tight tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
            {project.name}
          </span>
        </Link>

        {/* overflow-hidden de vet sang khong tran ra ngoai vien bo tron.
            origin-left cho nhan no ra ve ben phai, giu me trai dinh sat canh anh. */}
        <span
          className={`absolute left-0 top-2.5 z-10 origin-left overflow-hidden rounded-r-full transition-transform duration-300 ease-out group-hover:scale-105 ${badge.gradient} ${badge.glow}`}
        >
          <span className="relative z-10 block px-4 py-2 text-theme-xs font-bold uppercase tracking-wide text-white">
            {SEGMENT_BADGE_LABELS[project.segment]}
          </span>

          <ShineSweep />
        </span>

        <button
          type="button"
          onClick={(event) => {
            // Nut nam trong <Link> bao quanh thumbnail, can chan ca mac dinh
            // (Link navigate) lan bubble de click chi toggle favorite ma
            // khong nhay trang / cuon len dau.
            event.preventDefault();
            event.stopPropagation();
            toggle(project.publicId);
          }}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite
              ? `Bỏ lưu dự án ${project.name}`
              : `Lưu dự án ${project.name}`
          }
          className="absolute right-3 top-2.5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-white/15 text-lg backdrop-blur-md transition duration-200 ease-out hover:scale-110 hover:border-white/70 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-0 active:scale-90"
        >
          {/* Nen trong suot nen icon phai co bong do rieng, neu khong se chim
              vao nhung tam anh sang mau. */}
          {isFavorite ? (
            <FaHeart className="animate-heart-pop text-error-500 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]" />
          ) : (
            <FaRegHeart className="text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]" />
          )}
        </button>
      </div>

      {/* Ten du an chi hien mot lan - tren anh. Duoi anh chi con ba loi tat, nen
          moi the cao bang nhau ma khong can ghim gi xuong day. */}
      <div className="p-5">
        <nav
          aria-label={`Lối tắt dự án ${project.name}`}
          className="grid grid-cols-3 gap-2"
        >
          {QUICK_TABS.map((tab) => (
            <Link
              key={tab.key}
              href={`${project.detailUrl}?tab=${tab.key}`}
              aria-label={`${tab.label} - dự án ${project.name}`}
              className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-1 py-3 text-brand-600 transition hover:border-brand-400 hover:bg-brand-25 hover:shadow-card"
            >
              <span className="text-2xl leading-none" aria-hidden>
                {tab.icon}
              </span>
              <span className="text-theme-xs font-medium leading-none">{tab.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </article>
  );
};

export default ProjectCard;
