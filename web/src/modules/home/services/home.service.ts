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
import { MOCK_HOME_CONTENT } from '../mocks/home.mock';
import type { HomeContent } from '../models/home.model';

/** Do tre gia lap de trang thai loading hien ra dung nhu khi goi API that */
const NETWORK_DELAY_MS = 250;

const delay = <T,>(value: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), NETWORK_DELAY_MS));

export const HomeService = {
  /**
   * Noi dung tong hop cua trang chu - banner, thong ke, du an noi bat, vi-sao-chon.
   * KHI CO BACKEND: GET /home (hoac /home-config)
   */
  content: async (): Promise<HomeContent> => delay(MOCK_HOME_CONTENT),
};
