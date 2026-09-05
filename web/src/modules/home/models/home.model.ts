/**
 * Hop dong voi backend - map sang module `banner` + `home-config` sau nay.
 *
 * Moi khoi tren trang chu (hero, cac-chu-dau-tu...) deu la mot khoi noi
 * dung doc lap de admin co the bat/tat/tuy bien tu backend.
 *
 * Ghi chu lich su:
 * - Khoi `features` (Vi sao chon chung toi / Dong hanh cung ban tu A den Z)
 *   va `testimonials` (Khach hang noi gi / Duoc khach hang tin tuong va
 *   lua chon) da duoc di chuyen sang trang /gioi-thieu ngay 05/09/2026
 *   theo yeu cau cua product.
 * - Hai khoi do gio chi xuat hien tren trang gioi thieu chinh thuc, KHONG
 *   con tren trang chu, KHONG nam trong layout dung chung.
 * - Trang gioi thieu su dung no noi tai module About
 *   (src/modules/about/components), data lay tu about.mock.ts.
 * - Type `HomeFeature` + `HomeTestimonial` van duoc re-export o day de
 *   giu tuong thich nguoc voi cac component cu (WhyUs, TestimonialsSection).
 *   Nguon that cua type la module About (about.model.ts).
 */

import type { HomeFeature, HomeTestimonial } from '@/modules/about/models/about.model';

export type { HomeFeature, HomeTestimonial };

import type { InvestorSummary } from '@/modules/developer/models/investor.model';
import type { UnitWithProject } from '@/modules/project/models/project-detail.model';
import type { Project } from '@/modules/project/models/project.model';

/** Mot slide banner o dau trang chu */
export type HomeBannerSlide = {
  publicId: string;
  /** Tieu de lon tren anh */
  headline: string;
  /**
   * Tieu de phu (in hoa, font nho hon) - vi tri ngay duoi `headline`.
   * Tu chon: neu khong co thi fallback xuong `subtitle`.
   */
  subheadline?: string;
  /** Dong mo ta duoi tieu de phu (neu co) hoac duoi tieu de chinh */
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

/** Toan bo du lieu trang chu - server se goi mot lan roi truyen xuong client */
export type HomeContent = {
  banners: HomeBannerSlide[];
  /** 6 du an noi bat hien o khoi chinh giua */
  featuredProjects: Project[];
  /** 12 can noi bat gop tu TAT CA du an (khong phai mot du an cu the) */
  featuredUnits: UnitWithProject[];
  /**
   * 25 chu dau tu chinh thuc hien o section "CAC CHU DAU TU". Cung
   * single source of truth voi trang /chu-dau-tu (InvestorService).
   */
  investors: InvestorSummary[];
};
