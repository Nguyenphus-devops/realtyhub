/**
 * Icon registry cho cac About section components.
 *
 * Trang /gioi-thieu la Server Component - khong the truyen function
 * (ComponentType) qua ranh gioi server/client. Vi vay data mock luu icon
 * duoi dang string key, va section component (Client) se lookup icon
 * that qua registry nay.
 *
 * Them icon moi:
 *   1. Import tu react-icons/hi2 (hoac fi, tb...).
 *   2. Them entry vao ABOUT_ICON_MAP ben duoi.
 *   3. Them key vao type AboutIconKey trong about.model.ts.
 */

import {
  HiOutlineAcademicCap,
  HiOutlineArrowsRightLeft,
  HiOutlineBolt,
  HiOutlineBuildingOffice2,
  HiOutlineCalculator,
  HiOutlineChartBar,
  HiOutlineCheckBadge,
  HiOutlineClock,
  HiOutlineCpuChip,
  HiOutlineDocumentCheck,
  HiOutlineGlobeAsiaAustralia,
  HiOutlineIdentification,
  HiOutlineLockClosed,
  HiOutlineMagnifyingGlass,
  HiOutlineMapPin,
  HiOutlineNewspaper,
  HiOutlineRectangleStack,
  HiOutlineScale,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineUserGroup,
  HiOutlineWrenchScrewdriver,
} from 'react-icons/hi2';

import type { ComponentType } from 'react';

type IconComponent = ComponentType<{ 'aria-hidden'?: boolean; className?: string }>;

export const ABOUT_ICON_MAP: Record<string, IconComponent> = {
  // tech / ai
  cpuChip: HiOutlineCpuChip,
  sparkles: HiOutlineSparkles,
  bolt: HiOutlineBolt,
  // inventory
  building: HiOutlineBuildingOffice2,
  scale: HiOutlineScale,
  clock: HiOutlineClock,
  globe: HiOutlineGlobeAsiaAustralia,
  mapPin: HiOutlineMapPin,
  // search / data
  search: HiOutlineMagnifyingGlass,
  rectangleStack: HiOutlineRectangleStack,
  // compare / sales
  arrowsRightLeft: HiOutlineArrowsRightLeft,
  calculator: HiOutlineCalculator,
  chartBar: HiOutlineChartBar,
  // crm
  userGroup: HiOutlineUserGroup,
  newspaper: HiOutlineNewspaper,
  // trust
  shield: HiOutlineShieldCheck,
  checkBadge: HiOutlineCheckBadge,
  wrench: HiOutlineWrenchScrewdriver,
  // educational (tu MOCK_ABOUT_CONTENT cu, giu de tuong thich)
  academicCap: HiOutlineAcademicCap,
  documentCheck: HiOutlineDocumentCheck,
  identification: HiOutlineIdentification,
  lockClosed: HiOutlineLockClosed,
};

/**
 * Resolve icon tu key. Tra ve ShieldCheck neu key khong ton tai (fallback an
 * toan, khong crash UI).
 */
export const resolveAboutIcon = (key: string): IconComponent =>
  ABOUT_ICON_MAP[key] ?? HiOutlineShieldCheck;
