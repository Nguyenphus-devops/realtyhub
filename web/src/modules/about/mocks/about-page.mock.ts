/**
 * Mock data cho trang /gioi-thieu - phien ban viet lai ngay 05/09/2026.
 *
 * Cau truc moi phan tach thanh 6 section doc lap:
 *  1. hero              - tua de + lead + CTA chinh/phu
 *  2. intro             - "Về RealtyHub" - gioi thieu nen tang cong nghe danh cho sales/moi gioi
 *  3. inventory         - "QUY CAN PHONG PHU" - trong tam mien Nam
 *  4. trusted           - "DUOC KHACH HANG TIN TUONG" - gia tri loi ich
 *  5. journey           - "DONG HANH CUNG BAN TU A DEN Z" - timeline hanh trinh
 *  6. cta               - "TRO THANH CONG TAC VIEN" - CTA cuoi trang
 *
 * Noi dung trong section intro/values/highlights KHONG tu tao so lieu
 * khach hang/giao dich khong co nguon - theo dung yeu cau product.
 *
 * Tham khao cach trinh bay va ton giao tiep tu file SalePro (khong copy
 * nguyen van). SalePro la nen tang sales BĐS noi tieng, cu phap trinh
 * bay duoc su dung lam tham khao de giu phong cach marketing tuong tu.
 *
 * QUAN TRONG - icon duoc luu duoi dang string key (`iconKey`) thay vi
 * ComponentType vi /gioi-thieu la Server Component - khong the truyen
 * function qua ranh gioi server/client. Component client resolve icon
 * that qua ABOUT_ICON_MAP trong iconRegistry.ts.
 */

import type { AboutPageContent } from '../models/about.model';

export const MOCK_ABOUT_PAGE: AboutPageContent = {
  // ============ 1. HERO ============
  hero: {
    eyebrow: 'Về RealtyHub',
    headline: 'NỀN TẢNG CÔNG NGHỆ DÀNH RIÊNG CHO MÔI GIỚI BẤT ĐỘNG SẢN',
    lead: 'RealtyHub cung cấp thông tin dự án, kho quỹ căn tập trung và bộ công cụ hỗ trợ bán hàng chuyên dụng — để mỗi môi giới đều có thể tư vấn nhanh, so sánh chính xác và chốt giao dịch hiệu quả.',
    promises: [
      'Quỹ căn tập trung',
      'AI trợ lý sales',
      'So sánh sản phẩm',
      'Tính tài chính',
      'Quản lý khách hàng',
    ],
    primaryCta: {
      label: 'ĐĂNG KÝ TRỞ THÀNH CỘNG TÁC VIÊN',
      href: '/tro-thanh-moi-gioi',
    },
    secondaryCta: {
      label: 'Khám phá quỹ căn',
      href: '/quy-can',
    },
  },

  // ============ 2. GIỚI THIỆU - nền tảng công nghệ cho môi giới ============
  intro: {
    title: 'REALTYHUB – NỀN TẢNG CÔNG NGHỆ DÀNH RIÊNG CHO MÔI GIỚI BẤT ĐỘNG SẢN',
    body: 'RealtyHub là nền tảng công nghệ dành riêng cho môi giới bất động sản, cung cấp thông tin dự án và các công cụ hỗ trợ kinh doanh hiệu quả. Chúng tôi xây dựng để mỗi môi giới đều có thể làm việc chuyên nghiệp hơn mỗi ngày — bắt đầu từ việc có đủ dữ liệu, có công cụ, và có một quy trình rõ ràng để đi từ nhu cầu khách hàng đến giao dịch thành công.',
    pillars: [
      {
        iconKey: 'cpuChip',
        title: 'AI trợ lý sales',
        description:
          'Hỗ trợ tìm nguồn hàng, phân tích nhu cầu khách, tư vấn sản phẩm phù hợp và xử lý các tình huống từ chối phổ biến.',
      },
      {
        iconKey: 'search',
        title: 'Tìm quỹ căn nhanh',
        description:
          'Bộ lọc đa chiều theo giá, vị trí, diện tích, hướng view, chính sách bán hàng và tiến độ thanh toán — chỉ trong vài giây.',
      },
      {
        iconKey: 'rectangleStack',
        title: 'Kho dự án tập trung',
        description:
          'Thông tin dự án, pháp lý, bảng giá, chính sách ưu đãi và tài liệu bán hàng được chuẩn hoá theo cùng một cấu trúc.',
      },
      {
        iconKey: 'arrowsRightLeft',
        title: 'So sánh sản phẩm & chính sách',
        description:
          'Đặt nhiều căn, nhiều dự án hoặc nhiều chính sách cạnh nhau để khách hàng thấy rõ khác biệt và đưa ra lựa chọn.',
      },
      {
        iconKey: 'userGroup',
        title: 'Quản lý khách hàng',
        description:
          'Theo dõi nhu cầu, đề xuất sản phẩm phù hợp tự động và lưu lại toàn bộ lịch sử tư vấn trên cùng một hồ sơ.',
      },
      {
        iconKey: 'calculator',
        title: 'Tính tài chính nhanh',
        description:
          'Tính khoản thanh toán, lịch vay, chiết khấu và dòng tiền dự kiến — để khách hàng tự tin ra quyết định.',
      },
      {
        iconKey: 'sparkles',
        title: 'Công cụ bán hàng',
        description:
          'Tạo bảng hàng cá nhân, brochure, nội dung marketing và link gửi khách — tất cả từ một dữ liệu nguồn duy nhất.',
      },
      {
        iconKey: 'chartBar',
        title: 'Theo dõi giao dịch',
        description:
          'Quy trình rõ ràng từ booking → chốt deal → hoa hồng, giúp bạn không bỏ sót bất kỳ giao dịch nào.',
      },
    ],
  },

  // ============ 3. QUỸ CĂN - nhấn mạnh thị trường miền Nam ============
  inventory: {
    title: 'QUỸ CĂN PHONG PHÚ – TẬP TRUNG ĐẶC BIỆT TẠI THỊ TRƯỜNG MIỀN NAM',
    subtitle:
      'RealtyHub tập trung xây dựng nguồn quỹ căn phong phú cho môi giới — tổng hợp sản phẩm từ nhiều dự án, dễ dàng tìm kiếm và so sánh, cập nhật theo dữ liệu hiện có của hệ thống. Đặc biệt, chúng tôi ưu tiên nguồn hàng tại thị trường miền Nam — nơi tập trung nhiều dự án quy mô và đa dạng loại hình sản phẩm nhất hiện nay.',
    highlights: [
      {
        iconKey: 'building',
        title: 'Tổng hợp sản phẩm từ nhiều dự án',
        description:
          'Căn hộ, shophouse, nhà phố, biệt thự, đất nền — đủ loại hình sản phẩm ở nhiều phân khúc giá.',
      },
      {
        iconKey: 'scale',
        title: 'Dễ dàng tìm kiếm và so sánh',
        description:
          'Bộ lọc đa chiều và công cụ so sánh giúp bạn rút ngắn thời gian chọn căn phù hợp cho từng khách hàng.',
      },
      {
        iconKey: 'clock',
        title: 'Cập nhật theo dữ liệu hiện có của hệ thống',
        description:
          'Thông tin căn và chính sách được đồng bộ từ dữ liệu nguồn của dự án, giúp môi giới yên tâm tư vấn.',
      },
      {
        iconKey: 'globe',
        title: 'Một nền tảng, nhiều nguồn hàng',
        description:
          'Không phải mở hàng chục tab, không phải lưu hàng trăm file rời rạc — tất cả có mặt trên cùng một nền tảng.',
      },
    ],
    regionCallout: {
      region: 'Miền Nam',
      description:
        'Trọng tâm nguồn hàng của RealtyHub — nơi tập trung đa số dự án quy mô lớn, nhiều chủ đầu tư uy tín và đa dạng phân khúc cho cả khách mua ở lẫn nhà đầu tư.',
    },
  },

  // ============ 4. ĐƯỢC KHÁCH HÀNG TIN TƯỞNG VÀ LỰA CHỌN ============
  trusted: {
    title: 'ĐƯỢC KHÁCH HÀNG TIN TƯỞNG VÀ LỰA CHỌN',
    subtitle:
      'Môi giới và khách hàng sử dụng RealtyHub vì giá trị thực tế mà nền tảng mang lại — không phải lời hứa suông.',
    values: [
      {
        iconKey: 'shield',
        title: 'Nguồn thông tin tập trung',
        description:
          'Thay vì phải tìm dữ liệu rải rác trên nhiều nguồn, mọi thông tin dự án được gom về một nơi duy nhất, có cấu trúc thống nhất.',
      },
      {
        iconKey: 'newspaper',
        title: 'Thông tin dự án dễ tra cứu',
        description:
          'Pháp lý, tiến độ, bảng giá, mặt bằng, chính sách — đều có thể tra cứu nhanh trong cùng một giao diện.',
      },
      {
        iconKey: 'checkBadge',
        title: 'Quỹ căn thuận tiện tìm kiếm',
        description:
          'Tìm căn theo nhu cầu thực tế của khách hàng: giá, diện tích, vị trí, hướng, tầng, view — chỉ trong vài thao tác.',
      },
      {
        iconKey: 'wrench',
        title: 'Hỗ trợ môi giới tư vấn khách hàng',
        description:
          'Công cụ so sánh, tính tài chính và tạo bảng hàng giúp buổi tư vấn đi đúng trọng tâm, khách hàng ra quyết định nhanh hơn.',
      },
      {
        iconKey: 'bolt',
        title: 'Tiết kiệm thời gian tìm kiếm',
        description:
          'Một quy trình thay vì hàng chục bước thủ công — từ tìm nguồn, đối chiếu thông tin, đến gửi tài liệu cho khách.',
      },
      {
        iconKey: 'chartBar',
        title: 'Tăng hiệu quả làm việc',
        description:
          'Một môi giới có đủ công cụ sẽ tư vấn được nhiều khách hàng hơn trong cùng một khoảng thời gian — mà vẫn đảm bảo chất lượng.',
      },
    ],
  },

  // ============ 5. ĐỒNG HÀNH CÙNG BẠN TỪ A ĐẾN Z ============
  journey: {
    title: 'ĐỒNG HÀNH CÙNG BẠN TỪ A ĐẾN Z',
    subtitle:
      'Hành trình của một môi giới trên RealtyHub — từ lúc tìm kiếm thông tin đến khi chốt giao dịch thành công.',
    steps: [
      {
        title: 'Tìm kiếm',
        description:
          'Khám phá các dự án và sản phẩm theo khu vực, phân khúc giá hoặc chủ đầu tư — trên cùng một nền tảng.',
      },
      {
        title: 'Chọn dự án',
        description:
          'Xem thông tin chi tiết: pháp lý, tiến độ, mặt bằng tổng thể, chính sách bán hàng và bảng giá cập nhật.',
      },
      {
        title: 'Tìm quỹ căn',
        description:
          'Lọc quỹ căn theo nhu cầu thực tế của khách — diện tích, tầng, hướng, view, ngân sách tối đa.',
      },
      {
        title: 'Tra cứu thông tin',
        description:
          'Đối chiếu pháp lý, xem lịch thanh toán, tính khoản vay và so sánh nhiều căn trong cùng một bảng.',
      },
      {
        title: 'Tư vấn khách hàng',
        description:
          'Tạo bảng hàng riêng, gửi brochure, chia sẻ link so sánh cho khách — tất cả từ một dữ liệu nguồn duy nhất.',
      },
      {
        title: 'Theo dõi sản phẩm',
        description:
          'Đánh dấu căn quan tâm, nhận thông báo khi có biến động giá hoặc chính sách, không bỏ lỡ cơ hội.',
      },
      {
        title: 'Hỗ trợ giao dịch',
        description:
          'Theo dõi booking, tiến độ chốt deal và hoa hồng — để mỗi giao dịch đều đi đến đích an toàn.',
      },
    ],
  },

  // ============ 6. CTA - Trở thành cộng tác viên ============
  cta: {
    title: 'TRỞ THÀNH CỘNG TÁC VIÊN REALTYHUB',
    body: 'Tham gia RealtyHub để tiếp cận nguồn quỹ căn, thông tin dự án và các công cụ hỗ trợ kinh doanh dành riêng cho môi giới bất động sản.',
    primaryCta: {
      label: 'ĐĂNG KÝ TRỞ THÀNH CỘNG TÁC VIÊN',
      href: '/tro-thanh-moi-gioi',
    },
    secondaryCta: {
      label: 'ĐĂNG NHẬP',
      href: '/login',
    },
    footnote:
      'Bạn đã có tài khoản? Đăng nhập để tiếp tục sử dụng hệ thống. Nếu chưa, quy trình đăng ký chỉ mất khoảng 5 phút.',
  },
};
