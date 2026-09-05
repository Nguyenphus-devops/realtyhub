/**
 * Format helpers dung chung cho module events.
 * Tach ra file rieng de ca trang list va trang detail cung dung.
 */

export const formatDateLong = (iso: string): string =>
  new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));

export const formatTime = (iso: string): string =>
  new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
