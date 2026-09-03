/**
 * Tone color mapping cho 9 nhom tinh nang trang /tinh-nang.
 *
 * Moi nhom co 1 tone rieng (brand / accent / cyan / gold / green / purple
 * / orange / teal / red) de tao nhip visual cho grid.
 */

export type FeatureTone =
  | 'brand'
  | 'accent'
  | 'green'
  | 'purple'
  | 'orange'
  | 'teal'
  | 'cyan'
  | 'gold'
  | 'red';

export const FEATURE_TONE_CLASSES: Record<
  FeatureTone,
  {
    /** Section: eyebrow + icon to */
    sectionIcon: string;
    sectionEyebrow: string;
    /** Card bg + border cho group */
    cardBorder: string;
    cardBg: string;
    /** Item (tinh nang con) bg nhat + text vừa */
    itemIconBg: string;
    itemIconText: string;
    itemText: string;
    /** Hover: doi icon sang tone đậm */
    itemHover: string;
  }
> = {
  brand: {
    sectionIcon: 'text-brand-600',
    sectionEyebrow: 'text-brand-600',
    cardBorder: 'border-brand-100',
    cardBg: 'bg-white',
    itemIconBg: 'bg-brand-50',
    itemIconText: 'text-brand-600',
    itemText: 'text-gray-800',
    itemHover: 'group-hover:bg-brand-500 group-hover:text-white',
  },
  accent: {
    sectionIcon: 'text-accent-600',
    sectionEyebrow: 'text-accent-600',
    cardBorder: 'border-accent-100',
    cardBg: 'bg-white',
    itemIconBg: 'bg-accent-50',
    itemIconText: 'text-accent-600',
    itemText: 'text-gray-800',
    itemHover: 'group-hover:bg-accent-500 group-hover:text-white',
  },
  green: {
    sectionIcon: 'text-green-600',
    sectionEyebrow: 'text-green-600',
    cardBorder: 'border-green-100',
    cardBg: 'bg-white',
    itemIconBg: 'bg-green-50',
    itemIconText: 'text-green-600',
    itemText: 'text-gray-800',
    itemHover: 'group-hover:bg-green-500 group-hover:text-white',
  },
  purple: {
    sectionIcon: 'text-purple-600',
    sectionEyebrow: 'text-purple-600',
    cardBorder: 'border-purple-100',
    cardBg: 'bg-white',
    itemIconBg: 'bg-purple-50',
    itemIconText: 'text-purple-600',
    itemText: 'text-gray-800',
    itemHover: 'group-hover:bg-purple-500 group-hover:text-white',
  },
  orange: {
    sectionIcon: 'text-orange-600',
    sectionEyebrow: 'text-orange-600',
    cardBorder: 'border-orange-100',
    cardBg: 'bg-white',
    itemIconBg: 'bg-orange-50',
    itemIconText: 'text-orange-600',
    itemText: 'text-gray-800',
    itemHover: 'group-hover:bg-orange-500 group-hover:text-white',
  },
  teal: {
    sectionIcon: 'text-teal-600',
    sectionEyebrow: 'text-teal-600',
    cardBorder: 'border-teal-100',
    cardBg: 'bg-white',
    itemIconBg: 'bg-teal-50',
    itemIconText: 'text-teal-600',
    itemText: 'text-gray-800',
    itemHover: 'group-hover:bg-teal-500 group-hover:text-white',
  },
  cyan: {
    sectionIcon: 'text-cyan-600',
    sectionEyebrow: 'text-cyan-600',
    cardBorder: 'border-cyan-100',
    cardBg: 'bg-white',
    itemIconBg: 'bg-cyan-50',
    itemIconText: 'text-cyan-600',
    itemText: 'text-gray-800',
    itemHover: 'group-hover:bg-cyan-500 group-hover:text-white',
  },
  gold: {
    sectionIcon: 'text-amber-600',
    sectionEyebrow: 'text-amber-600',
    cardBorder: 'border-amber-100',
    cardBg: 'bg-white',
    itemIconBg: 'bg-amber-50',
    itemIconText: 'text-amber-600',
    itemText: 'text-gray-800',
    itemHover: 'group-hover:bg-amber-500 group-hover:text-white',
  },
  red: {
    sectionIcon: 'text-rose-600',
    sectionEyebrow: 'text-rose-600',
    cardBorder: 'border-rose-100',
    cardBg: 'bg-white',
    itemIconBg: 'bg-rose-50',
    itemIconText: 'text-rose-600',
    itemText: 'text-gray-800',
    itemHover: 'group-hover:bg-rose-500 group-hover:text-white',
  },
};