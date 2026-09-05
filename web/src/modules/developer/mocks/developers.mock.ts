/**
 * Mo rong MOCK_DEVELOPERS (chi co {value,label} cho filter combobox) thanh
 * day du thong tin de phuc vu trang /chu-dau-tu va /chu-dau-tu/[slug].
 *
 * KHONG sua file projects.mock.ts (la filter-option source of truth). Moi
 * du lieu them vao day cung id voi MOCK_DEVELOPERS nen service tra ve se
 * khop chinh xac voi cac gia tri dang co trong o loc "Chu dau tu".
 */

import type { Developer } from '../models/developer.model';

/** Tao slug co dau TV thanh slug URL: chu thuong, viet khong dau, dau cach -> '-' */
const toSlug = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Mo ta ngan (tagline) + mo ta day (description) cho moi chu dau tu.
    Giu ngan gon, neu thay doi sau se sua o day ma khong anh huong component. */
const DETAILS: Record<string, { tagline: string; description: string; website: string; foundedYear: number | null; parentCompany: string | null; headquarters: string }> = {
  'Tập đoàn An Khang': {
    tagline: 'Tập đoàn BĐS hàng đầu khu vực miền Trung, tập trung vào đô thị ven biển.',
    description:
      'Tập đoàn An Khang hoạt động trong lĩnh vực đầu tư và phát triển bất động sản từ năm 2008, với ba trụ cột: khu đô thị phức hợp, nghỉ dưỡng ven biển và nhà ở xã hội. Danh mục hiện gồm hơn 12 dự án trải dài từ Đà Nẵng đến Khánh Hòa. Đơn vị cam kết bàn giao đúng tiến độ, sổ đỏ lâu dài và hỗ trợ pháp lý trọn gói cho khách mua.',
    website: 'ankang.com.vn',
    foundedYear: 2008,
    parentCompany: null,
    headquarters: 'Số 12 Bạch Đằng, Quận Hải Châu, Đà Nẵng',
  },
  'Bảo Minh Group': {
    tagline: 'Chuyên khu đô thị sinh thái phía Nam Hà Nội và vùng phụ cận.',
    description:
      'Bảo Minh Group phát triển các khu đô thị sinh thái có hạ tầng đồng bộ, tiện ích nội khu khép kín và hệ thống công viên cây xanh lớn. Hiện đơn vị tập trung vào thị trường Hà Nội, Hưng Yên và Hải Phòng với 8 dự án đã và đang triển khai.',
    website: 'baominh-land.vn',
    foundedYear: 2014,
    parentCompany: null,
    headquarters: 'Tầng 9, Tòa nhà The Manor, Mễ Trì, Nam Từ Liêm, Hà Nội',
  },
  'Đông Dương Land': {
    tagline: 'Đơn vị tiên phong về shophouse và nhà phố liền kề vùng ven TP.HCM.',
    description:
      'Đông Dương Land tập trung phân khúc shophouse và nhà phố liền kề tại các tỉnh vùng ven TP.HCM như Long An, Bình Dương, Đồng Nai. Các dự án theo mô hình compound khép kín với tiện ích nội khu đầy đủ, pháp lý minh bạch và sổ hồng lâu dài.',
    website: 'dongduongland.vn',
    foundedYear: 2017,
    parentCompany: null,
    headquarters: 'Số 88 Trần Não, Phường An Khánh, TP. Hồ Chí Minh',
  },
  'Thái Bình Dương Holdings': {
    tagline: 'Đầu tư dự án nghỉ dưỡng cao cấp ven biển miền Trung và miền Nam.',
    description:
      'Thái Bình Dương Holdings vận hành chuỗi dự án nghỉ dưỡng 4-5 sao ven biển trải dài từ Quảng Ninh đến Kiên Giang. Mỗi dự án đều có mô hình quản lý vận hành chuẩn quốc tế, chương trình cam kết lợi nhuận cho thuê, và sổ đỏ lâu dài.',
    website: 'thaibinhduongholdings.vn',
    foundedYear: 2011,
    parentCompany: null,
    headquarters: 'Tầng 22, Tòa nhà Vincom, 191 Bà Triệu, Hà Nội',
  },
  'Trường Sơn Invest': {
    tagline: 'Phát triển khu công nghiệp và đô thị vệ tinh vùng Đông Nam Bộ.',
    description:
      'Trường Sơn Invest kết hợp hai mảng: khu công nghiệp gắn đô thị vệ tinh cho công nhân và dự án nhà ở xã hội quy mô lớn tại Bà Rịa – Vũng Tàu, Đồng Nai, Bình Dương. Đơn vị đã bàn giao hơn 18.000 sản phẩm trong 5 năm qua.',
    website: 'truongsoninvest.com',
    foundedYear: 2009,
    parentCompany: null,
    headquarters: 'Số 45 Cách Mạng Tháng Tám, Phường Phước Trung, TP. Bà Rịa',
  },
  Vingroup: {
    tagline: 'Tập đoàn đa ngành, đơn vị phát triển đô thị và nghỉ dưỡng quy mô hàng đầu.',
    description:
      'Vingroup là một trong những tập đoàn kinh tế tư nhân lớn nhất Việt Nam, hoạt động đa ngành từ bất động sản (Vinhomes) đến bán lẻ, y tế và giáo dục. Trong lĩnh vực bất động sản, các đại đô thị Vinhomes Ocean Park, Vinhomes Grand Park, Vinhomes Smart City đã trở thành chuẩn mực về đô thị thông minh ven đô, với hệ tiện ích all-in-one và sổ đỏ lâu dài.',
    website: 'vingroup.net',
    foundedYear: 1993,
    parentCompany: null,
    headquarters: 'Số 7, Đường Bằng Lăng 1, Khu đô thị Vinhomes Riverside, Long Biên, Hà Nội',
  },
};

/** Tao Developer[] tu MOCK_DEVELOPERS (chi co {value,label}) */
import { MOCK_DEVELOPERS } from '@/modules/project/mocks/projects.mock';

export const MOCK_DEVELOPER_RECORDS: Developer[] = MOCK_DEVELOPERS.map((entry) => {
  const detail = DETAILS[entry.label];
  return {
    publicId: entry.value,
    slug: toSlug(entry.label),
    name: entry.label,
    tagline: detail?.tagline ?? 'Chủ đầu tư đang cập nhật thông tin.',
    description:
      detail?.description ??
      'Thông tin chi tiết về chủ đầu tư này đang được cập nhật. Vui lòng quay lại sau.',
    logoUrl: '',
    website: detail?.website ?? '',
    foundedYear: detail?.foundedYear ?? null,
    parentCompany: detail?.parentCompany ?? null,
    headquarters: detail?.headquarters ?? '',
  };
});
