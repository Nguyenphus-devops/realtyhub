import Link from 'next/link';

export default function PhaseNotFound() {
  return (
    <div className="site-container py-20 text-center">
      <p className="text-5xl font-bold text-gray-200">404</p>
      <h1 className="mt-4 text-xl font-bold text-gray-900">Không tìm thấy phân khu</h1>
      <p className="mt-2 text-theme-sm text-gray-500">
        Phân khu bạn tìm có thể đã đổi đường dẫn hoặc chưa được công bố.
      </p>

      <Link
        href="/gio-hang"
        className="mt-6 inline-block rounded-md bg-brand-500 px-5 py-2.5 text-theme-sm font-semibold text-white transition hover:bg-brand-600"
      >
        Về danh sách dự án
      </Link>
    </div>
  );
}
