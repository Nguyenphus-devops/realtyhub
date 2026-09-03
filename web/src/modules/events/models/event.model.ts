/**
 * Hop dong models cho module events.
 *
 * Khi co backend:
 *   - EventType / EventStatus se enum trong backend
 *   - Event co them field: organizer, speakers, agenda, gallery, materials
 *   - PaginatedEvent { items, total, page, pageSize }
 *
 * Type chinh:
 *   - EventType: 'workshop' | 'seminar' | 'networking' | 'open-house' | 'webinar'
 *   - EventStatus: 'upcoming' | 'ongoing' | 'past' | 'full'
 */

export type EventType = 'workshop' | 'seminar' | 'networking' | 'open-house' | 'webinar';

export type EventStatus = 'upcoming' | 'ongoing' | 'past' | 'full';

export type EventLocation = {
  /** Ten dia diem (VD: "RealtyHub Hub Quan 1" hoặc "Online") */
  name: string;
  /** Dia chi day du (null neu online) */
  address?: string;
  /** URL neu online (Google Meet / Zoom) */
  onlineUrl?: string;
  /** True neu su kien online */
  isOnline: boolean;
};

/** 1 speaker/giang vien cua su kien */
export type EventSpeaker = {
  publicId: string;
  name: string;
  role: string;
  /** Initials hien thi trong avatar placeholder */
  initials?: string;
};

export type EventItem = {
  publicId: string;
  slug: string;
  title: string;
  /** Mo ta ngan (1-2 cau, hien thi o card) */
  excerpt: string;
  /** Mo ta day du (cho trang detail, optional o list) */
  description?: string;
  /** Loai su kien */
  type: EventType;
  /** Trang thai tinh theo ngay gio hien tai */
  status: EventStatus;
  /** Ngay gio bat dau (ISO 8601) */
  startAt: string;
  /** Ngay gio ket thuc (ISO 8601) - optional */
  endAt?: string;
  /** Dia diem to chuc */
  location: EventLocation;
  /** Tong so cho (null neu khong gioi han) */
  capacity?: number;
  /** So da dang ky */
  registered: number;
  /** Hinh thuc tham du: 'free' | 'paid' */
  isFree: boolean;
  /** Gia neu co (VND) */
  price?: number;
  /** Danh sach speakers */
  speakers?: EventSpeaker[];
  /** Tags phu (VD: 'CRM', 'Phap ly', 'Marketing') */
  tags?: string[];
  /** Anh bia. Su kien online khong co dia diem that nen de trong. */
  coverImage?: string;
  /** URL thumbnail (chua co -> PlaceholderThumb) */
  thumbnailUrl?: string;
};

// ============================================================================
// Lookups (mapping cho UI)
// ============================================================================

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  workshop: 'Workshop',
  seminar: 'Hội thảo',
  networking: 'Networking',
  'open-house': 'Open House',
  webinar: 'Webinar',
};

/** Tone per type (match design system: brand/orange/cyan/purple/green/red/gold/teal) */
export const EVENT_TYPE_TONE: Record<
  EventType,
  { chip: string; icon: string; accent: string; hero: string }
> = {
  workshop: {
    chip: 'bg-orange-50 text-orange-700',
    icon: 'bg-orange-500 text-white',
    accent: 'text-orange-600',
    hero: 'from-orange-500 to-orange-700',
  },
  seminar: {
    chip: 'bg-brand-50 text-brand-700',
    icon: 'bg-brand-500 text-white',
    accent: 'text-brand-600',
    hero: 'from-brand-500 to-brand-700',
  },
  networking: {
    chip: 'bg-purple-50 text-purple-700',
    icon: 'bg-purple-500 text-white',
    accent: 'text-purple-600',
    hero: 'from-purple-500 to-purple-700',
  },
  'open-house': {
    chip: 'bg-green-50 text-green-700',
    icon: 'bg-green-500 text-white',
    accent: 'text-green-600',
    hero: 'from-green-500 to-green-700',
  },
  webinar: {
    chip: 'bg-cyan-50 text-cyan-700',
    icon: 'bg-cyan-500 text-white',
    accent: 'text-cyan-600',
    hero: 'from-cyan-500 to-cyan-700',
  },
};

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  upcoming: 'Sắp diễn ra',
  ongoing: 'Đang diễn ra',
  past: 'Đã kết thúc',
  full: 'Đã đầy',
};

/** Filter chip dung o page list (bao gom "Tat ca") */
export const EVENT_TYPE_FILTERS: ReadonlyArray<EventType> = [
  'workshop',
  'seminar',
  'networking',
  'open-house',
  'webinar',
];