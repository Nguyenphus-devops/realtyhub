'use client';

import { FiCalendar, FiEdit3, FiLogOut, FiMapPin, FiUsers } from 'react-icons/fi';

import { useLogout } from '@/common/auth/userStore';
import UserAvatar from '@/common/components/UserAvatar';

import type { Profile } from '../mocks/profile.mock';

/**
 * The ProfileStat hien thi tren hero card: so + icon + label.
 * Icon thay vi chi so lien quan giup scan nhanh (Users = "nguoi theo doi").
 */
const STAT_ICONS: Record<string, typeof FiUsers> = {
  followers: FiUsers,
  following: FiUsers,
  joined: FiCalendar,
} as const;

/**
 * Header trang /tai-khoan.
 *
 * Thiet ke 2026: clean SaaS dashboard (Stripe / Linear style):
 *   - Nen trang, border nhe, khong gradient dam
 *   - Avatar 80px + edit overlay (icon nho, hover reveal)
 *   - Stats 3 cot: icon + so lon + label nho - scan nhanh
 *   - Meta row: location + joined date (anh huong nho)
 *   - Action "Dang xuat" ghost button, canh phai (desktop)
 *
 * Layout responsive:
 *   - mobile: stack (avatar top, stats grid 3 cot, CTA full-width)
 *   - desktop: row (avatar + info left, action right)
 */
const ProfileCard = ({ profile }: { profile: Profile }) => {
  const logout = useLogout();

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-sm">
      <div className="p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* Avatar + info */}
          <div className="flex flex-col items-center gap-5 md:flex-row md:items-start">
            {/* Avatar co nut edit overlay (hover reveal tren desktop) */}
            <div className="group relative shrink-0">
              <div className="relative h-20 w-20 overflow-hidden rounded-full ring-4 ring-gray-50 md:h-24 md:w-24">
                <UserAvatar
                  name={profile.name}
                  src={profile.avatar}
                  size={96}
                  className="!h-full !w-full !rounded-full"
                />
              </div>
              <button
                type="button"
                aria-label="Đổi ảnh đại diện"
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-brand-500 text-white shadow-theme-md transition hover:scale-105 hover:bg-brand-600"
              >
                <FiEdit3 aria-hidden className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Ten + email + meta */}
            <div className="min-w-0 flex-1 text-center md:text-left">
              <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
                {profile.name}
              </h1>
              <p className="mt-0.5 text-theme-sm text-gray-500">{profile.email}</p>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-theme-xs text-gray-600 md:justify-start">
                <span className="inline-flex items-center gap-1">
                  <FiMapPin aria-hidden className="h-3.5 w-3.5 text-gray-400" />
                  {profile.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  <FiCalendar aria-hidden className="h-3.5 w-3.5 text-gray-400" />
                  {profile.joinedAt}
                </span>
              </div>
            </div>
          </div>

          {/* Action: dang xuat - desktop only, mobile xuong duoi */}
          <button
            type="button"
            onClick={logout}
            className="hidden shrink-0 items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-theme-sm font-medium text-gray-700 shadow-theme-xs transition hover:border-gray-400 hover:bg-gray-50 md:inline-flex"
          >
            <FiLogOut aria-hidden className="h-4 w-4" />
            Đăng xuất
          </button>
        </div>

        {/* Stats row - 3 cot, desktop full-width voi border-top */}
        <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-100 pt-6 md:gap-8">
          {profile.stats.map((stat) => {
            const Icon = STAT_ICONS[stat.key] ?? FiUsers;
            return (
              <div key={stat.key} className="flex flex-col items-center md:items-start">
                <div className="flex items-center gap-2">
                  <Icon aria-hidden className="h-4 w-4 text-gray-400" />
                  <span className="text-2xl font-bold text-gray-900 md:text-3xl">
                    {stat.value}
                  </span>
                </div>
                <span className="mt-1 text-theme-xs text-gray-500">{stat.label}</span>
              </div>
            );
          })}
        </div>

        {/* Mobile CTA */}
        <button
          type="button"
          onClick={logout}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs transition hover:border-gray-400 hover:bg-gray-50 md:hidden"
        >
          <FiLogOut aria-hidden className="h-4 w-4" />
          Đăng xuất
        </button>
      </div>
    </section>
  );
};

export default ProfileCard;
