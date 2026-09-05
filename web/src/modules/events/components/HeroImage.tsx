'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FiDownload, FiMaximize2, FiX } from 'react-icons/fi';

/**
 * Thumbnail "ANH SU KIEN" - co the click de mo full screen.
 * object-cover, border-radius theo design RealityHub.
 */
type Props = {
  src?: string;
  alt: string;
  /** Fallback khi src khong ton tai. */
  fallbackSeed?: string;
};

const HeroImage = ({ src, alt, fallbackSeed = 'event' }: Props) => {
  const [open, setOpen] = useState(false);

  // Khoa cuon khi mo lightbox
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!src) {
    // Placeholder gradient nếu không có ảnh
    return (
      <div className="flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-brand-100 via-brand-50 to-orange-50 shadow-card md:aspect-[21/9]">
        <span className="font-serif text-lg font-semibold text-gray-500">
          {fallbackSeed}
        </span>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Xem ảnh lớn"
        className="group relative block aspect-[16/9] w-full overflow-hidden rounded-2xl bg-gray-100 text-left shadow-card transition md:aspect-[21/9] md:hover:shadow-theme-md"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 1024px, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-theme-xs font-semibold uppercase tracking-[0.1em] text-white opacity-0 transition-opacity group-hover:opacity-100">
          <FiMaximize2 aria-hidden className="h-3.5 w-3.5" />
          Xem lớn
        </span>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 p-4 md:p-8"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setOpen(false);
            }}
            aria-label="Đóng"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <FiX aria-hidden className="h-5 w-5" />
          </button>
          <div
            className="relative max-h-full max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="max-h-[90vh] max-w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default HeroImage;

// Re-export icon dùng nơi khác nếu cần
export { FiDownload };
