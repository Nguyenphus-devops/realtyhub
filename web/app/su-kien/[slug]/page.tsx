import Link from 'next/link';
import type { Metadata } from 'next';
import {
  FiArrowLeft,
  FiArrowRight,
  FiAward,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiDownload,
  FiFileText,
  FiMapPin,
  FiUsers,
  FiVideo,
} from 'react-icons/fi';

import EventCard from '@/modules/events/components/EventCard';
import HeroImage from '@/modules/events/components/HeroImage';
import InvitationViewer from '@/modules/events/components/InvitationViewer';
import { MOCK_EVENTS } from '@/modules/events/mocks/events.mock';
import {
  EVENT_STATUS_LABELS,
  EVENT_TYPE_LABELS,
  EVENT_TYPE_TONE,
  type EventItem,
  type EventStatus,
} from '@/modules/events/models/event.model';
import {
  formatDateLong,
  formatTime,
} from '@/modules/events/utils/event-format';
import EventDetailClient from './EventDetailClient';
import RegisterAndCheckin from './RegisterAndCheckin';

/**
 * Trang /su-kien/[slug] - chi tiet su kien.
 *
 * Cau truc (theo yeu cau redesign):
 *   01  Breadcrumb
 *   02  Ten su kien + chip loai / trang thai
 *   03  Anh su kien (cover image, click mo lightbox)
 *   04  Thong tin su kien (loai, trang thai, thoi gian, dia diem, so dang ky, so check-in, don vi to chuc)
 *   05  CTA "Dang ky tham gia" / trang thai dong (full / past)
 *   06  Noi dung su kien (description)
 *   07  Thiep moi (invitation image, xem lon + download)
 *   08  Tai lieu (label "Tai lieu" - doi tu "Thu vien")
 *   09  QR Check-in (mo modal)
 *   10  Section "CAC SU KIEN KHAC" - card giong /su-kien (trung slug bi loai)
 *
 * KHONG co comment/binh luan.
 * KHONG co label "Thu vien" (doi thanh "Tai lieu").
 * Card "Cac su kien khac" tai su dung EventCard (khong tao card moi).
 * QR + Invitation duoc mock trong events.mock.ts (schema giong API that).
 */

type PageProps = {
  params: Promise<{ slug: string }>;
};

const NOW = new Date('2026-08-09T15:00:00.000+07:00');

const computeStatus = (event: EventItem): EventStatus => {
  const start = new Date(event.startAt).getTime();
  const end = event.endAt
    ? new Date(event.endAt).getTime()
    : start + 2 * 60 * 60 * 1000;
  if (event.capacity && event.registered >= event.capacity) return 'full';
  if (NOW.getTime() < start) return 'upcoming';
  if (NOW.getTime() >= start && NOW.getTime() <= end) return 'ongoing';
  return 'past';
};

/** Lay event detail day du cho client component (QR modal). */
const serialize = (event: EventItem) => ({
  publicId: event.publicId,
  slug: event.slug,
  title: event.title,
  startAt: event.startAt,
  endAt: event.endAt,
  checkinQr: event.checkinQr,
});

/**
 * Sap xep "Cac su kien khac":
 *   - Uu tien ongoing > upcoming > full > past
 *   - Cung loai hon khac loai
 *   - Moi hon (startAt gan hon) hon cu hon
 * Trung slug bi loai, lay toi da 3.
 */
const pickRelatedEvents = (currentSlug: string, currentType: EventItem['type']): EventItem[] => {
  const decorated = MOCK_EVENTS.map((event) => ({
    ...event,
    status: computeStatus(event),
  })).filter((event) => event.slug !== currentSlug);

  const statusPriority: Record<EventStatus, number> = {
    ongoing: 0,
    upcoming: 1,
    full: 2,
    past: 3,
  };

  return decorated
    .map((event) => ({
      event,
      score:
        statusPriority[event.status] -
        (event.type === currentType ? 1.5 : 0) -
        new Date(event.startAt).getTime() / 1e13,
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((item) => item.event);
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = MOCK_EVENTS.find((item) => item.slug === slug);
  return {
    title: event?.title ?? 'Sự kiện',
    description: event?.excerpt,
  };
}

const SuKienDetailPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const event = MOCK_EVENTS.find((item) => item.slug === slug);

  if (!event) {
    return (
      <main className="site-container py-16">
        <div className="mx-auto max-w-xl rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-card">
          <h1 className="text-2xl font-bold text-gray-900">
            Không tìm thấy sự kiện
          </h1>
          <p className="mt-2 text-theme-sm text-gray-500">
            Sự kiện bạn đang tìm không tồn tại hoặc đã được gỡ.
          </p>
          <Link
            href="/su-kien"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-500 px-5 py-2.5 text-theme-sm font-semibold text-white transition hover:bg-brand-600"
          >
            <FiArrowLeft aria-hidden />
            Quay lại danh sách
          </Link>
        </div>
      </main>
    );
  }

  const tone = EVENT_TYPE_TONE[event.type];
  const status = computeStatus(event);
  const isClosed = status === 'past' || status === 'full';
  const canRegister = !isClosed && (event.isRegistrationOpen ?? true);

  const registrationCount = event.registrationCount ?? event.registered;
  const checkinCount = event.checkinCount ?? 0;

  const relatedEvents = pickRelatedEvents(event.slug, event.type);
  const speakers = event.speakers ?? [];
  const tags = event.tags ?? [];
  const documents = event.documents ?? [];

  return (
    <main className="bg-gray-50">
      <div className="site-container py-6 md:py-10">
        {/* ── 01 Breadcrumb ─────────────────────────────────────────── */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-1.5 text-theme-sm text-gray-500 md:mb-6"
        >
          <Link href="/" className="transition hover:text-brand-600">
            Trang chủ
          </Link>
          <span aria-hidden>/</span>
          <Link href="/su-kien" className="transition hover:text-brand-600">
            Sự kiện
          </Link>
          <span aria-hidden>/</span>
          <span className="line-clamp-1 max-w-[60%] font-medium text-gray-700">
            {event.title}
          </span>
        </nav>

        {/* ── 02 Ten su kien ─────────────────────────────────────────── */}
        <header className="mb-6 md:mb-8">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex rounded-full px-2.5 py-1 text-theme-xs font-bold uppercase tracking-[0.15em] ${tone.chip}`}
            >
              {EVENT_TYPE_LABELS[event.type]}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-theme-xs font-bold uppercase tracking-[0.15em] ${
                status === 'ongoing'
                  ? 'bg-rose-50 text-rose-700'
                  : status === 'past'
                    ? 'bg-gray-100 text-gray-600'
                    : status === 'full'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-brand-50 text-brand-700'
              }`}
            >
              {status === 'ongoing' && (
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
              )}
              {EVENT_STATUS_LABELS[status]}
            </span>
            {event.isFree && (
              <span className="inline-flex rounded-full bg-green-50 px-2.5 py-1 text-theme-xs font-bold uppercase tracking-[0.15em] text-green-700">
                Miễn phí
              </span>
            )}
          </div>

          <h1 className="font-serif text-2xl font-bold leading-tight text-gray-900 md:text-4xl">
            {event.title}
          </h1>
          {event.excerpt && (
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-gray-600 md:text-lg">
              {event.excerpt}
            </p>
          )}
        </header>

        {/* ── 03 Anh su kien ─────────────────────────────────────────── */}
        <section aria-labelledby="event-image-title" className="mb-8 md:mb-10">
          <h2 id="event-image-title" className="sr-only">
            Ảnh sự kiện
          </h2>
          <HeroImage
            src={event.coverImage}
            alt={event.title}
            fallbackSeed={event.title}
          />
        </section>

        <EventDetailClient event={serialize(event)}>
          <section
            aria-labelledby="info-title"
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card"
          >
            <div className="border-b border-gray-100 px-6 py-5 md:px-10 md:py-6">
              <h2
                id="info-title"
                className="flex items-center gap-2 text-theme-xs font-semibold uppercase tracking-[0.2em] text-brand-600"
              >
                <FiFileText aria-hidden className="text-base" />
                Thông tin sự kiện
              </h2>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-2 md:gap-8 md:p-10">
              {/* Thoi gian */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <FiCalendar aria-hidden className="text-lg" />
                </div>
                <div className="min-w-0">
                  <p className="text-theme-xs font-semibold uppercase tracking-wide text-gray-500">
                    Thời gian
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {formatDateLong(event.startAt)}
                  </p>
                  <p className="text-theme-sm text-gray-600">
                    {formatTime(event.startAt)}
                    {event.endAt && ` – ${formatTime(event.endAt)}`}
                  </p>
                </div>
              </div>

              {/* Dia diem */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  {event.location.isOnline ? (
                    <FiVideo aria-hidden className="text-lg" />
                  ) : (
                    <FiMapPin aria-hidden className="text-lg" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-theme-xs font-semibold uppercase tracking-wide text-gray-500">
                    Địa điểm
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {event.location.name}
                  </p>
                  {event.location.address && (
                    <p className="text-theme-sm text-gray-600">
                      {event.location.address}
                    </p>
                  )}
                  {event.location.isOnline && event.location.onlineUrl && (
                    <a
                      href={event.location.onlineUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-theme-sm font-medium text-brand-600 underline-offset-2 hover:underline"
                    >
                      Link tham gia online
                    </a>
                  )}
                </div>
              </div>

              {/* Don vi to chuc */}
              {event.organizer && (
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <FiAward aria-hidden className="text-lg" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-theme-xs font-semibold uppercase tracking-wide text-gray-500">
                      Đơn vị tổ chức
                    </p>
                    <p className="mt-1 font-semibold text-gray-900">
                      {event.organizer}
                    </p>
                  </div>
                </div>
              )}

              {/* Loai su kien */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <FiClock aria-hidden className="text-lg" />
                </div>
                <div className="min-w-0">
                  <p className="text-theme-xs font-semibold uppercase tracking-wide text-gray-500">
                    Loại sự kiện
                  </p>
                  <p className="mt-1 font-semibold text-gray-900">
                    {EVENT_TYPE_LABELS[event.type]}
                  </p>
                  <p className="text-theme-sm text-gray-600">
                    {event.isFree ? 'Sự kiện miễn phí' : `Phí: ${(event.price ?? 0).toLocaleString('vi-VN')}đ`}
                  </p>
                </div>
              </div>
            </div>

            {/* So luong dang ky / check-in */}
            <div className="grid grid-cols-2 gap-0 border-t border-gray-100 bg-gradient-to-br from-brand-50/50 via-white to-white">
              <div className="flex flex-col items-center gap-1 border-r border-gray-100 px-4 py-6 md:py-8">
                <span className="font-serif text-3xl font-bold text-brand-600 md:text-4xl">
                  {registrationCount}
                </span>
                <span className="inline-flex items-center gap-1.5 text-theme-xs font-semibold uppercase tracking-[0.15em] text-gray-600">
                  <FiUsers aria-hidden className="h-3.5 w-3.5" />
                  Người đăng ký
                </span>
              </div>
              <div className="flex flex-col items-center gap-1 px-4 py-6 md:py-8">
                <span className="font-serif text-3xl font-bold text-green-600 md:text-4xl">
                  {checkinCount}
                </span>
                <span className="inline-flex items-center gap-1.5 text-theme-xs font-semibold uppercase tracking-[0.15em] text-gray-600">
                  <FiCheckCircle aria-hidden className="h-3.5 w-3.5" />
                  Đã check-in
                </span>
              </div>
            </div>
          </section>

          {/* ── 05 CTA Dang ky / Check-in / Trang thai dong ────────── */}
          <section className="mt-6 md:mt-8">
            <RegisterAndCheckin
              event={event}
              status={status}
              canRegister={canRegister}
            />
          </section>

          {/* ── 06 Noi dung su kien ────────────────────────────────── */}
          {event.description && (
            <section
              aria-labelledby="content-title"
              className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card md:mt-8"
            >
              <div className="border-b border-gray-100 px-6 py-5 md:px-10 md:py-6">
                <h2
                  id="content-title"
                  className="text-theme-xs font-semibold uppercase tracking-[0.2em] text-brand-600"
                >
                  Nội dung sự kiện
                </h2>
              </div>
              <div className="space-y-4 px-6 py-6 text-base leading-relaxed text-gray-700 md:px-10 md:py-8">
                <p>{event.description}</p>

                {speakers.length > 0 && (
                  <div className="mt-6 rounded-xl bg-gray-50 px-4 py-4 md:px-6 md:py-5">
                    <h3 className="mb-3 text-theme-xs font-semibold uppercase tracking-[0.15em] text-gray-700">
                      Diễn giả
                    </h3>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {speakers.map((sp) => (
                        <li key={sp.publicId} className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 font-serif text-base font-bold text-white">
                            {sp.initials ?? sp.name.slice(-2).toUpperCase()}
                          </span>
                          <span className="min-w-0">
                            <span className="block font-semibold text-gray-900">
                              {sp.name}
                            </span>
                            <span className="block truncate text-theme-sm text-gray-500">
                              {sp.role}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 pt-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex rounded-full border border-gray-200 bg-white px-3 py-1 text-theme-xs font-semibold uppercase tracking-[0.1em] text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ── 07 Thiep moi ──────────────────────────────────────── */}
          <section
            aria-labelledby="invitation-title"
            className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card md:mt-8"
          >
            <div className="border-b border-gray-100 px-6 py-5 md:px-10 md:py-6">
              <h2
                id="invitation-title"
                className="text-theme-xs font-semibold uppercase tracking-[0.2em] text-brand-600"
              >
                Thiệp mời
              </h2>
              <p className="mt-1 text-theme-sm text-gray-500">
                Thư mời điện tử dành riêng cho sự kiện.
              </p>
            </div>
            <div className="p-6 md:p-10">
              <div className="mx-auto max-w-md">
                <InvitationViewer src={event.invitationImage} title={event.title} />
              </div>
            </div>
          </section>

          {/* ── 08 Tai lieu (doi tu "Thu vien") ───────────────────── */}
          <section
            aria-labelledby="documents-title"
            className="mt-6 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card md:mt-8"
          >
            <div className="border-b border-gray-100 px-6 py-5 md:px-10 md:py-6">
              <h2
                id="documents-title"
                className="flex items-center gap-2 text-theme-xs font-semibold uppercase tracking-[0.2em] text-brand-600"
              >
                <FiFileText aria-hidden className="text-base" />
                Tài liệu
              </h2>
              <p className="mt-1 text-theme-sm text-gray-500">
                Bộ tài liệu đính kèm cho môi giới tham dự.
              </p>
            </div>
            <div className="px-6 py-6 md:px-10 md:py-8">
              {documents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-6 text-theme-sm text-gray-500">
                  Tài liệu của sự kiện sẽ được cập nhật trước ngày diễn ra.
                </div>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {documents.map((doc, idx) => (
                    <li key={idx}>
                      <a
                        href={doc.url}
                        download
                        className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 transition hover:border-brand-500 hover:bg-brand-50/40 hover:shadow-card"
                      >
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-theme-xs font-bold uppercase tracking-wide text-brand-600">
                          {doc.type}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-gray-900 group-hover:text-brand-600">
                            {doc.name}
                          </span>
                          <span className="block text-theme-xs text-gray-500">
                            {doc.size
                              ? `${(doc.size / 1024).toFixed(0)} KB`
                              : 'Tải về'}
                          </span>
                        </span>
                        <FiDownload
                          aria-hidden
                          className="h-4 w-4 shrink-0 text-gray-400 transition group-hover:text-brand-600"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </EventDetailClient>

        {/* ── 10 Cac su kien khac ──────────────────────────────────── */}
        {relatedEvents.length > 0 && (
          <section
            aria-labelledby="related-events-title"
            className="mt-10 md:mt-14"
          >
            <div className="mb-6 flex items-end justify-between gap-4">
              <h2
                id="related-events-title"
                className="font-serif text-xl font-bold uppercase tracking-[0.08em] text-gray-900 md:text-2xl"
              >
                Các sự kiện khác
              </h2>
              <Link
                href="/su-kien"
                className="inline-flex shrink-0 items-center gap-1.5 text-theme-sm font-semibold text-brand-600 transition hover:text-brand-700"
              >
                Xem tất cả
                <FiArrowRight aria-hidden className="text-base" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedEvents.map((related) => (
                <EventCard key={related.publicId} event={related} />
              ))}
            </div>
          </section>
        )}

        {/* ── Nut quay lai cuoi trang ──────────────────────────────── */}
        <div className="mt-10">
          <Link
            href="/su-kien"
            className="inline-flex items-center gap-1.5 text-theme-sm font-medium text-gray-500 transition hover:text-brand-600"
          >
            <FiArrowLeft aria-hidden className="text-base" />
            Quay lại danh sách sự kiện
          </Link>
        </div>
      </div>
    </main>
  );
};

export default SuKienDetailPage;
