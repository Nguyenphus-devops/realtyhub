import Link from 'next/link';
import {
  FiCalendar,
  FiMapPin,
  FiVideo,
} from 'react-icons/fi';

import PlaceholderThumb from '@/common/components/PlaceholderThumb';
import {
  EVENT_STATUS_LABELS,
  EVENT_TYPE_LABELS,
  EVENT_TYPE_TONE,
  type EventItem,
} from '@/modules/events/models/event.model';

import {
  formatDateLong,
  formatTime,
} from '../utils/event-format';

/**
 * Card su kien - dung chung cho /su-kien (grid) va trang detail
 * ("Cac su kien khac"). Khong tao card moi o moi noi.
 */
type Props = {
  event: EventItem;
};

const EventCard = ({ event }: Props) => {
  const tone = EVENT_TYPE_TONE[event.type];
  const isOngoing = event.status === 'ongoing';

  const start = new Date(event.startAt);
  const day = start.getDate();
  const monthLabel = `Th${start.getMonth() + 1}`;

  const statusLabel = isOngoing ? EVENT_STATUS_LABELS.ongoing : null;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-theme-md">
      <Link
        href={`/su-kien/${event.slug}`}
        className="relative block aspect-[16/10] overflow-hidden"
        aria-label={event.title}
      >
        <PlaceholderThumb
          seed={event.slug}
          src={event.coverImage}
          label={event.title}
          alt={event.title}
          className="transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-white px-1 py-1 text-center shadow-theme-md">
          <span className="font-serif text-xl font-bold leading-none text-gray-900">
            {day}
          </span>
          <span className="mt-0.5 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-600">
            {monthLabel}
          </span>
        </div>

        <span
          className={`absolute right-3 top-3 inline-flex rounded-full px-2.5 py-1 text-theme-xs font-bold uppercase tracking-[0.15em] ${tone.chip}`}
        >
          {EVENT_TYPE_LABELS[event.type]}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-5">
        {statusLabel && (
          <div className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-theme-xs font-bold uppercase tracking-[0.15em] text-rose-700">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
            {statusLabel}
          </div>
        )}

        <h3 className="font-serif text-lg font-bold leading-tight text-gray-900 md:text-xl">
          <Link
            href={`/su-kien/${event.slug}`}
            className="line-clamp-2 transition hover:text-brand-600"
          >
            {event.title}
          </Link>
        </h3>

        <ul className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-theme-sm text-gray-600">
          <li className="flex items-start gap-2">
            <FiCalendar
              aria-hidden
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
            />
            <span className="font-medium">
              {formatTime(event.startAt)} {formatDateLong(event.startAt)}
              {event.endAt &&
                ` – ${formatTime(event.endAt)} ${formatDateLong(event.endAt)}`}
            </span>
          </li>
          <li className="flex items-start gap-2">
            {event.location.isOnline ? (
              <FiVideo
                aria-hidden
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
              />
            ) : (
              <FiMapPin
                aria-hidden
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-500"
              />
            )}
            <span className="line-clamp-2">
              {event.location.name}
              {event.location.address && `, ${event.location.address}`}
            </span>
          </li>
        </ul>

        <div className="mt-auto pt-5">
          <RegisterButton event={event} />
        </div>
      </div>
    </article>
  );
};

export default EventCard;

/**
 * CTA dang ky su kien:
 *   - upcoming / ongoing: "DANG KY THAM GIA" (brand blue, click -> /su-kien/[slug])
 *   - full (het cho):    "DA DAY" (xam, disabled)
 *   - past (da ket thuc): "DA KET THUC" (xam, disabled)
 *
 * Click vao button di den cung route chi tiet voi phan con lai cua card,
 * giu nguyen quy trinh dang ky hien tai cua he thong. Khi backend co modal
 * dang ky rieng, chuyen onClick mo modal o day.
 */
const RegisterButton = ({ event }: { event: EventItem }) => {
  const isClosed = event.status === 'past';
  const isFull = event.status === 'full';

  if (isClosed) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className="block w-full cursor-not-allowed rounded-xl bg-gray-200 px-4 py-3 text-center text-theme-sm font-bold uppercase tracking-[0.1em] text-gray-500"
      >
        Đã kết thúc
      </button>
    );
  }

  if (isFull) {
    return (
      <button
        type="button"
        disabled
        aria-disabled="true"
        className="block w-full cursor-not-allowed rounded-xl bg-gray-200 px-4 py-3 text-center text-theme-sm font-bold uppercase tracking-[0.1em] text-gray-500"
      >
        Đã đầy
      </button>
    );
  }

  return (
    <Link
      href={`/su-kien/${event.slug}`}
      className="block w-full rounded-xl bg-brand-500 px-4 py-3 text-center text-theme-sm font-bold uppercase tracking-[0.1em] text-white shadow-card transition hover:bg-brand-600"
    >
      Đăng ký tham gia
    </Link>
  );
};
