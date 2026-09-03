'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Module shared luu tru + doc danh sach "yeu thich" (cac du an da bookmark).
 *
 * O localStorage nen doi bo loc, sang trang khac hay tai lai deu khong mat.
 *
 * Tai sao tach ra module rieng (common/) thay vi de trong modules/project:
 *   - Header (common/layout/SiteHeader) can hien thi so luong yeu thich.
 *   - ProjectCard (modules/project/components) can toggle.
 *   - Trang /yeu-thich can sort theo "vua luu" + filter theo phan khuc.
 * De tap trung source-of-truth o common, cac module khac chi import.
 *
 * SSR-safe: useFavorites ban dau tra ve favorites=[] ca server lan client
 * (lan render dau KHONG duoc doc localStorage - se gay hydration mismatch).
 * Sau khi mount, useEffect se doc localStorage va setState -> re-render
 * lan 2 voi data that. Component tieu thu can biet isHydrated neu muon
 * phan biet "chua hydrate" vs "da hydrate nhung favorites rong".
 *
 * Khi co dang nhap that: doi read/write sang goi API, va merge
 * danh sach dang o localStorage vao tai khoan ngay sau khi login.
 */
const STORAGE_KEY = 'realtyhub:favorite-projects';

/**
 * Moi entry luu { publicId, savedAt } de trang /yeu-thich co the sort
 * theo "vua luu". Format moi nen tuong thich nguoc: entry cu chi co
 * string (publicId) van hoat dong, chi la khong co savedAt.
 */
export type FavoriteEntry = {
  publicId: string;
  /** Unix ms khi user bookmark. */
  savedAt: number;
};

const readFavoritesFromStorage = (): FavoriteEntry[] => {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    // Migrate format cu (string[]) len format moi ({publicId, savedAt}).
    // Chi chay 1 lan khi user da co du lieu cu - tuong thich nguoc 100%.
    const migrated: FavoriteEntry[] = [];
    const now = Date.now();
    for (const item of parsed) {
      if (typeof item === 'string') {
        // Khong biet savedAt that -> gan = now (se hien "vua luu" cho lan
        // luu cu, sau do moi lan luu moi se cap nhat dung timestamp).
        migrated.push({ publicId: item, savedAt: now });
      } else if (
        item &&
        typeof item === 'object' &&
        typeof (item as FavoriteEntry).publicId === 'string'
      ) {
        const entry = item as FavoriteEntry;
        migrated.push({
          publicId: entry.publicId,
          savedAt: typeof entry.savedAt === 'number' ? entry.savedAt : now,
        });
      }
    }
    return migrated;
  } catch {
    return [];
  }
};

/**
 * Kho dung chung cho MOI noi goi useFavorites.
 *
 * Truoc day moi component giu mot useState rieng, nen bam tim tren the chi
 * component do biet: header khong doi so dem, danh sach khong day du an da luu
 * len dau, ghim tren ban do khong doi mau. Su kien `storage` cua trinh duyet
 * KHONG bao cho chinh tab dang ghi, nen no khong lap duoc khoang trong nay -
 * phai co danh sach nguoi nghe cua rieng minh.
 */
const listeners = new Set<() => void>();

const EMPTY: FavoriteEntry[] = [];

/**
 * getSnapshot bat buoc tra ve CUNG mot tham chieu khi du lieu khong doi, neu
 * khong React se render lai vo han. Vi the cache theo chuoi JSON tho.
 */
let cachedRaw: string | null = null;
let cachedValue: FavoriteEntry[] = EMPTY;

const readSnapshot = (): FavoriteEntry[] => {
  if (typeof window === 'undefined') return EMPTY;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedValue;

  cachedRaw = raw;
  cachedValue = readFavoritesFromStorage();
  return cachedValue;
};

/** Server khong co localStorage - lan render dau hai ben phai giong nhau */
const getServerSnapshot = () => EMPTY;

const subscribe = (onChange: () => void) => {
  listeners.add(onChange);
  // Dong bo giua nhieu tab dang mo
  window.addEventListener('storage', onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
};

const writeFavoritesToStorage = (next: FavoriteEntry[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  listeners.forEach((listener) => listener());
};

export const useFavorites = () => {
  const favorites = useSyncExternalStore(subscribe, readSnapshot, getServerSnapshot);
  // Server tra ve false, client tra ve true - dung de phan biet "chua hydrate"
  // voi "da hydrate nhung chua luu du an nao"
  const isHydrated = useSyncExternalStore(subscribe, () => true, () => false);

  /**
   * Doc - ghi thang, KHONG boc trong ham cap nhat cua setState.
   *
   * Dat viec ghi localStorage vao trong ham cap nhat la nguyen nhan nut tim
   * hong: React duoc phep goi ham do nhieu lan (o StrictMode la hai lan) de
   * phat hien ham khong thuan tuy. Lan hai doc lai localStorage thay du an DA
   * co nen lai xoa di, ket qua la giao dien bao "da luu" con localStorage van
   * rong.
   */
  const toggle = useCallback((publicId: string) => {
    const latest = readSnapshot();
    const exists = latest.some((entry) => entry.publicId === publicId);

    // Them thi dong dau thoi gian moi; xoa thi bo han entry (khong giu lich su)
    writeFavoritesToStorage(
      exists
        ? latest.filter((entry) => entry.publicId !== publicId)
        : [...latest, { publicId, savedAt: Date.now() }],
    );
  }, []);

  const isFavorite = useCallback(
    (publicId: string) => favorites.some((entry) => entry.publicId === publicId),
    [favorites],
  );

  /** Xoa toan bo - dung cho nut "Xoa tat ca" tren trang /yeu-thich. */
  const clearAll = useCallback(() => writeFavoritesToStorage([]), []);

  return { favorites, isFavorite, toggle, clearAll, isHydrated };
};

/**
 * Ham tien ich tinh thoi gian tuong doi tieng Viet ("vua luu", "2 phut truoc").
 *
 * Re-export o day de trang /yeu-thich dung chung. Khong dat trong component
 * vi tinh toan nhe, re-render chi khi favorites thay doi.
 */
export const formatRelativeSaved = (
  savedAt: number,
  nowMs: number = Date.now(),
): string => {
  const diffMs = Math.max(0, nowMs - savedAt);
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return 'Vừa lưu';
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} phút trước`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} giờ trước`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${day} ngày trước`;
  const week = Math.floor(day / 7);
  if (week < 4) return `${week} tuần trước`;
  const month = Math.floor(day / 30);
  if (month < 12) return `${month} tháng trước`;
  return `${Math.floor(day / 365)} năm trước`;
};