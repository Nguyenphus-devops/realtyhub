/**
 * Hop dong voi backend - map sang module `banner` + `home-config` sau nay.
 *
 * Moi khoi tren trang chu (hero, vi-sao-chon...) deu la mot khoi noi dung
 * doc lap de admin co the bat/tat/tuy bien tu backend.
 */

import type { Project } from '@/modules/project/models/project.model';

/** Mot slide banner o dau trang chu */
export type HomeBannerSlide = {
  publicId: string;
  /** Tieu de lon tren anh */
  headline: string;
  /** Dong mo ta duoi tieu de */
  subtitle: string;
  /** Chu tren nut bam chinh */
  primaryCtaLabel: string;
  /** Chu tren nut phu (neu co) */
  secondaryCtaLabel?: string;
  /**
   * URL anh bia desktop (>=1024px). Rong => khong render carousel.
   * Anh ngang, ti le ~2:1.
   */
  desktopImageUrl: string;
  /**
   * URL anh bia tablet (768px-1023px). Neu rong => fallback ve desktop.
   * Anh portrait, ti le ~3:4 - dung cho iPad/tablet dung doc.
   */
  tabletImageUrl?: string;
  /**
   * URL anh bia mobile (<768px). Neu rong => fallback ve desktop (hoac tablet
   * neu co). Anh doc, ti le ~1:2.
   */
  mobileImageUrl?: string;
};

/** Mot muc trong khoi "Vi sao chon chung toi" */
export type HomeFeature = {
  publicId: string;
  icon: 'shield' | 'search' | 'support' | 'chart';
  title: string;
  description: string;
};

/**
 * Mot danh gia tu khach hang / chuyen gia / nha dau tu hien o khoi
 * "Khach hang noi gi" tren trang chu.
 */
export type HomeTestimonial = {
  publicId: string;
  /** Ten khach hang. VD: "Anh Nguyen Van A". */
  authorName: string;
  /** Chuc danh / vi tri. VD: "Khach hang mua can ho Vinhomes". */
  authorRole: string;
  /** URL avatar that. Neu khong co -> UserAvatar fallback initials. */
  avatar?: string;
  /** So sao 1-5 (rating). */
  rating: 1 | 2 | 3 | 4 | 5;
  /** Noi dung danh gia. 1-3 cau, can ngan gon. */
  quote: string;
  /** Ten du an / san pham lien quan (hien thi o footer card). */
  relatedProject?: string;
};

/** Toan bo du lieu trang chu - server se goi mot lan roi truyen xuong client */
export type HomeContent = {
  banners: HomeBannerSlide[];
  /** 6 du an noi bat hien o khoi chinh giua */
  featuredProjects: Project[];
  features: HomeFeature[];
  /** 3-6 danh gia hien o khoi testimonials. Neu rong -> khoi an. */
  testimonials: HomeTestimonial[];
};

export const FEATURE_ICONS = ['shield', 'search', 'support', 'chart'] as const;
