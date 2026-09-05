'use client';

import Link from 'next/link';
import { FiCheckCircle, FiClock } from 'react-icons/fi';

import { formatDateLong } from '@/modules/events/utils/event-format';
import type { EventItem, EventStatus } from '@/modules/events/models/event.model';

/**
 * CTA panel gom 2 action (desktop 2 cot, mobile xep doc):
 *   - Dang ky tham gia (Neu con dang ky)
 *   - Mo QR check-in (Neu event da/ dang dien ra)
 *
 * Component client vi can dispatch custom event de mo QrCheckinModal o
 * EventDetailClient (cha). Tranh truyen callback xuyen qua nhieu cap.
 *
 * Logic hien thi nut:
 *   - upcoming + canRegister: [DANG KY]  [QR chua mo]
 *   - ongoing:                  [DANG KY neu con] | [QR dang hoat dong]
 *   - past:                     [DA KET THUC] | [Xem QR]
 *   - full:                     [DA DAY]    | [QR chua mo]
 *
 * QR mo bang cach dispatch event "open-event-qr" -> EventDetailClient bat de
 * setQrOpen(true). Khong can prop drilling.
 */
type Props = {
  event: EventItem;
  status: EventStatus;
  canRegister: boolean;
};

const RegisterAndCheckin = ({ event, status, canRegister }: Props) => {
  const isPast = status === 'past';
  const isFull = status === 'full';

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card">
      <div className="grid gap-0 md:grid-cols-2">
        {/* ─── CTA Dang ky ─── */}
        <div className="flex flex-col gap-2 border-b border-gray-100 px-6 py-6 md:border-b-0 md:border-r md:px-10 md:py-8">
          {isPast ? (
            <>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="block w-full cursor-not-allowed rounded-xl bg-gray-200 px-6 py-4 text-center text-theme-sm font-bold uppercase tracking-[0.1em] text-gray-500"
              >
                Đã kết thúc
              </button>
              <p className="text-center text-theme-xs text-gray-500">
                Sự kiện đã diễn ra vào {formatDateLong(event.startAt)}.
              </p>
            </>
          ) : isFull ? (
            <>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="block w-full cursor-not-allowed rounded-xl bg-gray-200 px-6 py-4 text-center text-theme-sm font-bold uppercase tracking-[0.1em] text-gray-500"
              >
                Đã đầy
              </button>
              <p className="text-center text-theme-xs text-gray-500">
                Sự kiện đã hết suất. Vui lòng chọn sự kiện khác.
              </p>
            </>
          ) : canRegister ? (
            <>
              <Link
                href={`/su-kien/${event.slug}`}
                className="block w-full rounded-xl bg-brand-500 px-6 py-4 text-center text-theme-sm font-bold uppercase tracking-[0.1em] text-white shadow-card transition hover:bg-brand-600"
              >
                Đăng ký tham gia
              </Link>
              <p className="text-center text-theme-xs text-gray-500">
                {event.isFree
                  ? 'Miễn phí. Giữ chỗ ngay để nhận tài liệu trước ngày diễn ra.'
                  : `Phí: ${(event.price ?? 0).toLocaleString('vi-VN')}đ. Đăng ký để nhận hướng dẫn thanh toán.`}
              </p>
            </>
          ) : (
            <>
              <button
                type="button"
                disabled
                aria-disabled="true"
                className="block w-full cursor-not-allowed rounded-xl bg-gray-200 px-6 py-4 text-center text-theme-sm font-bold uppercase tracking-[0.1em] text-gray-500"
              >
                Đã đóng đăng ký
              </button>
              <p className="text-center text-theme-xs text-gray-500">
                Hệ thống đã đóng đăng ký cho sự kiện này.
              </p>
            </>
          )}
        </div>

        {/* ─── CTA QR Check-in ─── */}
        <div className="flex flex-col gap-2 px-6 py-6 md:px-10 md:py-8">
          <CheckinButton event={event} status={status} />
        </div>
      </div>
    </div>
  );
};

// ─── Sub: nut QR Check-in ───

type CheckinButtonProps = {
  event: EventItem;
  status: EventStatus;
};

const CheckinButton = ({ event, status }: CheckinButtonProps) => {
  const isOngoing = status === 'ongoing';
  const isPast = status === 'past';
  const isUpcoming = status === 'upcoming' || status === 'full';

  const handleOpen = () => {
    document.dispatchEvent(
      new CustomEvent('open-event-qr', { detail: { slug: event.slug } }),
    );
  };

  // Su kien sap dien ra hoac full -> QR chua the mo
  if (isUpcoming) {
    return (
      <>
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="block w-full cursor-not-allowed rounded-xl bg-gray-200 px-6 py-4 text-center text-theme-sm font-bold uppercase tracking-[0.1em] text-gray-500"
        >
          <FiClock aria-hidden className="mr-1 inline h-4 w-4" />
          QR check-in chưa mở
        </button>
        <p className="text-center text-theme-xs text-gray-500">
          QR check-in sẽ kích hoạt khi sự kiện bắt đầu.
        </p>
      </>
    );
  }

  // Su kien da ket thuc -> chi mo QR de xem lai
  if (isPast) {
    return (
      <>
        <button
          type="button"
          onClick={handleOpen}
          className="block w-full rounded-xl bg-gray-700 px-6 py-4 text-center text-theme-sm font-bold uppercase tracking-[0.1em] text-white shadow-card transition hover:bg-gray-800"
        >
          Xem QR check-in
        </button>
        <p className="text-center text-theme-xs text-gray-500">
          Sự kiện đã kết thúc lúc {formatDateLong(event.startAt)}.
        </p>
      </>
    );
  }

  // Su kien dang dien ra -> QR dang hoat dong
  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-4 text-center text-theme-sm font-bold uppercase tracking-[0.1em] text-white shadow-card transition hover:bg-green-700"
      >
        <FiCheckCircle aria-hidden className="h-4 w-4" />
        Mở mã QR check-in
      </button>
      <p className="text-center text-theme-xs text-gray-500">
        Đưa mã QR cho nhân viên check-in tại sự kiện.
      </p>
    </>
  );
};

export default RegisterAndCheckin;
