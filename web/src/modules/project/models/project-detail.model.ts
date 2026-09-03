/**
 * HOP DONG trang chi tiet du an.
 *
 * Moi tab tren thiet ke tuong ung mot nhanh du lieu trong `ProjectDetail`.
 * Khi backend co module `projects`, entity + DTO phai khop y het file nay va
 * chi than ham trong services/project.service.ts phai doi.
 *
 * Quy uoc tien: MOI truong gia deu la VND dang so nguyen. Khong dinh dang o
 * day - dung cac ham trong common/utils/format.ts khi render.
 */
import type { NewsArticle } from '@/modules/news/models/news.model';
import type { Project } from './project.model';

/** Thu tu tab dung y thiet ke, cung la thu tu hien tren thanh dieu huong */
export const PROJECT_DETAIL_TABS = [
  { key: 'tong-quan', label: 'Tổng quan' },
  { key: 'vi-tri', label: 'Vị trí' },
  { key: 'phan-khu', label: 'Phân khu' },
  { key: 'mat-bang-quy-can', label: 'Mặt bằng quỹ căn' },
  { key: 'quy-can', label: 'Quỹ căn' },
  { key: 'anh-360', label: 'Ảnh 360°' },
  { key: 'dao-tao', label: 'Đào tạo' },
  { key: 'chinh-sach-ban-hang', label: 'Chính sách bán hàng' },
  { key: 'tien-do', label: 'Tiến độ' },
  { key: 'tai-lieu', label: 'Tài liệu' },
  { key: 'tin-tuc', label: 'Tin tức' },
] as const;

export type ProjectDetailTab = (typeof PROJECT_DETAIL_TABS)[number];
export type ProjectDetailTabKey = ProjectDetailTab['key'];

export const DEFAULT_TAB: ProjectDetailTabKey = 'tong-quan';

/** Doc tham so ?tab= tu URL, tra ve tab mac dinh neu gia tri la rac */
export const parseTabKey = (value: string | null): ProjectDetailTabKey =>
  PROJECT_DETAIL_TABS.some((tab) => tab.key === value)
    ? (value as ProjectDetailTabKey)
    : DEFAULT_TAB;

// ── Tab: Tong quan ─────────────────────────────────────────────────────────

/** Mot slide trong bang hero dau trang */
export type MediaSlide = {
  publicId: string;
  imageUrl: string;
  caption: string;
};

/** The so lieu noi bat: quy mo, tong von, dan so */
export type ProjectStat = {
  key: 'scale' | 'capital' | 'population';
  label: string;
  value: string;
};

/** Mot dong trong khoi "Tong quan du an" */
export type ProjectSpec = {
  label: string;
  value: string;
};

/** Mot ban ve mat bang - nguoi dung chon qua cac nut pill */
export type MasterPlanSheet = {
  key: string;
  label: string;
  imageUrl: string;
};

/** The trong bang chuyen "San pham" */
export type ProjectProduct = {
  publicId: string;
  name: string;
  areaLabel: string;
  imageUrl: string;
};

/** O anh trong bang chuyen "Tien ich" */
export type ProjectAmenity = {
  publicId: string;
  name: string;
  imageUrl: string;
};

/** Khoi chu + video dung chung cho "Gioi thieu du an" va khoi ket */
export type ProjectStorySection = {
  title: string;
  body: string;
  videoThumbnailUrl: string;
  videoUrl: string;
};

/** The chuyen vien tu van o cuoi tab Tong quan */
export type ProjectConsultant = {
  publicId: string;
  role: string;
  name: string;
  phone: string;
};

// ── Tab: Vi tri ────────────────────────────────────────────────────────────

export type LocationIcon = 'train' | 'car' | 'plane' | 'globe' | 'ship' | 'rocket';

/** Mot gach dau dong ket noi vung: "23 phut toi Ha Noi: ..." */
export type LocationHighlight = {
  publicId: string;
  icon: LocationIcon;
  title: string;
  description: string;
};

export type ProjectLocation = {
  bannerUrl: string;
  headline: string;
  intro: string;
  highlights: LocationHighlight[];
  closing: string;
  /** Toa do dung cho ban do nhung */
  latitude: number;
  longitude: number;
  mapLabel: string;
};

// ── Tab: Phan khu ──────────────────────────────────────────────────────────

export type ProjectPhase = {
  publicId: string;
  slug: string;
  name: string;
  imageUrl: string;
  totalUnits: number;
  priceFrom: number;
  priceTo: number;

  // Cac truong duoi day chi dung o trang chi tiet phan khu, the phan khu tren
  // tab "Phan khu" khong doc toi.
  /** Cau tieu de lon phia tren doan mo ta */
  headline: string;
  description: string;
  /** Bang "Thong tin chung" */
  specs: ProjectSpec[];
  /** Cac ban ve mat bang lon xep doc duoi phan mo ta */
  masterPlanImages: MediaSlide[];
};

/** Muc trong thanh chuyen nhanh giua cac phan khu */
export type PhaseSummary = {
  publicId: string;
  slug: string;
  name: string;
};

/** Thu tu tab tren trang chi tiet phan khu - it hon trang du an */
export const PHASE_DETAIL_TABS = [
  { key: 'tong-quan', label: 'Tổng quan' },
  { key: 'vi-tri', label: 'Vị trí' },
  { key: 'mat-bang-quy-can', label: 'Mặt bằng quỹ căn' },
  { key: 'quy-can', label: 'Quỹ căn' },
  { key: 'chinh-sach-ban-hang', label: 'Chính sách bán hàng' },
] as const;

export type PhaseDetailTabKey = (typeof PHASE_DETAIL_TABS)[number]['key'];

export const DEFAULT_PHASE_TAB: PhaseDetailTabKey = 'tong-quan';

export const parsePhaseTabKey = (value: string | null): PhaseDetailTabKey =>
  PHASE_DETAIL_TABS.some((tab) => tab.key === value)
    ? (value as PhaseDetailTabKey)
    : DEFAULT_PHASE_TAB;

/**
 * Du lieu mot trang chi tiet phan khu.
 *
 * Vi tri, chinh sach ban hang dung chung voi du an cha nen duoc chep vao day
 * thay vi bat trang goi them mot lan nua. `planMap` da loc san chi con pin cua
 * phan khu nay. Bang hang van di qua `ProjectService.units` voi `phaseName`.
 */
export type PhaseDetail = {
  phase: ProjectPhase;
  projectSlug: string;
  projectName: string;
  siblings: PhaseSummary[];
  location: ProjectLocation;
  planMap: MasterPlanMap;
  salesPolicy: SalesPolicy;
};

// ── Tab: Mat bang quy can ──────────────────────────────────────────────────

/** Nhom quy hang - quyet dinh mau pin tren ban do mat bang */
export type UnitFundType = 'doc-quyen' | 'an-cheo' | 'thuong';

export const UNIT_FUND_LABELS: Record<UnitFundType, string> = {
  'doc-quyen': 'Quỹ Độc quyền',
  'an-cheo': 'Quỹ Ẩn + Chéo',
  thuong: 'Quỹ thưởng',
};

/** Mot pin gia gan tren anh mat bang */
export type PlanMarker = {
  publicId: string;
  code: string;
  price: number;
  fundType: UnitFundType;
  phaseName: string;
  propertyTypeLabel: string;
  landArea: number;
  status: UnitStatus;
  /** Vi tri tren anh, don vi % tinh tu goc tren-trai */
  x: number;
  y: number;
};

/**
 * Ban do mat bang = mot anh nen + cac pin gia.
 *
 * `width`/`height` la he toa do quy uoc cho Leaflet (CRS.Simple), khong phai
 * pixel that cua anh - chi ti le giua chung mo phong khung anh la du.
 */
export type MasterPlanMap = {
  imageUrl: string;
  width: number;
  height: number;
  markers: PlanMarker[];
};

// ── Tab: Quy can ───────────────────────────────────────────────────────────

export type UnitStatus = 'con-hang' | 'giu-cho' | 'da-ban';

export const UNIT_STATUS_LABELS: Record<UnitStatus, string> = {
  'con-hang': 'Còn hàng',
  'giu-cho': 'Giữ chỗ',
  'da-ban': 'Đã bán',
};

export type ProjectUnit = {
  publicId: string;
  code: string;
  /** Gia niem yet */
  listedPrice: number;
  /** Gia thanh toan som */
  netPrice: number;
  /** Don gia tren m2 dat */
  unitPrice: number;
  propertyTypeLabel: string;
  direction: string;
  landArea: number;
  buildArea: number;
  phaseName: string;
  status: UnitStatus;
};

export type UnitSort =
  | 'mac-dinh'
  | 'gia-tang'
  | 'gia-giam'
  | 'dien-tich-tang'
  | 'dien-tich-giam';

export const UNIT_SORT_LABELS: Record<UnitSort, string> = {
  'mac-dinh': 'Mặc định',
  'gia-tang': 'Giá thấp đến cao',
  'gia-giam': 'Giá cao đến thấp',
  'dien-tich-tang': 'Diện tích nhỏ đến lớn',
  'dien-tich-giam': 'Diện tích lớn đến nhỏ',
};

export type UnitQuery = {
  page: number;
  limit: number;
  sort: UnitSort;
  phaseName: string | null;
  propertyTypeLabel: string | null;
  direction: string | null;
  status: UnitStatus | null;
};

export const DEFAULT_UNIT_QUERY: UnitQuery = {
  page: 1,
  limit: 24,
  sort: 'mac-dinh',
  phaseName: null,
  propertyTypeLabel: null,
  direction: null,
  status: null,
};

export type PaginatedUnits = {
  units: ProjectUnit[];
  total: number;
  page: number;
  limit: number;
  /** Cac gia tri co that trong bang hang - do bo loc len tu day, khong hard-code */
  facets: {
    phaseNames: string[];
    propertyTypeLabels: string[];
    directions: string[];
  };
};

/** So can toi da duoc chon mot luc de mang sang trang so sanh */
export const MAX_UNIT_SELECTION = 5;

// ── Tab: Anh 360 ───────────────────────────────────────────────────────────

export type PanoramaHotspot = {
  publicId: string;
  label: string;
  /** Vi tri tuong doi trong khung anh, don vi % */
  x: number;
  y: number;
};

export type Panorama = {
  publicId: string;
  title: string;
  imageUrl: string;
  hotspots: PanoramaHotspot[];
};

// ── Tab: Dao tao ───────────────────────────────────────────────────────────

export type ProjectVideo = {
  publicId: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
};

// ── Tab: Chinh sach ban hang ───────────────────────────────────────────────

/** Muc chiet khau theo moc thoi gian thanh toan som */
export type PolicyDiscount = {
  publicId: string;
  label: string;
  percent: string;
};

/** O quyen loi: HTLS tran, dam bao lai suat, mien phi quan ly... */
export type PolicyPerk = {
  publicId: string;
  title: string;
  value: string;
  unit: string;
  note: string;
};

/** Bang ho tro lai suat: cot la ky han, dong la ty le vay */
export type InterestSchedule = {
  publicId: string;
  title: string;
  terms: string[];
  rows: {
    publicId: string;
    label: string;
    note: string;
    values: string[];
  }[];
};

export type LoyaltyTier = {
  publicId: string;
  name: string;
  percent: string;
};

export type PaymentPlan = {
  publicId: string;
  name: string;
  steps: { publicId: string; label: string; note: string; value: string }[];
};

export type SalesPolicy = {
  headline: string;
  discountTitle: string;
  discounts: PolicyDiscount[];
  perks: PolicyPerk[];
  interestSchedules: InterestSchedule[];
  loyalty: { title: string; note: string; tiers: LoyaltyTier[] };
  payment: { title: string; plans: PaymentPlan[] };
};

// ── Tab: Tien do ───────────────────────────────────────────────────────────

export type ProgressMilestone = {
  publicId: string;
  label: string;
  /** ISO. Moc dau tien co the la moc thang nen `label` moi la thu hien ra */
  date: string;
  videoThumbnailUrl: string;
  videoUrl: string;
  images: string[];
};

// ── Tab: Tai lieu ──────────────────────────────────────────────────────────

export type ProjectDocument = {
  publicId: string;
  order: number;
  name: string;
  url: string;
};

// ── Ghep tat ca ────────────────────────────────────────────────────────────

/**
 * Toan bo du lieu mot trang chi tiet.
 *
 * `quy-can` KHONG nam trong day: bang hang co the len hang nghin dong nen di
 * qua endpoint phan trang rieng (`ProjectService.units`).
 */
export type ProjectDetail = Project & {
  description: string;
  hero: MediaSlide[];
  stats: ProjectStat[];
  specs: ProjectSpec[];
  overviewImageUrl: string;
  masterPlan: MasterPlanSheet[];
  products: ProjectProduct[];
  intro: ProjectStorySection;
  amenities: ProjectAmenity[];
  closing: ProjectStorySection;
  consultants: ProjectConsultant[];
  location: ProjectLocation;
  phases: ProjectPhase[];
  planMap: MasterPlanMap;
  panoramas: Panorama[];
  trainingVideos: ProjectVideo[];
  salesPolicy: SalesPolicy;
  progress: ProgressMilestone[];
  documents: ProjectDocument[];
  news: NewsArticle[];
};
