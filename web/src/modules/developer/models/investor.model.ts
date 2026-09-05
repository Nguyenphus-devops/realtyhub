/**
 * Hop dong cho "Chu dau tu" (Investor).
 *
 * Day la single source of truth cho 25 chu dau tu chinh thuc cua RealtyHub,
 * dung chung cho:
 *   - Section "CAC CHU DAU TU" tren trang chu (components/Doitac.tsx)
 *   - Trang /chu-dau-tu (list + detail)
 *
 * Moi field deu duoc suy ra tu ten hien thi (name) de tranh sai lech giua
 * cac noi dung hien thi. Slug duoc tinh bang ham toSlug() de khop voi route
 * /chu-dau-tu/[slug] dang co.
 *
 * Khi backend co module `investors`, chi can sua investor.service.ts de goi
 * API - cac component, hook, route deu khong can doi.
 */

/** Mot chu dau tu tren RealityHub. */
export type Investor = {
  /** Ten hien thi - dung cho title, aria-label, va cac the <img alt>. */
  name: string;
  /** URL logo absolute tu realtyhub.com.vn. */
  logo: string;
  /** Slug URL, dung cho /chu-dau-tu/[slug]. */
  slug: string;
};

/** Tom tat them de hien thi card list (so du an, so can con hang, ...). */
export type InvestorSummary = Investor & {
  /** So du an dang co tren he thong thuoc chu dau tu nay. */
  projectCount: number;
  /** So du an dang mo ban. */
  openingProjectCount: number;
  /** So can/san pham con hang cua cac du an thuoc chu dau tu. */
  availableUnitCount: number;
  /** Slug cac du an thuoc chu dau tu (gom ngan de hien thi thumbnail). */
  projectSlugs: string[];
};

/** Phan hoi tu InvestorService.list(). */
export type PaginatedInvestors = {
  investors: InvestorSummary[];
  total: number;
  page: number;
  limit: number;
};
