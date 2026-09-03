'use client';

import { useCallback, useEffect, useState, type ReactNode } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import PlaceholderThumb from '@/common/components/PlaceholderThumb';
import type { MediaSlide } from '../../models/project-detail.model';

const AUTOPLAY_MS = 6000;

type ProjectHeroCarouselProps = {
  slides: MediaSlide[];
  projectName: string;
  /**
   * Lop dinh kich thuoc khung anh. Mac dinh la ti le 21/9, nhung hero tran vien
   * truyen chieu cao theo viewport nen nhan bat ky lop kich thuoc nao.
   */
  ratio?: string;
  /**
   * Noi dung de len anh (ten du an, nhan trang thai...). Co `children` thi dong
   * chu thich tu thu ve goc phai cho khoi dam vao phan chu chinh.
   */
  children?: ReactNode;
};

const ProjectHeroCarousel = ({
  slides,
  projectName,
  ratio = 'aspect-21/9',
  children,
}: ProjectHeroCarouselProps) => {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = slides.length;
  const hasOverlay = Boolean(children);

  const goTo = useCallback(
    (next: number) => setIndex(((next % total) + total) % total),
    [total],
  );

  useEffect(() => {
    if (isPaused || total <= 1) return;

    // Nguoi dung da tat hieu ung chuyen dong thi khong tu chay
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const timer = setInterval(
      () => setIndex((current) => (current + 1) % total),
      AUTOPLAY_MS,
    );
    return () => clearInterval(timer);
  }, [isPaused, total]);

  if (total === 0) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label={`Phối cảnh dự án ${projectName}`}
      className={`relative overflow-hidden bg-navy-900 ${hasOverlay ? '' : 'rounded-xl shadow-card'}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      <div className={`relative w-full ${ratio}`}>
        {slides.map((slide, slideIndex) => (
          <div
            key={slide.publicId}
            aria-hidden={slideIndex !== index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              slideIndex === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <PlaceholderThumb
              seed={slide.publicId}
              src={slide.imageUrl || undefined}
              alt={slide.caption}
            />
          </div>
        ))}

        {/* Co noi dung de len anh thi can lop phu day hon de chu luon doc duoc */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 ${
            hasOverlay
              ? 'bg-linear-to-t from-navy-900 via-navy-900/55 to-navy-900/10'
              : 'bg-linear-to-t from-black/60 via-transparent to-transparent'
          }`}
        />

        {hasOverlay ? (
          <>
            {children}

            {/* Chu thich anh lui ve goc phai, nhuong cho cho khoi chu chinh */}
            <p className="pointer-events-none absolute bottom-14 right-5 hidden max-w-xs truncate rounded-full bg-black/35 px-3 py-1 text-theme-xs text-white/80 backdrop-blur-sm lg:block">
              {slides[index].caption}
            </p>
          </>
        ) : (
          <p className="absolute inset-x-0 bottom-0 px-6 pb-8 text-center text-theme-sm font-medium text-white sm:pb-9">
            {slides[index].caption}
          </p>
        )}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Ảnh trước"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition hover:scale-110 hover:bg-white/30 active:scale-95 sm:left-5"
          >
            <FiChevronLeft aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Ảnh tiếp theo"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition hover:scale-110 hover:bg-white/30 active:scale-95 sm:right-5"
          >
            <FiChevronRight aria-hidden />
          </button>

          {/* Co overlay thi cham lui ve goc phai, tranh dam vao khoi ten du an */}
          <div
            className={`absolute inset-x-0 flex items-center gap-2 ${
              hasOverlay ? 'bottom-5 justify-end pr-5' : 'bottom-3 justify-center'
            }`}
          >
            {slides.map((slide, slideIndex) => (
              <button
                key={slide.publicId}
                type="button"
                onClick={() => goTo(slideIndex)}
                aria-label={`Xem ảnh ${slideIndex + 1}`}
                aria-current={slideIndex === index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  slideIndex === index
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/55 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default ProjectHeroCarousel;
