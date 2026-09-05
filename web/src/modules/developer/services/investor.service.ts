/**
 * Lop truy xuat du lieu cho 25 "Chu dau tu" chinh thuc (Investor).
 *
 * Day la SINGLE SOURCE OF TRUTH cho:
 *   - Section "CAC CHU DAU TU" tren trang chu (Doitac.tsx)
 *   - Trang /chu-dau-tu (list + detail)
 *
 * Hien tai:
 *   - Doc tu INVESTORS (25 records, khong duplicate)
 *   - Dem so du an va so can con hang tu MOCK_PROJECTS / getProjectUnits()
 *     (cung nguon voi /du-an, /quy-can) de so lieu luon khop
 *
 * Mapping 6 mock developerId (tu MOCK_DEVELOPERS) sang 25 Investor moi:
 *   - Vingroup (mock)  <->  Vinhomes (real - Vingroup la cong ty me)
 *   - An Khang          <->  Azure (mapping noi bo cho so lieu)
 *   - Bao Minh          <->  BIM Group
 *   - Dong Duong        <->  Dat Xanh Group
 *   - Thai Binh Duong   <->  Sun Group
 *   - Truong Son        <->  Ecopark
 *   - (cac investor khac chua co du an trong mock - projectCount = 0)
 *
 * Khi backend co module `investors` that, chi can sua mapping ben duoi va
 * thay than ham bang axios goi - cac component/hook/route khong can doi.
 */
import {
  getAllUnitsAcrossProjects,
  getProjectUnits,
} from '@/modules/project/mocks/project-detail.mock';
import { MOCK_PROJECTS } from '@/modules/project/mocks/projects.mock';
import { INVESTORS, findInvestorBySlug } from '../mocks/investors.mock';
import type { Investor, InvestorSummary, PaginatedInvestors } from '../models/investor.model';
import type { Project } from '@/modules/project/models/project.model';

/** Do tre gia lap de UX giong API that */
const NETWORK_DELAY_MS = 200;

const delay = <T,>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS));

/**
 * Anh xa developerId (6 mock) -> ten Investor de match voi 25 Investor moi.
 * Day la mapping noi bo cho giai doan mock - khi backend co, mapping se
 * duoc thay the boi developerId that (hoac 1 publicId rieng) trong project.
 */
const DEVELOPER_ID_TO_INVESTOR_NAME: Record<string, string> = {
  'cdt-vingroup': 'Vinhomes',
  'cdt-an-khang': 'Azure',
  'cdt-bao-minh': 'BIM Group',
  'cdt-dong-duong': 'Đất Xanh Group',
  'cdt-thai-binh-duong': 'Sun Group',
  'cdt-truong-son': 'Ecopark',
};

/** Tim Investor theo developerId cu (mock). */
const findInvestorByDeveloperId = (developerId: string): Investor | undefined => {
  const mappedName = DEVELOPER_ID_TO_INVESTOR_NAME[developerId];
  if (!mappedName) return undefined;
  return INVESTORS.find(
    (entry) => entry.name.toLowerCase() === mappedName.toLowerCase(),
  );
};

/** Tinh so lieu tong hop cho 1 Investor. */
const summarize = (investor: Investor): InvestorSummary => {
  const projects = MOCK_PROJECTS.filter((project) => {
    const matched = findInvestorByDeveloperId(project.developerId);
    return matched?.slug === investor.slug;
  });
  const projectSlugs = projects.map((p) => p.slug);

  let availableUnitCount = 0;
  for (const project of projects) {
    const units = getProjectUnits(project.slug);
    availableUnitCount += units.filter((u) => u.status === 'con-hang').length;
  }

  return {
    ...investor,
    projectCount: projects.length,
    openingProjectCount: projects.filter((p) => p.status === 'dang-mo-ban').length,
    availableUnitCount,
    projectSlugs,
  };
};

export const InvestorService = {
  /** Danh sach 25 Investor + so lieu tong hop.
   *  KHI CO BACKEND: GET /investors */
  list: async (): Promise<PaginatedInvestors> => {
    const investors = INVESTORS.map(summarize);
    return delay({
      investors,
      total: investors.length,
      page: 1,
      limit: investors.length,
    });
  },

  /** Lookup Investor theo slug - dung cho /chu-dau-tu/[slug].
   *  Tra ve null neu khong co slug do - route goi notFound(). */
  detail: async (slug: string): Promise<Investor | null> => {
    const investor = findInvestorBySlug(slug);
    return delay(investor ?? null);
  },

  /** Lay cac Project thuoc Investor (qua mapping noi bo).
   *  KHI CO BACKEND: GET /investors/:slug/projects */
  projects: async (slug: string): Promise<typeof MOCK_PROJECTS> => {
    const investor = findInvestorBySlug(slug);
    if (!investor) return delay([]);
    const projects = MOCK_PROJECTS.filter((project) => {
      const matched = findInvestorByDeveloperId(project.developerId);
      return matched?.slug === investor.slug;
    });
    return delay(projects);
  },

  /** So can con hang cua 1 Investor - dung cho quick stat. */
  availableUnitCount: (slug: string): number => {
    const investor = findInvestorBySlug(slug);
    if (!investor) return 0;
    return getAllUnitsAcrossProjects().filter((unit) => {
      const project = MOCK_PROJECTS.find((p) => p.slug === unit.projectSlug);
      if (!project) return false;
      const matched = findInvestorByDeveloperId(project.developerId);
      return matched?.slug === investor.slug && unit.status === 'con-hang';
    }).length;
  },

  /** Lay project list theo slug - SYNC, doc truc tiep tu mock.
   *  Tranh them 1 query async cho trang detail (SSR da co initial data).
   *  Khi backend that, doi thanh async voi useQuery de cache. */
  projectsSync: (slug: string): Project[] => {
    const investor = findInvestorBySlug(slug);
    if (!investor) return [];
    return MOCK_PROJECTS.filter((project) => {
      const matched = findInvestorByDeveloperId(project.developerId);
      return matched?.slug === investor.slug;
    });
  },
};
