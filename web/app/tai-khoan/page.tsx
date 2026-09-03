'use client';

import React from 'react';
import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';

import MenuSection from '@/modules/profile/components/MenuSection';
import ProfileCard from '@/modules/profile/components/ProfileCard';
import WalletCard from '@/modules/profile/components/WalletCard';
import { MOCK_PROFILE } from '@/modules/profile/mocks/profile.mock';

/**
 * Trang /tai-khoan - Thong tin ca nhan.
 *
 * Layout 2026 (Stripe / Linear dashboard style):
 *   - Breadcrumb header (top)
 *   - 2-column desktop:
 *       left (sticky):  ProfileCard + WalletCard
 *       right:           Sections menu (Tien ich, Dich vu, Uu dai, Khac)
 *   - 1-column mobile (stack everything)
 *
 * ProfileCard can client vi dung useLogout(). Page nay van la server
 * component, React xu ly boundary.
 */
const TaiKhoanPage = () => {
  const profile = MOCK_PROFILE;

  return (
    <div className="bg-gray-50/50">
      <div className="site-container py-6 md:py-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-4 md:mb-6">
          {/* Tren dien thoai ca cum dau trang can giua cho khop voi the ho so
              ben duoi (avatar + ten deu can giua). Tu md tro len quay ve can
              trai theo bo cuc 2 cot. */}
          <ol className="flex items-center justify-center gap-1.5 text-theme-xs text-gray-500 md:justify-start">
            <li>
              <Link
                href="/"
                className="inline-flex items-center gap-1 transition hover:text-brand-600"
              >
                <FiHome aria-hidden className="h-3.5 w-3.5" />
                Trang chủ
              </Link>
            </li>
            <li aria-hidden>
              <FiChevronRight className="h-3.5 w-3.5 text-gray-300" />
            </li>
            <li className="font-medium text-gray-700" aria-current="page">
              Tài khoản
            </li>
          </ol>
        </nav>

        {/* Page header */}
        <header className="mb-6 text-center md:mb-8 md:text-left">
          <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Tài khoản của tôi
          </h1>
          <p className="mt-1 text-theme-sm text-gray-600">
            Quản lý thông tin cá nhân, dịch vụ và ưu đãi của bạn.
          </p>
        </header>

        {/* Main grid - sidebar (left) + content (right) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          {/* Sidebar - sticky tren desktop */}
          <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
            <ProfileCard profile={profile} />
            <WalletCard wallet={profile.wallet} />
          </aside>

          {/* Content - cac section menu */}
          <div className="space-y-6">
            <MenuSection
              title="Tiện ích"
              description="Quản lý nội dung và hoạt động của bạn"
              items={profile.utilities}
            />

            <MenuSection
              title="Dịch vụ trả phí"
              description="Nâng cấp để mở rộng khả năng tiếp cận"
              items={profile.paidServices}
            />

            <MenuSection
              title="Ưu đãi, khuyến mãi"
              description="Chương trình đang diễn ra"
              items={profile.promotions}
            />

            <MenuSection
              title="Khác"
              description="Cài đặt và hỗ trợ"
              items={profile.others}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaiKhoanPage;
