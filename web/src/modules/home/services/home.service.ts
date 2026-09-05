/**
 * Lop truy xuat du lieu trang chu.
 *
 * HIEN TAI: doc tu mock trong bo nho.
 * KHI CO BACKEND: giu nguyen chu ky ham, thay than ham bang goi axios:
 *
 *   const res = await api.get(apiRoutes.HOME.GET_CONTENT());
 *   return unwrapApiData<HomeContent>(res.data);
 *
 * Trang chu chi can mot luot goi duy nhat nen tra ve nguyen object.
 */
import { InvestorService } from '@/modules/developer/services/investor.service';
import { ProjectService } from '@/modules/project/services/project.service';
import { MOCK_HOME_CONTENT } from '../mocks/home.mock';
import type { HomeContent } from '../models/home.model';

/** Do tre gia lap de trang thai loading hien ra dung nhu khi goi API that */
const NETWORK_DELAY_MS = 250;

const delay = <T,>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS));

export const HomeService = {
  /**
   * Noi dung tong hop cua trang chu - banner, du an noi bat, can noi bat,
   * 25 chu dau tu.
   *
   * Can noi bat lay tu ProjectService.featuredUnits (gom tu tat ca du an),
   * giu nguyen source-of-truth o mot cho - khi backend `projects/units/featured`
   * co, chi can doi ProjectService.featuredUnits.
   *
   * 25 chu dau tu lay tu InvestorService - cung nguon voi trang /chu-dau-tu.
   *
   * Ghi chu: MOCK_HOME_CONTENT khong con chua features/testimonials (2 khoi
   * nay da duoc di chuyen sang trang /gioi-thieu).
   *
   * KHI CO BACKEND: GET /home (hoac /home-config)
   */
  content: async (): Promise<HomeContent> => {
    const [featuredUnits, investorsPage] = await Promise.all([
      ProjectService.featuredUnits(12, 3),
      InvestorService.list(),
    ]);
    return delay({
      ...MOCK_HOME_CONTENT,
      featuredUnits,
      investors: investorsPage.investors,
    });
  },
};
