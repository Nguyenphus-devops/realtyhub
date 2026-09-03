'use client';

import Link from 'next/link';
import { FiChevronRight } from 'react-icons/fi';

import type { MenuItem as MenuItemType } from '../mocks/profile.mock';

const TONE_TILE: Record<string, string> = {
  brand: 'bg-brand-50 text-brand-600',
  navy: 'bg-navy-50 text-navy-700',
  warning: 'bg-warning-50 text-warning-700',
  success: 'bg-success-50 text-success-700',
  gray: 'bg-gray-100 text-gray-600',
  accent: 'bg-accent-50 text-accent-600',
};

const BADGE_STYLES: Record<string, string> = {
  // Badge "Moi" - xanh nhat
  new: 'bg-success-500 text-white',
  // Badge "Tao ngay" - vang gold
  gold: 'bg-warning-500 text-white',
  // Badge "PRO" - navy, in dam
  pro: 'bg-navy-700 text-white',
};

/**
 * Mot dong item: icon tile + label + description + arrow, co the kem badge.
 * Click vao: neu co `href` -> next/link; neu khong -> div vo hieu.
 *
 * Design 2026: tile icon 40px square (khong phai 44x44 emoji), hover bg nhe,
 * arrow chi xuat hien on hover de giam visual noise.
 */
const MenuItem = ({ item }: { item: MenuItemType }) => {
  const { icon: Icon, description } = item;
  const tileClass = TONE_TILE[item.tone] ?? TONE_TILE.gray;
  const badgeClass = BADGE_STYLES[item.badge?.variant ?? 'new'];

  const inner = (
    <>
      {/* Icon tile - hinh vuong 40px */}
      <span
        aria-hidden
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${tileClass}`}
      >
        <Icon className="h-5 w-5" />
      </span>

      {/* Label + description + badge */}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="truncate text-theme-sm font-semibold text-gray-900">
            {item.label}
          </span>
          {item.badge && (
            <span
              className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeClass}`}
            >
              {item.badge.text}
            </span>
          )}
        </span>
        {description && (
          <span className="mt-0.5 block truncate text-theme-xs text-gray-500">
            {description}
          </span>
        )}
      </span>

      {/* Arrow ben phai - chi hien on hover (md+) */}
      <FiChevronRight
        aria-hidden
        className="h-4 w-4 shrink-0 text-gray-400 transition-opacity group-hover:text-brand-500 md:opacity-0 md:group-hover:opacity-100"
      />
    </>
  );

  const className =
    'group flex w-full items-center gap-3 px-4 py-3.5 transition hover:bg-gray-50 active:bg-gray-100';

  if (item.href) {
    return (
      <Link href={item.href} className={className}>
        {inner}
      </Link>
    );
  }
  return <div className={className}>{inner}</div>;
};

/**
 * Section: card trang boc mot list menu items. Co title section (khong
 * bat buoc) + divider giua cac item.
 */
const MenuSection = ({
  title,
  items,
  description,
  variant = 'default',
}: {
  title?: string;
  items: MenuItemType[];
  description?: string;
  variant?: 'default' | 'warning' | 'error';
}) => {
  const borderClass =
    variant === 'warning'
      ? 'border-warning-500/30'
      : variant === 'error'
        ? 'border-error-500/30'
        : 'border-gray-200';

  return (
    <section className={`overflow-hidden rounded-2xl border bg-white shadow-theme-sm ${borderClass}`}>
      {(title || description) && (
        <header className="border-b border-gray-100 px-5 py-4">
          {title && (
            <h2 className="text-theme-sm font-semibold text-gray-900">{title}</h2>
          )}
          {description && (
            <p className="mt-0.5 text-theme-xs text-gray-500">{description}</p>
          )}
        </header>
      )}
      <ul className="divide-y divide-gray-100">
        {items.map((item, idx) => (
          <li key={`${item.label}-${idx}`}>
            <MenuItem item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default MenuSection;
