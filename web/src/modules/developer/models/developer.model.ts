/**
 * HOP DONG cho trang "Chu dau tu" (/chu-dau-tu).
 *
 * Trang /chu-dau-tu tong hop tat ca chu dau tu dang co du an tren
 * RealityHub; trang /chu-dau-tu/[slug] la chi tiet mot chu dau tu, ke ca
 * cac du an dang mo ban va tong so can/san pham.
 *
 * Khi backend co module `developers`, entity + DTO phai khop file nay
 * va chi service bi doi sang axios - cac component va hook khong can sua.
 */

/** Thong tin cong ty chu dau tu nhu mot the dang */
export type Developer = {
  /** publicId - khoa chinh dinh danh chu dau tu */
  publicId: string;
  /** Ten hien thi tren card / chi tiet - viet tieng Viet, co dau */
  name: string;
  /**
   * URL slug phuc vu cho trang chi tiet: /chu-dau-tu/:slug.
   * Slug cua cac chu dau tu ao (6 muc dau cua MOCK_DEVELOPERS) tao
   * theo quy tac `ten-viet-thuong-khong-dau`. Khi backend co, slug la
   * field immutable tren entity.
   */
  slug: string;
  /** Mo ta ngan 1-2 cau de dat tren card */
  tagline: string;
  /** Loi gioi thieu day hon (~3-5 cau) cho trang chi tiet */
  description: string;
  /** URL logo - neu co. Neu rong, component placeholder se sinh gradient
      tu `name` (deterministic) nen khong can file that. */
  logoUrl: string;
  /** Trang web chinh thuc neu co */
  website: string;
  /** So nam hoat dong tren thi truong (optional, hien thi neu co) */
  foundedYear: number | null;
  /** Ten cong ty me neu la cong ty con (optional) */
  parentCompany: string | null;
  /** Tru so chinh */
  headquarters: string;
};

/** So lieu tong hop them vao moi card chu dau tu (trang danh sach) */
export type DeveloperSummary = Developer & {
  /** So du an dang co tren he thong thuoc chu dau tu nay */
  projectCount: number;
  /** So du an dang mo ban (status === 'dang-mo-ban') */
  openingProjectCount: number;
  /** Tong so can/san pham (tat ca trang thai) cua cac du an thuoc CDT */
  unitCount: number;
  /** So can con hang (status === 'con-hang') */
  availableUnitCount: number;
  /** Danh sach slug cac du an, de hien thi nhan nho tren card */
  projectSlugs: string[];
};

/** So lieu hien thi khu "so lieu tong hop" cua trang chi tiet */
export type DeveloperStats = {
  totalProjects: number;
  openingProjects: number;
  upcomingProjects: number;
  deliveredProjects: number;
  totalUnits: number;
  availableUnits: number;
  heldUnits: number;
  soldUnits: number;
};

/** Phan hoi tu `DeveloperService.list()` */
export type PaginatedDevelopers = {
  developers: DeveloperSummary[];
  total: number;
  page: number;
  limit: number;
};

/** Phan hoi tu `DeveloperService.detail()` - thong tin day du 1 chu dau tu */
export type DeveloperDetail = {
  developer: Developer;
  stats: DeveloperStats;
  /** Cac du an thuoc chu dau tu (dang ProjectSummary gon de card). */
  projects: import('@/modules/project/models/project.model').Project[];
};
