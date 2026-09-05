import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

export default function ChuDauTuNotFound() {
  return (
    <main className="site-container flex flex-col items-center justify-center py-24 text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-theme-xs font-bold uppercase tracking-[0.22em] text-brand-600">
        404
      </span>

      <h1 className="mt-6 text-3xl font-bold uppercase tracking-tight text-navy-800 md:text-4xl">
        Không tìm thấy chủ đầu tư
      </h1>

      <p className="mt-3 max-w-md text-theme-sm leading-relaxed text-gray-600">
        Chủ đầu tư bạn tìm không còn trên hệ thống hoặc đã được đổi tên.
        Vui lòng quay lại danh sách và chọn một chủ đầu tư khác.
      </p>

      <Link
        href="/chu-dau-tu"
        className="group mt-8 inline-flex items-center gap-2 rounded-full bg-brand-500 px-6 py-3 text-theme-sm font-semibold text-white shadow-card-hover transition hover:bg-brand-600"
      >
        <FiArrowLeft aria-hidden className="transition-transform group-hover:-translate-x-1" />
        Về danh sách chủ đầu tư
      </Link>
    </main>
  );
}
