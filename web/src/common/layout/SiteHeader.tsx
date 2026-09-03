'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiBell, FiChevronDown, FiMenu, FiMessageSquare, FiX } from 'react-icons/fi';
import { FaRegHeart } from 'react-icons/fa';
import AccountMenu from '@/common/components/AccountMenu';
import FavoriteButton from '@/common/layout/FavoriteButton';

const NAV_ITEMS = [
  { label: 'Giới thiệu', href: '/gioi-thieu' },
  { label: 'giỏ hàng', href: '/gio-hang' },
  { label: 'Đào tạo', href: '/dao-tao' },
  { label: 'Tiện ích', href: '/tien-ich' },
  { label: 'Tin tức', href: '/tin-tuc' },
    { label: 'Sự kiện', href: '/su-kien' },
];

/** Nhom "Khac" hien thi dropdown o desktop. 3 muc con nay cu cung duoc
    an tu header (chi truy cap qua dropdown) de tranh lap 2 lan. */
const MORE_MENU = {
  label: 'mục Khác',
  children: [
    { label: 'Trở thành môi giới', href: '/tro-thanh-moi-gioi' },
    { label: 'So sánh dự án & căn hộ', href: '/so-sanh' },
    { label: 'So sánh chính sách', href: '/so-sanh-chinh-sach' },
    { label: 'Liên hệ chúng tôi', href: '/lien-he-chung-toi' },
    { label: 'Góp ý & phản hồi', href: '/gop-y-va-phan-hoi' },
    { label: 'Hướng dẫn sử dụng', href: '/huong-dan' },
  ],
};

const BrandMark = () => (
  <Link href="/" className="flex items-center" aria-label="Trang chủ">
    <Image
      src="/images/home/realtyhub_new.svg"
      alt="RealtyHub"
      priority
      width={180}
      height={60}
      className="h-12 w-auto"
    />
  </Link>
);

/**
 * Mot quick action trong ngan keo mobile (Tin nhan / Yeu thich / Thong bao).
 *
 * Layout: icon + label ngan phia duoi - phu hop voi chieu rong ngan keo
 * (khoang 360px max-w-sm). Icon co badge neu co. Bam se auto-close drawer
 * de nguoi dung thay ngay trang dich dang load.
 */
const DrawerActionItem = ({
  href,
  icon,
  label,
  badge,
  onClose,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  badge?: string;
  onClose: () => void;
}) => (
  <li className="flex-1">
    <Link
      href={href}
      onClick={onClose}
      className="group relative flex flex-col items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-theme-xs font-semibold text-gray-700 transition hover:bg-brand-50 hover:text-brand-700"
    >
      <span className="relative flex h-9 w-9 items-center justify-center text-lg">
        {icon}
        {badge && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error-500 px-1 text-[10px] font-bold leading-none text-white">
            {badge}
          </span>
        )}
      </span>
      <span className="leading-none">{label}</span>
    </Link>
  </li>
);

const SiteHeader = () => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const moreRef = useRef<HTMLLIElement>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const isMoreActive = MORE_MENU.children.some((c) => isActive(c.href));

  // Trang chu: header trong suot de banner noi bat; cuon xuong thi chuyen
  // sang solid (trang + border) de noi dung ben duoi doc duoc. Cac trang
  // khac luon solid, khong lang nghe scroll.
  useEffect(() => {
    if (pathname !== '/') return undefined;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 24);
        frame = 0;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);

  // Dong dropdown "Khac" khi:
  //  - click ra ngoai
  //  - nhan Esc
  //  - chuyen trang (pathname thay doi)
  useEffect(() => {
    if (!isMoreOpen) return undefined;
    const onClick = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setIsMoreOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMoreOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isMoreOpen]);

  // Ngan keo phu kin man hinh: khoa cuon nen va cho Escape dong lai
  useEffect(() => {
    if (!isMobileOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isMobileOpen]);

  const variant: 'solid' | 'transparent' =
    pathname === '/' && !isScrolled ? 'transparent' : 'solid';
  const isTransparent = variant === 'transparent';
  const headerColor = isTransparent
    ? 'bg-transparent border-transparent'
    : 'bg-white border-gray-200';
  const navColor = isTransparent
    ? {
        active: 'text-white underline decoration-white decoration-2 underline-offset-8',
        idle: 'text-white/85 hover:text-white',
      }
    : {
        active: 'text-navy-700 underline decoration-brand-500 decoration-2 underline-offset-8',
        idle: 'text-gray-600 hover:text-brand-600',
      };
  const iconColor = isTransparent
    ? 'text-white/90 hover:bg-white/15 hover:text-white'
    : 'text-gray-500 hover:bg-gray-100 hover:text-brand-600';
  // Mau dropdown "Khac" - mo phong theo tone header (trang / den).
  const moreBtnActive = isMoreActive
    ? navColor.active
    : navColor.idle;
  const dropdownPanelClass = isTransparent
    ? 'border border-white/20 bg-black/80 backdrop-blur-md'
    : 'border border-gray-200 bg-white shadow-theme-lg';
  const dropdownItemClass = isTransparent
    ? 'text-white/85 hover:bg-white/10 hover:text-white'
    : 'text-gray-700 hover:bg-brand-50 hover:text-brand-600';
  const dropdownItemActiveClass = isTransparent
    ? 'bg-white/10 text-white'
    : 'bg-brand-50 text-brand-600';

  return (
    <header className={`sticky top-0 z-40 border-b transition-colors ${headerColor}`}>
      <div className="site-container flex h-16 items-center justify-between gap-4">
        {/* Nut menu mobile dat o goc trai, truoc BrandMark. Tren desktop
            nut nay an di boi lg:hidden (desktop co nav inline). */}
        <button
          type="button"
          onClick={() => setIsMobileOpen((open) => !open)}
          aria-label={isMobileOpen ? 'Đóng menu' : 'Mở menu'}
          aria-expanded={isMobileOpen}
          className={`order-first flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition lg:hidden ${iconColor}`}
        >
          {isMobileOpen ? <FiX aria-hidden /> : <FiMenu aria-hidden />}
        </button>

        <BrandMark />

        <nav aria-label="Điều hướng chính" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                  className={`text-theme-sm font-semibold uppercase tracking-wide transition ${
                    isActive(item.href) ? navColor.active : navColor.idle
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}

            {/* Dropdown "Khac" - desktop */}
            <li className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setIsMoreOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={isMoreOpen}
                aria-current={isMoreActive ? 'page' : undefined}
                className={`inline-flex items-center gap-1 text-theme-sm font-semibold uppercase tracking-wide transition ${moreBtnActive}`}
              >
                {MORE_MENU.label}
                <FiChevronDown
                  aria-hidden
                  className={`h-4 w-4 transition-transform ${isMoreOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isMoreOpen && (
                <div
                  role="menu"
                  aria-label={MORE_MENU.label}
                  className={`absolute right-0 top-full z-50 mt-3 min-w-56 overflow-hidden rounded-xl py-2 ${dropdownPanelClass}`}
                >
                  {MORE_MENU.children.map((child) => {
                    const active = isActive(child.href);
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        role="menuitem"
                        aria-current={active ? 'page' : undefined}
                        onClick={() => setIsMoreOpen(false)}
                        className={`block px-4 py-2.5 text-theme-sm font-medium transition ${
                          active ? dropdownItemActiveClass : dropdownItemClass
                        }`}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          {/* Ba icon nhanh (Tin nhan, Yeu thich, Thong bao) chi hien tren
              desktop. Tren mobile chung duoc dua vao ngan keo (xem drawer
              ben duoi) de giam chen chan header va tap trung vao dieu
              huong chinh. */}
          <Link
            href="/tin-nhan"
            aria-label="Tin nhắn"
            className={`hidden lg:flex h-9 w-9 items-center justify-center rounded-full transition ${iconColor}`}
          >
            <FiMessageSquare aria-hidden />
          </Link>

          {/* Icon yeu thich: badge so du an da luu. Component tu handle
              SSR (khong badge lan dau) + hydrate sau mount. */}
          <FavoriteButton iconClass={`hidden lg:flex ${iconColor}`} />

          <Link
            href="/thong-bao"
            aria-label="Thông báo"
            className={`relative hidden lg:flex h-9 w-9 items-center justify-center rounded-full transition ${iconColor}`}
          >
            <FiBell aria-hidden />
            <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error-500 px-1 text-[10px] font-bold text-white">
              3
            </span>
          </Link>

          {/* Account popover: avatar + ten neu da dang nhap, hoac nut "Dang nhap"
              neu chua. Click mo menu xo ra voi cac tuy chon tai khoan. */}
          <AccountMenu />
        </div>
      </div>

      {/* ── Ngan keo dieu huong tren dien thoai ─────────────────────────────
          Truot tu mep trai, phu het chieu cao - khac han kieu xo xuong duoi
          header truoc day. Nen luon trang du header dang trong suot: chu tren
          nen anh se khong doc duoc. */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            aria-hidden
            onClick={() => setIsMobileOpen(false)}
            className="absolute inset-0 bg-gray-900/50"
          />

          <nav
            aria-label="Điều hướng di động"
            className="absolute inset-y-0 left-0 flex w-[86%] max-w-sm flex-col bg-white shadow-panel"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">
              <span onClick={() => setIsMobileOpen(false)}>
                <BrandMark />
              </span>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                aria-label="Đóng menu"
                className="flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100"
              >
                <FiX aria-hidden className="text-xl" />
              </button>
            </div>

            {/* Khu vuc quick actions tren mobile: 3 icon Tin nhan / Yeu
                thich / Thong bao. Dat len dau ngan keo de user mo menu
                la thay ngay, khong phai cuon xuong moi tim. */}
            <ul
              aria-label="Truy cập nhanh"
              className="flex shrink-0 items-stretch border-b border-gray-200 px-2 py-2"
            >
              <DrawerActionItem
                href="/tin-nhan"
                icon={<FiMessageSquare aria-hidden />}
                label="Tin nhắn"
                onClose={() => setIsMobileOpen(false)}
              />
              <DrawerActionItem
                href="/yeu-thich"
                icon={<FaRegHeart aria-hidden />}
                label="Yêu thích"
                onClose={() => setIsMobileOpen(false)}
              />
              <DrawerActionItem
                href="/thong-bao"
                icon={<FiBell aria-hidden />}
                label="Thông báo"
                badge="3"
                onClose={() => setIsMobileOpen(false)}
              />
            </ul>

            <ul className="flex-1 overflow-y-auto">
              {NAV_ITEMS.map((item) => (
                <li key={item.href} className="border-b border-gray-100">
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                    className={`block px-5 py-4 text-base font-medium capitalize transition hover:bg-gray-50 ${
                      isActive(item.href) ? 'text-brand-600' : 'text-gray-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}

              {/* Nhom "Khac" - dung <details> de khong phai them state rieng.
                  Mac dinh mo neu co muc con dang active. */}
              <li className="border-b border-gray-100">
                <details open={isMoreActive} className="group">
                  <summary
                    className={`flex cursor-pointer list-none items-center justify-between px-5 py-4 text-base font-medium capitalize transition hover:bg-gray-50 ${
                      isMoreActive ? 'text-brand-600' : 'text-gray-800'
                    }`}
                  >
                    {MORE_MENU.label}
                    <FiChevronDown
                      aria-hidden
                      className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                    />
                  </summary>
                  <ul className="bg-gray-50 pb-1">
                    {MORE_MENU.children.map((child) => {
                      const active = isActive(child.href);
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setIsMobileOpen(false)}
                            aria-current={active ? 'page' : undefined}
                            className={`block py-3 pl-9 pr-5 text-theme-sm transition hover:text-brand-600 ${
                              active ? 'font-semibold text-brand-600' : 'text-gray-600'
                            }`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </details>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default SiteHeader;