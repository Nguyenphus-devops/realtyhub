'use client';

import { useEffect, useState } from 'react';
import { FiDownload, FiMaximize2, FiX } from 'react-icons/fi';

/**
 * Viewer "THIEP MOI" - object-contain, khong crop, click de mo full screen,
 * co nut download (mock - chi gia lap khi chua co backend).
 */
type Props = {
  src?: string;
  title: string;
};

const InvitationViewer = ({ src, title }: Props) => {
  const [open, setOpen] = useState(false);

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
    return (
      <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-theme-sm text-gray-500">
        Thiệp mời sẽ được cập nhật.
      </div>
    );
  }

  const handleDownload = () => {
    // Mock download: open trong tab moi. Backend se tra ve signed URL.
    const a = document.createElement('a');
    a.href = src;
    a.download = `thiep-moi-${title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`Thiệp mời - ${title}`}
          className="aspect-[3/4] w-full bg-gray-50 object-contain"
        />
        <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-white px-4 py-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 text-theme-sm font-semibold text-brand-600 transition hover:text-brand-700"
          >
            <FiMaximize2 aria-hidden className="h-4 w-4" />
            Xem lớn
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 text-theme-sm font-semibold text-gray-600 transition hover:text-brand-600"
          >
            <FiDownload aria-hidden className="h-4 w-4" />
            Tải về
          </button>
        </div>
      </div>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Thiệp mời - ${title}`}
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/85 p-4"
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
            className="relative max-h-[90vh] max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Thiệp mời - ${title}`}
              className="max-h-[90vh] max-w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default InvitationViewer;
