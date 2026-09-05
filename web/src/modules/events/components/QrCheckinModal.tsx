'use client';

import { useEffect, useState } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';

import { formatDateLong } from '@/modules/events/utils/event-format';
import type { EventItem } from '@/modules/events/models/event.model';

/**
 * Modal QR check-in - moi event co mot QR rieng.
 * Hien thi thong tin event de staff check-in xac minh.
 */
type Props = {
  open: boolean;
  onClose: () => void;
  event: EventItem;
};

const QrCheckinModal = ({ open, onClose, event }: Props) => {
  // Khoa cuon + ESC de dong
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = original;
      document.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  if (!open || !event.checkinQr) return null;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = event.checkinQr!;
    a.download = `qr-checkin-${event.slug}.svg`;
    a.click();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="qr-modal-title"
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-theme-md md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
        >
          <FiX aria-hidden className="h-5 w-5" />
        </button>

        <div className="text-center">
          <h2
            id="qr-modal-title"
            className="text-theme-xs font-semibold uppercase tracking-[0.2em] text-brand-600"
          >
            Check-in sự kiện
          </h2>
          <p className="mt-2 font-serif text-lg font-bold leading-tight text-gray-900 md:text-xl">
            {event.title}
          </p>
          <p className="mt-1 text-theme-sm text-gray-500">
            {formatDateLong(event.startAt)}
            {event.endAt && ` – ${formatDateLong(event.endAt)}`}
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.checkinQr}
              alt={`QR check-in - ${event.title}`}
              className="h-56 w-56 md:h-64 md:w-64"
              width={256}
              height={256}
            />
          </div>
        </div>

        <p className="mt-4 text-center text-theme-xs text-gray-500">
          Đưa mã QR này cho nhân viên check-in tại sự kiện để điểm danh.
        </p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-theme-sm font-semibold text-gray-700 transition hover:border-brand-500 hover:text-brand-600"
          >
            <FiDownload aria-hidden className="h-4 w-4" />
            Tải QR
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-brand-500 px-5 py-2.5 text-theme-sm font-semibold text-white transition hover:bg-brand-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default QrCheckinModal;
