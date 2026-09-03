'use client';

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { FiCheck, FiChevronDown, FiSearch, FiX } from 'react-icons/fi';
import { matchesVi } from '../utils/text';

export type SelectOption = {
  value: string;
  label: string;
};

/** Khoang cach tu nut bam den menu */
const MENU_GAP = 6;
const MENU_MAX_HEIGHT = 320;
const MENU_MIN_WIDTH = 224;
/** Mep man hinh - menu khong duoc dinh sat vien */
const VIEWPORT_PADDING = 8;
/** It hon nguong nay thi khong can o tim trong menu */
const SEARCH_THRESHOLD = 7;

/** Toa do menu, tinh theo viewport vi menu dung position: fixed */
type MenuPosition = {
  left: number;
  width: number;
  maxHeight: number;
  /** Mo xuong duoi: dat top. Mo len tren: dat bottom. Chi mot trong hai co gia tri. */
  top: number | null;
  bottom: number | null;
};

const RESET_VALUE = '__all__';

/**
 * 'field' - o loc cao 44px chiem tron chieu ngang, dung trong bang loc.
 * 'chip'  - vien bo tron cao 36px co gian theo noi dung, dung tren hang chip
 *           duoi thanh tim kiem. Chi khac phan nut bam, menu giong het nhau.
 */
export type FilterSelectVariant = 'field' | 'chip';

type FilterSelectProps = {
  /** Vua la placeholder, vua la nhan cho trinh doc man hinh */
  label: string;
  value: string | null;
  options: SelectOption[];
  isLoading?: boolean;
  /** Icon dan dau, giup quet mat nhanh ra o loc can tim */
  icon?: ReactNode;
  /** Nhan cho dong "bo chon" dau danh sach */
  resetLabel?: string;
  variant?: FilterSelectVariant;
  onChange: (value: string | null) => void;
  className?: string;
};

/**
 * O loc dang combobox: nut bam + menu noi.
 *
 * Vi sao khong dung <select> that: select khong style duoc phan menu tren
 * Windows/Android, khong go tim trong danh sach duoc, va danh sach chu dau tu
 * co the dai hang chuc dong. Doi lai, phai tu lam day du ban phim va ARIA -
 * xem phan xu ly phim ben duoi.
 */
const FilterSelect = ({
  label,
  value,
  options,
  isLoading = false,
  icon,
  resetLabel = 'Tất cả',
  variant = 'field',
  onChange,
  className = '',
}: FilterSelectProps) => {
  const reactId = useId();
  const listboxId = `${reactId}-listbox`;
  const optionId = (index: number) => `${reactId}-option-${index}`;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState<MenuPosition | null>(null);

  const selected = options.find((option) => option.value === value) ?? null;
  const hasSearch = options.length >= SEARCH_THRESHOLD;

  const filtered = useMemo(
    () =>
      query.trim()
        ? options.filter((option) => matchesVi(option.label, query))
        : options,
    [options, query],
  );

  // Dong "Tat ca" chi xuat hien khi khong go tim - no khong phai ket qua tim kiem.
  // rows la danh sach that dang hien, moi phep dieu huong ban phim deu chay tren no.
  const rows = useMemo<SelectOption[]>(
    () =>
      query.trim() ? filtered : [{ value: RESET_VALUE, label: resetLabel }, ...filtered],
    [filtered, query, resetLabel],
  );

  // ── Vi tri menu ──────────────────────────────────────────────────────────
  const reposition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom - MENU_GAP - VIEWPORT_PADDING;
    const spaceAbove = rect.top - MENU_GAP - VIEWPORT_PADDING;
    // Chi lat len tren khi phia duoi that su chat va phia tren rong hon
    const flipUp = spaceBelow < 200 && spaceAbove > spaceBelow;
    const available = flipUp ? spaceAbove : spaceBelow;

    const width = Math.max(rect.width, MENU_MIN_WIDTH);
    const maxLeft = window.innerWidth - width - VIEWPORT_PADDING;

    setPosition({
      left: Math.max(VIEWPORT_PADDING, Math.min(rect.left, maxLeft)),
      width,
      maxHeight: Math.max(160, Math.min(MENU_MAX_HEIGHT, available)),
      top: flipUp ? null : rect.bottom + MENU_GAP,
      bottom: flipUp ? window.innerHeight - rect.top + MENU_GAP : null,
    });
  }, []);

  // Menu nam trong portal o body nen khong tu di theo nut khi trang cuon.
  // capture: true de bat ca su kien cuon cua cac khung cuon long nhau.
  useLayoutEffect(() => {
    if (!isOpen) return;

    reposition();
    window.addEventListener('scroll', reposition, true);
    window.addEventListener('resize', reposition);

    return () => {
      window.removeEventListener('scroll', reposition, true);
      window.removeEventListener('resize', reposition);
    };
  }, [isOpen, reposition]);

  // ── Mo / dong ────────────────────────────────────────────────────────────
  const closeMenu = useCallback((refocusTrigger = true) => {
    setIsOpen(false);
    setQuery('');
    setActiveIndex(0);
    if (refocusTrigger) triggerRef.current?.focus();
  }, []);

  const openMenu = useCallback(() => {
    setQuery('');
    // Mo ra la con tro nam san o muc dang chon, khong phai o dau danh sach
    const index = value ? options.findIndex((option) => option.value === value) : -1;
    setActiveIndex(index >= 0 ? index + 1 : 0);
    setIsOpen(true);
  }, [options, value]);

  const selectRow = useCallback(
    (row: SelectOption) => {
      onChange(row.value === RESET_VALUE ? null : row.value);
      closeMenu();
    },
    [closeMenu, onChange],
  );

  // Bam ra ngoai thi dong
  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      closeMenu(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen, closeMenu]);

  // Escape phai bat o pha capture tren document: menu nam trong portal, con
  // bottom sheet cha cung nghe Escape tren document. Bat truoc + stopPropagation
  // dam bao Escape dau tien chi dong menu, khong dong luon ca sheet.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      closeMenu();
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => document.removeEventListener('keydown', onKeyDown, true);
  }, [isOpen, closeMenu]);

  // Mo ra thi dua con tro vao o tim luon cho go duoc ngay.
  //
  // Phai lam trong callback ref chu khong phai useEffect: menu nam trong portal
  // va chi mount o lan render thu hai (lan dau position con null, phai doi
  // useLayoutEffect do xong vi tri). Effect cua lan render dau chay khi input
  // chua ton tai nen focus() roi vao khoang khong.
  const attachSearchRef = useCallback((node: HTMLInputElement | null) => {
    searchRef.current = node;
    node?.focus();
  }, []);

  // Keo dong dang tro toi vao vung nhin khi di chuyen bang phim mui ten
  useEffect(() => {
    if (!isOpen) return;
    optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [isOpen, activeIndex]);

  // ── Ban phim ─────────────────────────────────────────────────────────────
  // Dung chung cho nut bam va o tim. Escape da duoc xu ly o effect ben tren.
  const handleKeyDown = (event: ReactKeyboardEvent) => {
    if (!isOpen) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    const count = rows.length;

    switch (event.key) {
      case 'Tab':
        closeMenu(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (count) setActiveIndex((index) => (index + 1) % count);
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (count) setActiveIndex((index) => (index - 1 + count) % count);
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(Math.max(0, count - 1));
        break;
      case 'Enter': {
        event.preventDefault();
        const row = rows[activeIndex];
        if (row) selectRow(row);
        break;
      }
      default:
        break;
    }
  };

  // ── Giao dien ────────────────────────────────────────────────────────────
  const isChip = variant === 'chip';

  if (isLoading) {
    return (
      <div
        className={
          isChip
            ? `h-9 w-28 shrink-0 animate-pulse rounded-full border border-gray-200 bg-gray-50 ${className}`
            : `h-11 animate-pulse rounded-md border border-gray-200 bg-gray-50 ${className}`
        }
        aria-hidden
      />
    );
  }

  // Chip: dang chon thi dau mui ten nhuong cho cho nut xoa, nen chi mot trong
  // hai xuat hien. O loc thuong rong hon nen hien duoc ca hai canh nhau.
  const triggerClass = isChip
    ? `flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full border pl-3.5 text-left text-theme-sm font-medium transition outline-none ${
        selected ? 'pr-8' : 'pr-3'
      } ${
        selected
          ? 'border-brand-500 bg-brand-50 text-brand-700'
          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50'
      } ${isOpen ? 'shadow-focus-ring' : ''}`
    : `flex h-11 w-full items-center gap-2 rounded-md border bg-white pl-3 text-left text-theme-sm transition outline-none ${
        selected ? 'pr-14' : 'pr-9'
      } ${
        isOpen
          ? 'border-brand-400 shadow-focus-ring'
          : selected
            ? 'border-brand-300 hover:border-brand-400'
            : 'border-gray-300 hover:border-brand-300'
      }`;

  return (
    <div className={`relative ${isChip ? 'shrink-0' : ''} ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-label={label}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? listboxId : undefined}
        aria-activedescendant={isOpen ? optionId(activeIndex) : undefined}
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        onKeyDown={handleKeyDown}
        className={triggerClass}
      >
        {icon && (
          <span
            aria-hidden
            className={`shrink-0 ${isChip ? 'opacity-70' : 'text-gray-400'}`}
          >
            {icon}
          </span>
        )}
        <span
          className={
            isChip
              ? 'truncate'
              : `truncate ${selected ? 'font-medium text-gray-800' : 'text-gray-400'}`
          }
        >
          {selected ? selected.label : label}
        </span>

        {isChip && !selected && (
          <FiChevronDown
            aria-hidden
            className={`shrink-0 opacity-60 transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        )}
      </button>

      {/* Nut xoa la anh em cua nut bam, khong long ben trong - button khong duoc lot nhau */}
      {selected && (
        <button
          type="button"
          onClick={() => onChange(null)}
          aria-label={`Bỏ chọn ${label}`}
          className={
            isChip
              ? 'absolute right-2 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-brand-500 transition hover:bg-brand-100 hover:text-brand-700'
              : 'absolute right-8 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-error-500'
          }
        >
          <FiX aria-hidden className="text-[13px]" />
        </button>
      )}

      {!isChip && (
        <FiChevronDown
          aria-hidden
          className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      )}

      {isOpen &&
        position &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              left: position.left,
              width: position.width,
              maxHeight: position.maxHeight,
              top: position.top ?? undefined,
              bottom: position.bottom ?? undefined,
            }}
            // z cao hon bottom sheet (z-1050) vi o loc cung duoc dung trong sheet
            className="fixed z-[1100] flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-panel"
          >
            {hasSearch && (
              <div className="relative border-b border-gray-100 p-2">
                <FiSearch
                  aria-hidden
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  ref={attachSearchRef}
                  type="text"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Tìm kiếm..."
                  aria-label={`Tìm trong ${label}`}
                  aria-controls={listboxId}
                  aria-activedescendant={optionId(activeIndex)}
                  className="h-9 w-full rounded-md bg-gray-50 pl-8 pr-3 text-theme-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:bg-white focus:shadow-focus-ring"
                />
              </div>
            )}

            {rows.length === 0 ? (
              <p className="px-4 py-6 text-center text-theme-sm text-gray-400">
                Không tìm thấy kết quả
              </p>
            ) : (
              <ul
                id={listboxId}
                role="listbox"
                aria-label={label}
                className="flex-1 overflow-y-auto py-1"
              >
                {rows.map((row, index) => {
                  const isReset = row.value === RESET_VALUE;
                  const isSelected = isReset ? !value : row.value === value;
                  const isActive = index === activeIndex;

                  return (
                    <li
                      key={row.value}
                      id={optionId(index)}
                      ref={(node) => {
                        optionRefs.current[index] = node;
                      }}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => selectRow(row)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-theme-sm transition ${
                        isActive ? 'bg-brand-50' : ''
                      } ${
                        isSelected
                          ? 'font-medium text-brand-700'
                          : isReset
                            ? 'text-gray-500'
                            : 'text-gray-700'
                      }`}
                    >
                      <span className="truncate">{row.label}</span>
                      {isSelected && (
                        <FiCheck aria-hidden className="shrink-0 text-brand-500" />
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
};

export default FilterSelect;
