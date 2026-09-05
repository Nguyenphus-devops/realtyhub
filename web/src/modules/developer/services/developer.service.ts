/**
 * Lop truy xuat du lieu chu dau tu.
 *
 * HIEN TAI: doc tu mock trong bo nho, tong hop so lieu tu MOCK_PROJECTS +
 * getAllUnitsAcrossProjects() (cung nguon voi /quy-can) de dam bao so
 * luan chuyen tren moi trang luon khop nhau.
 *
 * KHI CO BACKEND: giu nguyen chu ky ham, thay than ham bang goi axios:
 *   const res = await api.get(apiRoutes.DEVELOPERS.LIST);
 *   return unwrapApiData<PaginatedDevelopers>(res.data);
 *
 * Khong component hay hook nao duoc doc mock truc tiep - moi thu di qua
 * day, nen viec doi sang API that chi cham vao file nay.
 */
import {
  getAllUnitsAcrossProjects,
  getProjectUnits,
} from '@/modules/project/mocks/project-detail.mock';
import { MOCK_PROJECTS } from '@/modules/project/mocks/projects.mock';
import type { Project } from '@/modules/project/models/project.model';
import {
  MOCK_DEVELOPER_RECORDS,
} from '../mocks/developers.mock';
import type {
  Developer,
  DeveloperDetail,
  DeveloperStats,
  DeveloperSummary,
  PaginatedDevelopers,
} from '../models/developer.model';

/** Do tre gia lap de trang thai loading hien ra dung nhu khi goi API that */
const NETWORK_DELAY_MS = 200;

const delay = <T,>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS));

/** So du an + so can/san pham cho moi chu dau tu.
    Tinh 1 lan tai module load de cac lan truy van deu re. */
const summarize = (developerId: string): Omit<DeveloperSummary, keyof Developer> => {
  const projects = MOCK_PROJECTS.filter((p) => p.developerId === developerId);
  const projectSlugs = projects.map((p) => p.slug);

  let availableUnitCount = 0;
  let heldUnitCount = 0;
  let soldUnitCount = 0;

  for (const project of projects) {
    // Tranh goi getProjectUnits nhieu lan khi da cache (dong trong ham).
    const units = getProjectUnits(project.slug);
    for (const unit of units) {
      if (unit.status === 'con-hang') availableUnitCount += 1;
      else if (unit.status === 'giu-cho') heldUnitCount += 1;
      else soldUnitCount += 1;
    }
  }

  const openingProjectCount = projects.filter(
    (p) => p.status === 'dang-mo-ban',
  ).length;

  return {
    projectCount: projects.length,
    openingProjectCount,
    unitCount: availableUnitCount + heldUnitCount + soldUnitCount,
    availableUnitCount,
    projectSlugs,
  };
};

const attachSummary = (developer: Developer): DeveloperSummary => ({
  ...developer,
  ...summarize(developer.publicId),
});

export const DeveloperService = {
  /**
   * Danh sach chu dau tu + so lieu tong hop (so du an, so can con hang).
   * KHONG loc an toan: tat ca chu dau tu deu hien thi.
   *
   * KHI CO BACKEND: GET /developers
   */
  list: async (): Promise<PaginatedDevelopers> => {
    const developers = MOCK_DEVELOPER_RECORDS.map(attachSummary);
    return delay({
      developers,
      total: developers.length,
      page: 1,
      limit: developers.length,
    });
  },

  /**
   * Chi tiet chu dau tu theo slug. Tra ve null neu khong co slug do - trang
   * goi notFound() de Next tra dung 404 thay vi trang trong.
   *
   * KHI CO BACKEND: GET /developers/:slug
   */
  detail: async (slug: string): Promise<DeveloperDetail | null> => {
    const developer = MOCK_DEVELOPER_RECORDS.find((entry) => entry.slug === slug);
    if (!developer) return delay(null);

    const projects: Project[] = MOCK_PROJECTS.filter(
      (project) => project.developerId === developer.publicId,
    );

    let totalUnits = 0;
    let availableUnits = 0;
    let heldUnits = 0;
    let soldUnits = 0;

    for (const project of projects) {
      const units = getProjectUnits(project.slug);
      totalUnits += units.length;
      for (const unit of units) {
        if (unit.status === 'con-hang') availableUnits += 1;
        else if (unit.status === 'giu-cho') heldUnits += 1;
        else soldUnits += 1;
      }
    }

    const stats: DeveloperStats = {
      totalProjects: projects.length,
      openingProjects: projects.filter((p) => p.status === 'dang-mo-ban').length,
      upcomingProjects: projects.filter((p) => p.status === 'sap-mo-ban').length,
      deliveredProjects: projects.filter((p) => p.status === 'da-ban-giao').length,
      totalUnits,
      availableUnits,
      heldUnits,
      soldUnits,
    };

    return delay({ developer, stats, projects });
  },

  /**
   * Tra ve Developer theo publicId (khong phai slug). Dung noi bo de khop
   * filter `developerId` cua /du-an va /quy-can.
   */
  byPublicId: async (publicId: string): Promise<Developer | null> => {
    const developer = MOCK_DEVELOPER_RECORDS.find((entry) => entry.publicId === publicId);
    return delay(developer ?? null);
  },

  /**
   * Lay slug cua Developer theo publicId. Dung cho lien ket giua cac trang
   * co chi loc theo publicId (nhieu cho trong /quy-can, /du-an) sang trang
   * chi tiet chu dau tu.
   */
  slugByPublicId: (publicId: string): string | null => {
    const developer = MOCK_DEVELOPER_RECORDS.find((entry) => entry.publicId === publicId);
    return developer?.slug ?? null;
  },

  /**
   * Tong so can con hang cua tat ca du an cua chu dau tu. Tinh lai moi lan
   * goi (re vi mock) de luon khop voi `featuredUnits` o trang chu.
   */
  availableUnitCount: (developerId: string): number => {
    return getAllUnitsAcrossProjects().filter(
      (unit) => {
        const project = MOCK_PROJECTS.find((p) => p.slug === unit.projectSlug);
        return (
          project?.developerId === developerId && unit.status === 'con-hang'
        );
      },
    ).length;
  },
};
