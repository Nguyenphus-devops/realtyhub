/**
 * Du lieu mau cho trang chu - den khi backend co module `banner` + `home-config`
 * thi chi can doi than ham trong services/home.service.ts.
 *
 * Dung luon MOCK_PROJECTS tu module project de featured khong bi "lech" voi
 * trang /gio-hang (cung ten, cung dia chi, cung thumbnail).
 *
 * Ghi chu: MOCK_FEATURES + MOCK_TESTIMONIALS van duoc export vi 2 khoi
 * nay duoc tai su dung trong trang /gioi-thieu (module About). Chung
 * KHONG con tren trang chu.
 */
import { MOCK_PROJECTS } from '@/modules/project/mocks/projects.mock';
import type { HomeBannerSlide, HomeContent } from '../models/home.model';
import type { HomeFeature, HomeTestimonial } from '@/modules/about/models/about.model';

/** Lay ra 6 du an noi bat theo isHot + moi dang mo ban */
export const MOCK_BANNERS: HomeBannerSlide[] = [
  {
    publicId: 'banner-001',
    headline: '#1 NỀN TẢNG DÀNH CHO NHÀ MÔI GIỚI BẤT ĐỘNG SẢN',
    subheadline: 'CÔNG NGHỆ DÀNH RIÊNG CHO SALES – TÌM HÀNG NHANH, CHỐT DEAL TỐT',
    subtitle: 'ĐỪNG ĐỂ KHÁCH HÀNG CỦA BẠN ĐI TÌM ĐỐI TÁC KHÁC',
    primaryCtaLabel: 'Khám phá dự án',
    secondaryCtaLabel: 'Đăng ký tư vấn',
    desktopImageUrl: '/images/home/banner/desktop/b1.jpg',
    tabletImageUrl: '/images/home/banner/tablet/b1.jpg',
    mobileImageUrl: '/images/home/banner/mobile/b1.jpg',
  },
  {
    publicId: 'banner-002',
    headline: 'So sánh căn hộ trong vài giây',
    subtitle:
      'Đặt cùng lúc nhiều căn hộ lên bàn cân để chọn được căn phù hợp nhất với nhu cầu và tài chính của bạn.',
    primaryCtaLabel: 'So sánh ngay',
    desktopImageUrl: '/images/home/banner/desktop/b2.jpg',
    tabletImageUrl: '/images/home/banner/tablet/b2.jpg',
    mobileImageUrl: '/images/home/banner/mobile/b2.jpg',
  },
  {
    publicId: 'banner-003',
    headline: 'Sự kiện mở bán đang diễn ra',
    subtitle:
      'Cập nhật các đợt mở bán, lịch tham quan nhà mẫu và ưu đãi từ chủ đầu tư mỗi tuần.',
    primaryCtaLabel: 'Xem sự kiện',
    desktopImageUrl: '/images/home/banner/desktop/b3.jpg',
    tabletImageUrl: '/images/home/banner/tablet/b3.png',
    mobileImageUrl: '/images/home/banner/mobile/b3.jpg',
  },
];

export const MOCK_FEATURES: HomeFeature[] = [
  {
    publicId: 'feat-trusted',
    icon: 'shield',
    title: 'Thông tin minh bạch',
    description:
      'Mỗi dự án đều có đầy đủ pháp lý, tiến độ xây dựng và chính sách bán hàng được cập nhật liên tục.',
  },
  {
    publicId: 'feat-search',
    icon: 'search',
    title: 'Bộ lọc thông minh',
    description:
      'Tìm kiếm theo khu vực, loại hình, chủ đầu tư, giá bán và ngân sách - không cần đăng ký tài khoản.',
  },
  {
    publicId: 'feat-support',
    icon: 'support',
    title: 'Tư vấn miễn phí 1-1',
    description:
      'Đội ngũ chuyên viên đồng hành cùng bạn từ khi chọn dự án đến khi ký hợp đồng mua bán.',
  },
  {
    publicId: 'feat-compare',
    icon: 'chart',
    title: 'So sánh căn hộ trực quan',
    description:
      'Đặt cùng lúc nhiều căn lên bàn cân để chọn được căn phù hợp nhất với nhu cầu thực tế.',
  },
];

/** 6 du an noi bat: hot truoc, sau do moi theo thoi gian dang */
export const MOCK_FEATURED_PROJECTS = [...MOCK_PROJECTS]
  .sort((a, b) => {
    if (a.isHot !== b.isHot) return Number(b.isHot) - Number(a.isHot);
    return Date.parse(b.publishedAt) - Date.parse(a.publishedAt);
  })
  .slice(0, 6);

export const MOCK_TESTIMONIALS: HomeTestimonial[] = [
  {
    publicId: 'testimonial-001',
    authorName: 'Nguyễn Minh Tuấn',
    authorRole: 'Khách hàng mua căn hộ Vinhomes',
    rating: 5,
    quote:
      'RealtyHub giúp mình so sánh 4 dự án cùng lúc chỉ trong 10 phút. Thông tin pháp lý minh bạch, không phải gọi điện hỏi từng chủ đầu tư.',
    relatedProject: 'Vinhomes Grand Park',
  },
  {
    publicId: 'testimonial-002',
    authorName: 'Trần Thị Hồng Nhung',
    authorRole: 'Nhà đầu tư cá nhân',
    rating: 5,
    quote:
      'Đã mua 2 căn shophouse qua RealtyHub. Đội ngũ tư vấn nhiệt tình, đặc biệt là hỗ trợ thủ tục sang tên rất nhanh gọn.',
    relatedProject: 'Masteri Thanh Đa',
  },
  {
    publicId: 'testimonial-003',
    authorName: 'Lê Hoàng Phúc',
    authorRole: 'Môi giới BĐS 5 năm kinh nghiệm',
    rating: 4,
    quote:
      'Tôi dùng RealtyHub để tìm nguồn hàng cho khách. Bộ lọc theo ngân sách và khu vực rất trực quan, tiết kiệm được rất nhiều thời gian.',
    relatedProject: 'The Maris Vũng Tàu',
  },
  {
    publicId: 'testimonial-004',
    authorName: 'Phạm Thị Mai',
    authorRole: 'Khách hàng lần đầu mua nhà',
    rating: 5,
    quote:
      'Lần đầu mua nhà nên mình rất bỡ ngỡ. Nhờ RealtyHub mà mình hiểu rõ tiến độ thanh toán, pháp lý, và chọn được căn phù hợp với tài chính.',
    relatedProject: 'Akari City',
  },
];

export const MOCK_HOME_CONTENT: HomeContent = {
  banners: MOCK_BANNERS,
  featuredProjects: MOCK_FEATURED_PROJECTS,
  /**
   * Seed rong - service se goi ProjectService.featuredUnits() de lay can that.
   * De trong o day de mock file nay khong phu thuoc vao project-detail.mock
   * (tranh circular import).
   */
  featuredUnits: [],
  /**
   * Seed rong - service se goi InvestorService.list() de lay 25 chu dau
   * tu (dong bo voi trang /chu-dau-tu).
   */
  investors: [],
  // features + testimonials da duoc di chuyen sang trang /gioi-thieu
  // (module About). Trang chu khong su dung 2 khoi nay nua.
};
