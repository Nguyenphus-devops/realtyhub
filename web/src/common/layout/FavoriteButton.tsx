'use client';

import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';

import { useFavorites } from '@/common/hooks/useFavorites';

type FavoriteButtonProps = {
  /** Color classes cho icon khi header o trang thai transparent / solid. */
  iconClass: string;
};

/**
 * Icon "Yeu thich" tren header, kiem tra badge so luong du an da luu.
 *
 * Hien thi:
 *   - SSR + lan render dau o client: chi icon (khong badge) -> giu hydration khop.
 *   - Sau khi mount: neu count > 0 thi hien badge so do goc phai-tren.
 *   - Neu count > 99 hien "99+" (gioi han width tranh pha layout).
 *
 * Link toi /yeu-thich (trang chua lam, se tao sau).
 */
const FavoriteButton = ({ iconClass }: FavoriteButtonProps) => {
  const { favorites, isHydrated } = useFavorites();
  const count = favorites.length;

  // Trang yeu thich co the mo sau. Neu muon an luu khi count = 0 van
  // cho click - user co the bookmark tu trang chi tiet va quay lai.
  // Hien thi badge chi khi da hydrate (tranh render khac server/client).
  const showBadge = isHydrated && count > 0;
  const badgeText = count > 99 ? '99+' : String(count);

  return (
    <Link
      href="/yeu-thich"
      aria-label={
        showBadge
          ? `Yêu thích - ${count} dự án đã lưu`
          : 'Yêu thích'
      }
      className={`relative flex h-9 w-9 items-center justify-center rounded-full transition ${iconClass}`}
    >
      <FaHeart aria-hidden className="h-[18px] w-[18px]" />
      {showBadge && (
        <span
          aria-hidden
          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error-500 px-1 text-[10px] font-bold leading-none text-white ring-2 ring-white"
        >
          {badgeText}
        </span>
      )}
    </Link>
  );
};

export default FavoriteButton;