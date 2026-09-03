import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import LoginForm from '@/modules/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Đăng nhập',
  description: 'Đăng nhập vào RealtyHub để lưu dự án yêu thích và quản lý tài khoản.',
};

/**
 * Trang dang nhap /login.
 *
 * Layout 2 cot desktop:
 *   - Trai: form (LoginForm) trong card trang
 *   - Phai: panel brand co logo + slogan + nen gradient
 * Tren mobile chi hien form, panel brand an.
 *
 * Su dung 'min-h-[calc(100vh-...]' de panel phu toan man hinh tru header/
 * footer; khi header sticky (16 = h-16) + footer (~ 80px) tru ra.
 */
const LoginPage = () => {
  return (
    <section className="flex min-h-[calc(100vh-8rem)] items-stretch">
      {/* Form cot trai */}
      <div className="flex w-full flex-col justify-center px-6 py-10 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Image
              src="/images/home/logo_realtyhub.png"
              alt="RealtyHub"
              width={140}
              height={40}
              className="h-8 w-auto"
            />
          </div>

          <h1 className="text-2xl font-extrabold text-navy-800 md:text-3xl">
            Chào mừng bạn quay lại
          </h1>
          <p className="mt-2 text-theme-sm text-gray-600">
            Đăng nhập để lưu dự án yêu thích, theo dõi lịch mở bán và nhận tư vấn từ chuyên gia.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Panel brand cot phai - chi hien desktop */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-navy-700 via-navy-800 to-brand-600 lg:flex lg:w-1/2">
        {/* Pattern cham tròn mo phong nen */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Vòng tròn lon mo lam accent */}
        <div
          aria-hidden
          className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-400/30 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        />

        <div className="relative z-10 flex w-full flex-col justify-between p-12 text-white">
          <div>
            <Image
              src="/images/home/logo_realtyhub.png"
              alt="RealtyHub"
              width={160}
              height={48}
              className="h-10 w-auto brightness-0 invert"
            />
          </div>

          <div>
            <h2 className="text-3xl font-extrabold leading-tight xl:text-4xl">
              Công nghệ bán hàng
              <br />
              <span className="bg-gradient-to-r from-brand-200 to-white bg-clip-text text-transparent">
                bất động sản
              </span>{' '}
              thế hệ mới
            </h2>
            <p className="mt-4 max-w-md text-theme-sm leading-relaxed text-white/85">
              Tìm dự án bằng AI, so sánh chính sách, đồng bộ khách hàng giữa môi giới và quản trị —
              tất cả trong một nền tảng.
            </p>

            <ul className="mt-8 space-y-3 text-theme-sm">
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-[10px] font-bold">
                  ✓
                </span>
                Tìm dự án bằng AI Search
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-[10px] font-bold">
                  ✓
                </span>
                So sánh chính sách bán hàng
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 text-[10px] font-bold">
                  ✓
                </span>
                Đào tạo môi giới chuyên sâu
              </li>
            </ul>
          </div>

          <p className="text-theme-xs text-white/60">
            © {new Date().getFullYear()} RealtyHub. Nền tảng công nghệ bất động sản.
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;