'use client';

/**
 * Backward-compat re-export.
 *
 * Hook da duoc chuyen sang common/hooks/useFavorites de header (SiteHeader)
 * cung nhu cac module khac co the dung chung source-of-truth (localStorage
 * key + read/write). File nay giu lai de khong phai sua cac import da
 * co trong modules/project/.
 */
export { useFavorites } from '@/common/hooks/useFavorites';