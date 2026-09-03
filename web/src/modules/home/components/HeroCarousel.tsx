'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { HomeBannerSlide } from '../models/home.model';

type HeroCarouselProps = {
  slides: HomeBannerSlide[];
  /** Khoang doi giua cac slide (ms). Default 5000. */
  intervalMs?: number;
};


const HeroCarousel = ({ slides, intervalMs = 5000 }: HeroCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback((index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  }, [slides.length]);

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  // Auto-play: reset timer moi khi activeIndex hoac pause thay doi
  useEffect(() => {
    if (isPaused || slides.length <= 1) return undefined;
    timerRef.current = setTimeout(goNext, intervalMs);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [activeIndex, isPaused, goNext, intervalMs, slides.length]);

  // Khong co slide thi khong render gi - trang van dung vi HeroSearch xu ly fallback
  if (slides.length === 0) return null;

  return (
    <div
      className="absolute inset-0 -z-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Banner dự án nổi bật"
    >
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;
        return (
          <div
            key={slide.publicId}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={!isActive}
            aria-roledescription="slide"
            aria-label={`${index + 1} / ${slides.length}`}
          >
            
            <picture className="absolute inset-0">
              
              {slide.tabletImageUrl && (
                <source
                  media="(min-width: 768px) and (max-width: 1023px)"
                  srcSet={slide.tabletImageUrl}
                />
              )}
              {/* Mobile (<768px) - media query max-width: 767px match dung
                  dien thoai, browser khong matching tablet source o tren. */}
              {slide.mobileImageUrl && (
                <source media="(max-width: 767px)" srcSet={slide.mobileImageUrl} />
              )}
              {/* Fallback: desktop + bat ky viewport nao khong match 2 source
                  tren (vi du khi thieu tabletImageUrl). */}
              <Image
                src={slide.desktopImageUrl}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
                unoptimized
              />
            </picture>
          </div>
        );
      })}

      {/* Dots + arrow chi can khi co nhieu hon 1 slide */}
      {slides.length > 1 && (
        <>
          <div
            className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 md:bottom-6"
            role="tablist"
            aria-label="Chọn slide"
          >
            {slides.map((slide, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={slide.publicId}
                  type="button"
                  onClick={() => goTo(index)}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Đi tới slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    isActive
                      ? 'w-6 bg-white'
                      : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;