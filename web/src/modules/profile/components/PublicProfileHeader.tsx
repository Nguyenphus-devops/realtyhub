'use client';

import { useEffect, useRef, useState } from 'react';

import { FiEdit2, FiMapPin, FiShare2, FiUserCheck } from 'react-icons/fi';

import { useCurrentUser } from '@/common/auth/userStore';
import UserAvatar from '@/common/components/UserAvatar';

import type { Profile } from '../mocks/profile.mock';

/**
 * Header trang profile public: banner quang cao o tren + avatar + ten +
 * followers + cac chip thong tin (ngay tham gia, dia chi, nut edit/share).
 *
 * Props:
 *   - profile: data user can show
 *   - isOwnByServer: server-side flag (slug trung profile dang xem) -
 *     hien nut "Chinh sua trang" + "Chia se" neu true. Client cung tu
 *     check `useCurrentUser()` de override (cho mock: email trung
 *     `khang@me.example`).
 */
const PublicProfileHeader = ({
  profile,
  isOwnByServer,
}: {
  profile: Profile;
  /**
   * Co phai trang cua user dang xem khong (check o server - mock chi gian
   * la slug trung MOCK_PROFILE.slug). Client tu check them currentUser de
   * override neu user login voi email khang@me.example.
   */
  isOwnByServer: boolean;
}) => {
  const currentUser = useCurrentUser();
  // Mock: chi match voi email khang@me.example de demo (mock user chua co id).
  // TODO backend: so sanh currentUser.id === profile.id.
  const isOwnByClient = !!currentUser && currentUser.email === 'khang@me.example';
  const isOwnProfile = isOwnByServer || isOwnByClient;

  // Banner quang cao - gradient vang cam, gia lap QC (mock).
  return (
    <div>
      {/* Banner QC o tren */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-warning-400 via-warning-500 to-orange-500 p-4 shadow-theme-sm md:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-theme-xs font-semibold uppercase tracking-wider text-white/80">
              Quảng cáo
            </p>
            <p className="mt-1 text-base font-bold text-white md:text-lg">
              Ở Long Châu - Mua thuốc chính hãng, giao tận nhà
            </p>
          </div>
          <span className="hidden rounded-full bg-white/20 px-3 py-1 text-theme-xs font-semibold text-white md:inline">
            Tìm hiểu thêm
          </span>
        </div>
      </div>

      {/* Avatar + ten + followers + chips */}
      <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-start">
        {/* Avatar 112px (md) */}
        <div className="shrink-0">
          <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-white shadow-theme-md md:h-28 md:w-28">
            <UserAvatar
              name={profile.name}
              src={profile.avatar}
              size={112}
              className="!h-full !w-full !rounded-full"
            />
          </div>
        </div>

        {/* Ten + followers + chips */}
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
              {profile.name}
            </h1>
          </div>
          <p className="mt-1 text-theme-xs text-gray-500">
            {profile.followers} người theo dõi
          </p>

          {/* Chip thong tin: ngay tham gia + dia chi + edit + share */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Chip icon={<FiUserCheck aria-hidden />}>{profile.joinedAt}</Chip>
            <Chip icon={<FiMapPin aria-hidden />}>{profile.location}</Chip>
            {isOwnProfile && (
              <>
                <ChipButton icon={<FiEdit2 aria-hidden />} variant="primary">
                  Chỉnh sửa trang
                </ChipButton>
                <ShareButton />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Chip = ({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-theme-xs font-medium text-gray-700">
    <span className="text-gray-500">{icon}</span>
    {children}
  </span>
);

const ChipButton = ({
  icon,
  children,
  variant = 'default',
  onClick,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'primary';
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-theme-xs font-semibold transition ${
      variant === 'primary'
        ? 'border-brand-500 bg-brand-50 text-brand-700 hover:bg-brand-100'
        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
    }`}
  >
    <span className="text-current">{icon}</span>
    {children}
  </button>
);

/**
 * Share button mo popover nho copy link. Dung ref + state vi co the nhieu
 * noi can share sau nay.
 */
const ShareButton = () => {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const onShare = () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(
        () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        },
        // Fallback neu clipboard API bi block
        () => setOpen(true),
      );
    } else {
      setOpen(true);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <ChipButton icon={<FiShare2 aria-hidden />} onClick={() => setOpen((o) => !o)}>
        Chia sẻ
      </ChipButton>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-theme-lg"
        >
          <div className="px-4 py-3 text-theme-xs text-gray-500">
            Sao chép liên kết giới thiệu trang cá nhân
          </div>
          <div className="flex items-center gap-2 border-t border-gray-100 px-3 py-2">
            <input
              readOnly
              value={typeof window !== 'undefined' ? window.location.href : ''}
              className="min-w-0 flex-1 rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-theme-xs text-gray-600 outline-none"
            />
            <button
              type="button"
              onClick={onShare}
              className="shrink-0 rounded-md bg-brand-500 px-3 py-1 text-theme-xs font-semibold text-white hover:bg-brand-600"
            >
              {copied ? 'Đã sao chép' : 'Sao chép'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicProfileHeader;