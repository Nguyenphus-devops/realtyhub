'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiHome, FiShoppingCart, FiBook, FiTool } from 'react-icons/fi';

/**
 * Tab bar dien thoai o duoi - 4 muc (Trang chu / Gio hang / Dao tao /
 * Tien ich). Tren desktop (`lg:hidden`) thanh tabs an di vi desktop da
 * co nav inline trong header.
 *
 * Ly do dung path-prefix matching (startsWith):
 *   - Khi user o /gio-hang/an-binh-jewelry, "giohang" van la tab active
 *   - Khi o /dao-tao/khoa-hoc-1, "daotao" van la tab active
 * Mau icon + label phan biet trang "index" voi cac trang con.
 */

const TABS = [
  { label: 'Trang chủ', href: '/', icon: FiHome, exact: true },
  { label: 'Giỏ hàng', href: '/gio-hang', icon: FiShoppingCart, exact: false },
  { label: 'Đào tạo', href: '/dao-tao', icon: FiBook, exact: false },
  { label: 'Tiện ích', href: '/tien-ich', icon: FiTool, exact: false },
] as const;

const MobileBottomTabs = () => {
  const pathname = usePathname();

  // An thanh tabs o 1 so trang dac biet de giao dien khong bi chen:
  //   - Trang login (form can dung het chieu cao khong bi tat ben duoi)
  //   - Trang chat widget (full-screen modal)
  if (pathname === '/login') return null;

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    // Bottom nav: fixed bottom, z-30 (thap hon drawer menu z-50 de drawer
    // phu len khi mo) + env(safe-area-inset-bottom) cho iPhone co "vu khuyet".
    <nav
      aria-label="Điều hướng nhanh"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)] lg:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
    >
      <ul className="flex items-stretch justify-around">
        {TABS.map(({ label, href, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                aria-label={label}
                className={`group flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-semibold uppercase tracking-wide transition ${
                  active
                    ? 'text-brand-600'
                    : 'text-gray-500 active:bg-gray-100'
                }`}
              >
                <span className="relative flex h-6 w-6 items-center justify-center">
                  <Icon
                    aria-hidden
                    className={`h-[22px] w-[22px] transition-transform ${
                      active ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                  />
                </span>
                <span className="leading-none">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default MobileBottomTabs;
