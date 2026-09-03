'use client';

import Link from 'next/link';
import { FiCheckCircle } from 'react-icons/fi';

/**
 * Buoc cuoi - khong phai form ma la man hinh cong nhan doi tac chinh thuc,
 * nen no khong dung StepPanel (khong co nut nop).
 *
 * NOTE: buoc nay tren trang goc bi khoa, noi dung dung theo mo ta cua buoc.
 */
const PartnerStep = () => (
  <section className="flex min-w-0 flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
    <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--ob-blue-soft)] text-[var(--ob-blue)]">
      <FiCheckCircle className="h-8 w-8" aria-hidden />
    </span>

    <h1 className="text-2xl leading-snug">
      <span className="bg-gradient-to-r from-[var(--ob-blue-ink)] to-[var(--ob-blue)] bg-clip-text font-semibold text-transparent">
        Chúc mừng
      </span>
      <span className="font-medium text-[var(--ob-ink)]">, bạn đã là đối tác chính thức</span>
    </h1>

    <p className="max-w-md text-theme-sm leading-relaxed text-[var(--ob-muted)]">
      Hồ sơ của bạn đã hoàn tất. Bạn có thể bắt đầu nhận giỏ hàng, đăng ký lịch mở bán và theo dõi
      hoa hồng ngay trên Saleplust.
    </p>

    <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
      <Link
        href="/du-an"
        className="inline-flex h-10 items-center rounded-md bg-[var(--ob-blue)] px-5 text-theme-sm font-medium text-white transition-colors hover:bg-[var(--ob-blue-strong)]"
      >
        Khám phá dự án
      </Link>
      <Link
        href="/tai-khoan"
        className="inline-flex h-10 items-center rounded-md border border-[var(--ob-border)] px-5 text-theme-sm font-medium text-[var(--ob-ink)] transition-colors hover:bg-[var(--ob-surface)]"
      >
        Xem hồ sơ của tôi
      </Link>
    </div>
  </section>
);

export default PartnerStep;
