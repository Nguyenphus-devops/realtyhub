/**
 * Tone color mapping cho 7 khoi tien ich.
 *
 * Moi tone co 3 set class:
 *   - section: header bar + icon section (tone đậm)
 *   - button: nut con ben trong grid (tone vừa)
 *   - buttonHover: hover state (tone đậm)
 *
 * Vi design tokens admin/admin dung brand-500 (blue 1) va web dung brand-500
 * rieng (blue 2), nen tao custom tone classes de cac khoi khac nhau ve mau
 * ma khong can them color tokens moi vao tailwind config.
 */

import type { UtilityTone } from '../models/utility.model';

export type ToneClasses = {
  /** Section header: bg + text + section-icon color */
  sectionBg: string;
  sectionText: string;
  sectionIcon: string;
  /** Card border tone (nhe) */
  border: string;
  /** Button (nut con) - bg nhat + text vừa */
  buttonBg: string;
  buttonIcon: string;
  buttonText: string;
  /** Hover state - bg dam + text trang */
  buttonHoverBg: string;
  buttonHoverText: string;
  /** Highlight khi search match (border + ring) */
  highlightRing: string;
};

export const TONE_CLASSES: Record<UtilityTone, ToneClasses> = {
  blue: {
    sectionBg: 'bg-blue-50',
    sectionText: 'text-blue-900',
    sectionIcon: 'text-blue-600',
    border: 'border-blue-100',
    buttonBg: 'bg-blue-50/60',
    buttonIcon: 'text-blue-600',
    buttonText: 'text-gray-800',
    buttonHoverBg: 'hover:bg-blue-500',
    buttonHoverText: 'hover:text-white',
    highlightRing: 'ring-blue-300 border-blue-400',
  },
  green: {
    sectionBg: 'bg-green-50',
    sectionText: 'text-green-900',
    sectionIcon: 'text-green-600',
    border: 'border-green-100',
    buttonBg: 'bg-green-50/60',
    buttonIcon: 'text-green-600',
    buttonText: 'text-gray-800',
    buttonHoverBg: 'hover:bg-green-500',
    buttonHoverText: 'hover:text-white',
    highlightRing: 'ring-green-300 border-green-400',
  },
  purple: {
    sectionBg: 'bg-purple-50',
    sectionText: 'text-purple-900',
    sectionIcon: 'text-purple-600',
    border: 'border-purple-100',
    buttonBg: 'bg-purple-50/60',
    buttonIcon: 'text-purple-600',
    buttonText: 'text-gray-800',
    buttonHoverBg: 'hover:bg-purple-500',
    buttonHoverText: 'hover:text-white',
    highlightRing: 'ring-purple-300 border-purple-400',
  },
  orange: {
    sectionBg: 'bg-orange-50',
    sectionText: 'text-orange-900',
    sectionIcon: 'text-orange-600',
    border: 'border-orange-100',
    buttonBg: 'bg-orange-50/60',
    buttonIcon: 'text-orange-600',
    buttonText: 'text-gray-800',
    buttonHoverBg: 'hover:bg-orange-500',
    buttonHoverText: 'hover:text-white',
    highlightRing: 'ring-orange-300 border-orange-400',
  },
  teal: {
    sectionBg: 'bg-teal-50',
    sectionText: 'text-teal-900',
    sectionIcon: 'text-teal-600',
    border: 'border-teal-100',
    buttonBg: 'bg-teal-50/60',
    buttonIcon: 'text-teal-600',
    buttonText: 'text-gray-800',
    buttonHoverBg: 'hover:bg-teal-500',
    buttonHoverText: 'hover:text-white',
    highlightRing: 'ring-teal-300 border-teal-400',
  },
  cyan: {
    sectionBg: 'bg-cyan-50',
    sectionText: 'text-cyan-900',
    sectionIcon: 'text-cyan-600',
    border: 'border-cyan-100',
    buttonBg: 'bg-cyan-50/60',
    buttonIcon: 'text-cyan-600',
    buttonText: 'text-gray-800',
    buttonHoverBg: 'hover:bg-cyan-500',
    buttonHoverText: 'hover:text-white',
    highlightRing: 'ring-cyan-300 border-cyan-400',
  },
  gold: {
    sectionBg: 'bg-amber-50',
    sectionText: 'text-amber-900',
    sectionIcon: 'text-amber-600',
    border: 'border-amber-100',
    buttonBg: 'bg-amber-50/60',
    buttonIcon: 'text-amber-600',
    buttonText: 'text-gray-800',
    buttonHoverBg: 'hover:bg-amber-500',
    buttonHoverText: 'hover:text-white',
    highlightRing: 'ring-amber-300 border-amber-400',
  },
};