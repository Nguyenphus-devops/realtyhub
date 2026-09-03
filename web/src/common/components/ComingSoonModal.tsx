'use client';

import { useCallback, useEffect, useRef } from 'react';

import { FiX } from 'react-icons/fi';

/**
 * Modal "Sắp ra mắt" - mo khi click 1 nut tinh nang chua phat trien.
 *
 * Su dung chung cho 7 khoi tien ich (va cac tinh nang chua ready khac).
 *
 * Co the mo voi icon + tone-color de phan biet theo khoi.
 */
type ComingSoonModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon: React.ComponentType<{ 'aria-hidden'?: boolean; className?: string }>;
  toneClass?: string;
};

const ComingSoonModal = ({ open, onClose, title, description, icon: Icon, toneClass = 'bg-blue-50 text-blue-600' }: ComingSoonModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Phim Escape dong modal + focus trap don gian
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return undefined;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    // Focus vao modal sau 1 frame de hoan thanh transition
    const id = requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      cancelAnimationFrame(id);
      previousFocusRef.current?.focus?.();
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="coming-soon-title"
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Đóng"
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl focus:outline-none md:p-8"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
        >
          <FiX aria-hidden className="h-5 w-5" />
        </button>

        {/* Icon */}
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl">
          <span className={`flex h-full w-full items-center justify-center rounded-2xl ${toneClass}`}>
            <Icon aria-hidden className="h-8 w-8" />
          </span>
        </div>

        {/* Title */}
        <h2 id="coming-soon-title" className="text-center text-xl font-bold text-gray-900 md:text-2xl">
          {title}
        </h2>

        {/* Description */}
        <p className="mt-3 text-center text-theme-sm text-gray-600">
          {description}
        </p>

        {/* Status badge */}
        <div className="mt-6 flex items-center justify-center gap-2 rounded-full bg-warning-50 px-4 py-2 text-theme-xs font-semibold text-warning-700">
          <span className="h-2 w-2 animate-pulse rounded-full bg-warning-500" />
          Đang phát triển
        </div>

        {/* Action */}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-gray-900 px-6 py-3 text-theme-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default ComingSoonModal;