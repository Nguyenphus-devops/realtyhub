'use client';

import { useCallback, useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiGrid, FiX } from 'react-icons/fi';
import PlaceholderThumb from '@/common/components/PlaceholderThumb';
import type { MediaSlide } from '../../models/project-detail.model';

/** So o hien tren kham: 1 anh lon + 4 anh nho */
const TILE_COUNT = 5;

type ProjectGalleryProps = {
  slides: MediaSlide[];
  projectName: string;
};

/**
 * Kham anh dau trang chi tiet du an.
 *
 * Thay cho bang chuyen mot anh truoc day: bang chuyen chi cho thay mot tam mot
 * luc, con kham nay bay 5 tam cung luc nen nam duoc du an ngay tu cai nhin dau.
 * Bam vao bat ky o nao mo den long xem full, co phim mui ten va Escape.
 */
const ProjectGallery = ({ slides, projectName }: ProjectGalleryProps) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const total = slides.length;
  const isOpen = lightboxIndex !== null;

  const step = useCallback(
    (delta: number) =>
      setLightboxIndex((current) =>
        current === null ? current : (((current + delta) % total) + total) % total,
      ),
    [total],
  );

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightboxIndex(null);
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, step]);

  if (total === 0) return null;

  const tiles = slides.slice(0, TILE_COUNT);
  const [lead, ...rest] = tiles;

  return (
    <>
      {/* Kham: anh dau chiem nua trai va tron chieu cao, 4 anh con lai xep luoi
          2x2 ben phai. Duoi md xep doc de anh khong bi bop qua nho.
          `relative` de nut "Xem tat ca" gan duoc vao goc duoi phai cua kham. */}
      <div className="relative grid h-[42vh] min-h-75 grid-cols-1 gap-2 md:h-[58vh] md:max-h-150 md:grid-cols-2">
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          aria-label={`Xem ảnh: ${lead.caption}`}
          className="group relative h-full w-full overflow-hidden rounded-xl bg-gray-100"
        >
          <PlaceholderThumb
            seed={lead.publicId}
            src={lead.imageUrl || undefined}
            alt={lead.caption}
            className="transition duration-500 group-hover:scale-105"
          />
        </button>

        <div className="hidden grid-cols-2 grid-rows-2 gap-2 md:grid">
          {rest.map((slide, index) => {
            const isLastTile = index === rest.length - 1;
            const hiddenCount = total - TILE_COUNT;

            return (
              <button
                key={slide.publicId}
                type="button"
                onClick={() => setLightboxIndex(index + 1)}
                aria-label={`Xem ảnh: ${slide.caption}`}
                className="group relative h-full w-full overflow-hidden rounded-xl bg-gray-100"
              >
                <PlaceholderThumb
                  seed={slide.publicId}
                  src={slide.imageUrl || undefined}
                  alt={slide.caption}
                  className="transition duration-500 group-hover:scale-105"
                />

                {/* O cuoi kiem luon nhiem vu cua nut "xem tat ca" */}
                {isLastTile && hiddenCount > 0 && (
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-navy-900/65 text-white backdrop-blur-[2px] transition group-hover:bg-navy-900/75">
                    <FiGrid aria-hidden className="text-2xl" />
                    <span className="text-base font-bold">+{hiddenCount} ảnh</span>
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Gan vao goc duoi phai cua kham thay vi dung thanh mot hang rieng ben
            duoi - mot hang chi chua mot nut dat le phai trong nhu bi bo quen. */}
        <button
          type="button"
          onClick={() => setLightboxIndex(0)}
          className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-base font-semibold text-navy-800 shadow-card-hover backdrop-blur-sm transition hover:scale-105 hover:bg-white active:scale-95 sm:bottom-4 sm:right-4"
        >
          <FiGrid aria-hidden />
          Xem tất cả ({total})
        </button>
      </div>

      {/* ── Den long ─────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Thư viện ảnh ${projectName}`}
          className="fixed inset-0 z-1050 flex flex-col bg-navy-900/95 backdrop-blur-sm"
        >
          <div className="flex shrink-0 items-center justify-between px-4 py-4 sm:px-6">
            <p className="text-base font-medium text-white/80">
              {lightboxIndex + 1} / {total}
            </p>
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Đóng thư viện ảnh"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:scale-110 hover:bg-white/25 active:scale-95"
            >
              <FiX aria-hidden />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16">
            <div className="relative h-full w-full max-w-6xl overflow-hidden rounded-xl">
              <PlaceholderThumb
                seed={slides[lightboxIndex].publicId}
                src={slides[lightboxIndex].imageUrl || undefined}
                alt={slides[lightboxIndex].caption}
              />
            </div>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Ảnh trước"
                  className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:scale-110 hover:bg-white/25 active:scale-95 sm:left-4"
                >
                  <FiChevronLeft aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Ảnh tiếp theo"
                  className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:scale-110 hover:bg-white/25 active:scale-95 sm:right-4"
                >
                  <FiChevronRight aria-hidden />
                </button>
              </>
            )}
          </div>

          <p className="shrink-0 px-6 pb-5 text-center text-base text-white/85">
            {slides[lightboxIndex].caption}
          </p>
        </div>
      )}
    </>
  );
};

export default ProjectGallery;
