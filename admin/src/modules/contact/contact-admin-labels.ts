import type {
  ContactProcessingStatus,
  ContactRequestType,
} from './models/contact.model';

export const formatContactDateTimeVi = (iso: string) => {
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
};

export const CONTACT_STATUS_LABEL_VI: Record<ContactProcessingStatus, string> =
  {
    pending: 'Chờ xử lý',
    acknowledged: 'Đã tiếp nhận',
    confirmed: 'Đã xác nhận',
    closed: 'Đã đóng',
  };

export const CONTACT_REQUEST_TYPE_LABEL_VI: Record<
  ContactRequestType,
  string
> = {
  general: 'Liên hệ chung',
  table: 'Đặt bàn / sự kiện',
  consultation: 'Tư vấn',
};

export const contactStatusBadgeClass = (
  status: ContactProcessingStatus,
): string => {
  switch (status) {
    case 'pending':
      return 'bg-amber-50 text-amber-900 ring-amber-100';
    case 'acknowledged':
      return 'bg-sky-50 text-sky-900 ring-sky-100';
    case 'confirmed':
      return 'bg-emerald-50 text-emerald-900 ring-emerald-100';
    case 'closed':
      return 'bg-slate-100 text-slate-700 ring-slate-200';
    default:
      return 'bg-gray-50 text-gray-800 ring-gray-100';
  }
};
