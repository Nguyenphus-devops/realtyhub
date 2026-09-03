'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  FiChevronDown,
  FiLogOut,
  FiSettings,
  FiUser,
  FiUserCheck,
} from 'react-icons/fi';

import {
  hasAdminAccess,
  useCurrentUser,
  useLogout,
  type UserRole,
} from '@/common/auth/userStore';
import UserAvatar from '@/common/components/UserAvatar';

/**
 * Popover tai khoan hien thi khi bam vao icon user tren header.
 *
 * Cau truc (top -> bottom):
 *   - Header: avatar (placeholder chu cai dau neu khong co anh) + ten + email
 *   - Link: "Trang quan tri" - chi hien neu role la ADMIN/SUPER_ADMIN
 *   - Link: "Ngon ngu" - toggle VI/EN (stub, chi luu state local)
 *   - Link: "Cai dat" - placeholder, mo dialog cai dat nguoi dung
 *   - Button: "Dang xuat" - clear localStorage + cookie, redirect /
 *
 * Click ra ngoai hoac nhan Esc se dong popover.
 */

type Lang = 'vi' | 'en';

const LANG_OPTIONS: { code: Lang; label: string }[] = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
];

// URL admin panel hien dang chay o port 5011 theo deploy.sh - link cung
// la relative cho cung host, nguoi dung tu mo o tab moi.
const ADMIN_URL = '/admin';

/** Store khong bao gio doi - chi de phan biet server render voi client render. */
const neverChanges = () => () => {};

const Divider = () => (
  <div aria-hidden className="my-1 h-px bg-gray-100" />
);

const MenuItem = ({
  href,
  onClick,
  icon: Icon,
  children,
  badge,
  danger,
}: {
  href?: string;
  onClick?: () => void;
  icon: typeof FiUser;
  children: React.ReactNode;
  badge?: string;
  danger?: boolean;
}) => {
  const className = `flex w-full items-center gap-3 px-4 py-2.5 text-theme-sm transition ${
    danger
      ? 'text-error-600 hover:bg-error-50'
      : 'text-gray-700 hover:bg-brand-50 hover:text-brand-700'
  }`;
  const inner = (
    <>
      <Icon aria-hidden className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left font-medium">{children}</span>
      {badge && (
        <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold uppercase text-brand-700">
          {badge}
        </span>
      )}
    </>
  );
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={className} role="menuitem">
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={className} role="menuitem">
      {inner}
    </button>
  );
};

const LangSwitcher = ({ current, onChange }: { current: Lang; onChange: (l: Lang) => void }) => (
  <div className="px-4 py-2">
    <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-500">
      Ngôn ngữ
    </div>
    <div
      role="radiogroup"
      aria-label="Ngôn ngữ"
      className="inline-flex rounded-full border border-gray-200 bg-gray-50 p-0.5"
    >
      {LANG_OPTIONS.map((opt) => {
        const active = opt.code === current;
        return (
          <button
            key={opt.code}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.code)}
            className={`rounded-full px-3 py-1 text-theme-xs font-semibold transition ${
              active
                ? 'bg-white text-brand-700 shadow-theme-xs'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {opt.code.toUpperCase()}
          </button>
        );
      })}
    </div>
  </div>
);

const AccountMenu = () => {
  const pathname = usePathname();
  const user = useCurrentUser();
  const logout = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<Lang>('vi');
  const containerRef = useRef<HTMLDivElement>(null);

  // `useCurrentUser` doc localStorage ngay trong lan render dau, nhung server
  // khong co localStorage nen luon ra null -> hai ben ve ra hai cay khac nhau
  // va React bao hydration mismatch. Hoan viec ve theo user den sau khi mount:
  // lan ve dau o client dung snapshot cua server (false) nen khop, ngay sau do
  // React doi sang snapshot client (true) va ve lai voi user that.
  const isMounted = useSyncExternalStore(neverChanges, () => true, () => false);

  // Click outside / Esc de dong
  useEffect(() => {
    if (!isOpen) return undefined;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen]);

  // Trang login da co form dang nhap rieng -> khong hien icon user o header
  // de tranh "dang nhap -> dang nhap" vo ly. An luon ca 2 nhanh (login & user).
  // Dat early-return SAU tat ca hook de tuan thu rules-of-hooks.
  if (pathname === '/login') return null;

  // SSR placeholder: giu div container voi chieu cao co dinh de layout
  // khong nhay khi hydrate xong (tranh CLS). Server va client render
  // cung mot markup o lan dau -> khong hydration mismatch.
  if (!isMounted) {
    return (
      <div className="flex h-9 items-center" aria-hidden>
        <span className="h-9 w-9 rounded-full bg-gray-100" />
      </div>
    );
  }

  const close = () => setIsOpen(false);

  const onChangeLang = (l: Lang) => {
    setLang(l);
    // Stub: chi luu state local. Sau nay noi backend / next-intl, doi o day.
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('lang', l);
      window.dispatchEvent(new Event('lang:change'));
    }
  };

  // Neu chua dang nhap: chi hien nut dang nhhap di vao trang login (chua co).
  if (!user) {
    return (
      <Link
        href="/login"
        aria-label="Đăng nhập"
        className="flex h-9 items-center gap-1.5 rounded-full bg-brand-500 px-3 text-theme-sm font-semibold text-white transition hover:bg-brand-600"
      >
        <FiUser aria-hidden />
        <span className="hidden sm:inline">Đăng nhập</span>
      </Link>
    );
  }

  const canAdmin = hasAdminAccess(user.role as UserRole);

  return (
    <div className="relative flex items-center" ref={containerRef}>
      {/* Avatar -> di den trang tai khoan cua user dang login. Truoc day
          link den /ho-so/{slug} (public profile) nhung user hay bam nham
          mong muon xem trang thong tin ca nhan cua minh. Mac dinh giup
          user vao trang /tai-khoan nhanh nhat khi bam avatar. */}
      <Link
        href="/tai-khoan"
        aria-label="Mở trang tài khoản"
        className="rounded-full p-0.5 transition hover:bg-brand-50"
      >
        <UserAvatar name={user.name} src={user.avatar} size={40} />
      </Link>
      {/* Chevron -> mo/dong popover menu. Tach khoi avatar de click
          avatar khong bi mo popover (UX nguoi dung rat hay bam nham). */}
      <button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Mở menu tài khoản"
        className="flex h-9 w-7 items-center justify-center rounded-full text-gray-500 transition hover:bg-brand-50 hover:text-brand-700"
      >
        <FiChevronDown
          aria-hidden
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Tài khoản"
          className="absolute right-0 top-full z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-theme-lg"
        >
          {/* Header: avatar + ten + email + role badge */}
          <div className="flex items-center gap-3 px-4 py-3">
            <UserAvatar name={user.name} src={user.avatar} size={40} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-theme-sm font-semibold text-gray-900">{user.name}</div>
              <div className="truncate text-theme-xs text-gray-500">{user.email}</div>
              <div className="mt-1">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    canAdmin
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <Divider />

          {/* Link toi trang ho so (chua co trang - placeholder) */}
          <MenuItem href="/tai-khoan" onClick={close} icon={FiUserCheck}>
            Thông tin tài khoản
          </MenuItem>

          {canAdmin && (
            <MenuItem href={ADMIN_URL} onClick={close} icon={FiUser} badge="Admin">
              Trang quản trị
            </MenuItem>
          )}

          <Divider />

          <LangSwitcher current={lang} onChange={onChangeLang} />

          <MenuItem href="/cai-dat" onClick={close} icon={FiSettings}>
            Cài đặt
          </MenuItem>

          <Divider />

          <MenuItem onClick={() => { close(); logout(); }} icon={FiLogOut} danger>
            Đăng xuất
          </MenuItem>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;