/**
 * Models cho module About (trang /gioi-thieu).
 *
 * Cap nhat ngay 05/09/2026: tach `HomeFeature` + `HomeTestimonial` tu
 * home.model.ts sang day de phan anh dung nguon su ly.
 *
 * - Truoc day: trang chu co 2 khoi nay, type dat o home.model.ts.
 * - Sau khi product yeu cau: 2 khoi chi con tren trang /gioi-thieu.
 * - Type van duoc re-export tu home.model.ts de giu tuong thich nguoc voi
 *   cac component cu (WhyUs, TestimonialsSection).
 */

/** Mot gia tri cot loi trong khoi "Dong hanh cung ban tu A den Z". */
export type HomeFeature = {
  publicId: string;
  icon: 'shield' | 'search' | 'support' | 'chart';
  title: string;
  description: string;
};

/** Mot loi chung nhan/danh gia trong khoi "Duoc khach hang tin tuong". */
export type HomeTestimonial = {
  publicId: string;
  authorName: string;
  authorRole: string;
  avatar?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
  relatedProject?: string;
};

/** Danh sach icon mapping cho HomeFeature. */
export const FEATURE_ICONS = ['shield', 'search', 'support', 'chart'] as const;

/**
 * Trang /gioi-thieu chia thanh cac section doc lap de admin co the
 * bat/tat/tuy bien tu backend sau nay. Hien tai data duoc lay tu
 * about.mock.ts (MOCK_ABOUT_CONTENT).
 */
export type AboutHero = {
  eyebrow: string;
  /**
   * Tieu de lon tren hero - luu y viet hoa, vi layout hien thi
   * `text-transform: uppercase` qua CSS.
   */
  headline: string;
  /** Dong mo ta duoi tieu de chinh. */
  lead: string;
  /** Vi du dang chip nho (promise). */
  promises: string[];
  /** CTA chinh duoi lead. */
  primaryCta: { label: string; href: string };
  /** CTA phu (optional). */
  secondaryCta?: { label: string; href: string };
};

/**
 * Section 2 - "Gioi thieu tong quan": gioi thieu RealtyHub la nen tang
 * cong nghe danh cho moi gioi (khong phai gioi thieu doanh nghiep truyen thong).
 *
 * Icon luu duoi dang string key thay vi ComponentType vi trang
 * /gioi-thieu la Server Component - khong the truyen function qua
 * ranh gioi client/server. Component client se resolve icon that qua
 * ABOUT_ICON_MAP trong iconRegistry.ts.
 */
export type AboutIntro = {
  /** Tieu de section - viet hoa, in dam. */
  title: string;
  /** Doan mo ta chinh (1-2 cau). */
  body: string;
  /** Danh sach gia tri cot loi (3-6 muc, hien thi grid). */
  pillars: {
    /** Key trong ABOUT_ICON_MAP. */
    iconKey: string;
    title: string;
    description: string;
  }[];
};

/**
 * Section 3 - "Quy can phong phu" - NHAN MANH dac biet tai mien Nam.
 * Day la mot trong nhung noi dung QUAN TRONG NHAT cua trang.
 */
export type AboutInventory = {
  title: string;
  subtitle: string;
  /** Danh sach cac the manh cua quy can (highlight). */
  highlights: {
    iconKey: string;
    title: string;
    description: string;
  }[];
  /** Loi nhan ve trong tam mien Nam (1 cau noi bat). */
  regionCallout: {
    region: string;
    description: string;
  };
};

/**
 * Section 4 - "Duoc khach hang tin tuong va lua chon".
 * Tap trung vao GIA TRI mang lai (khong tu tao so lieu khong co nguon).
 */
export type AboutTrusted = {
  title: string;
  subtitle: string;
  /** Danh sach cac gia tri loi ich (khong phai testimonial cu the). */
  values: {
    iconKey: string;
    title: string;
    description: string;
  }[];
};

/**
 * Section 5 - "Dong hanh cung ban tu A den Z" - mo ta hanh trinh cua
 * moi gioi khi su dung RealtyHub. Trinh bay duoi dang timeline.
 */
export type AboutJourney = {
  title: string;
  subtitle: string;
  steps: { title: string; description: string }[];
};

/**
 * Section 6 - "Tro thanh cong tac vien" - CTA cuoi trang.
 */
export type AboutCta = {
  title: string;
  body: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Ghi chu phu duoi button (optional). */
  footnote?: string;
};

/** Toan bo noi dung cua trang /gioi-thieu. */
export type AboutPageContent = {
  hero: AboutHero;
  intro: AboutIntro;
  inventory: AboutInventory;
  trusted: AboutTrusted;
  journey: AboutJourney;
  cta: AboutCta;
};
