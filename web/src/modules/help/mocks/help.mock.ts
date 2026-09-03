/**
 * Mock data cho trang huong dan su dung.
 *
 * Cau truc:
 *   - AUDIENCES: 4 doi tuong nguoi dung (co tab filter)
 *   - GUIDE_GROUPS: cac nhom chu de lon (5 nhom)
 *   - GUIDE_ARTICLES: bai viet huong dan chi tiet (co step-by-step)
 *   - FAQS: 8 cau hoi thuong gap (collapsible)
 *   - VIDEOS: 5 video tutorial mock (YouTube embed)
 *   - QUICK_LINKS: 6 lien he quan trong (contact/support/feedback...)
 *
 * Khi co backend:
 *   - Thay bang GET /help/articles?audience=X
 *   - POST /help/search de tim kiem full-text
 *   - GET /help/faq, GET /help/videos
 */

export type Audience = 'buyer' | 'agent' | 'developer' | 'partner';

export type GuideGroup = {
  publicId: string;
  title: string;
  description: string;
  icon: string;
  /** Article IDs thuoc nhom */
  articleIds: string[];
};

export type GuideArticle = {
  publicId: string;
  groupId: string;
  audience: Audience;
  title: string;
  excerpt: string;
  readMinutes: number;
  /** Anh bia tam - thay bang anh chup man hinh ung dung khi co */
  coverImage?: string;
  /** Step-by-step (markdown-like content, don gian) */
  steps: Array<{
    title: string;
    content: string;
    /** Optional URL anh minh hoa (chua co -> PlaceholderThumb) */
    image?: string;
  }>;
  tips?: string[];
};

export type FaqItem = {
  publicId: string;
  audience: Audience;
  question: string;
  answer: string;
};

export type VideoItem = {
  publicId: string;
  audience: Audience;
  title: string;
  description: string;
  duration: string;
  /** YouTube embed URL */
  videoUrl: string;
  thumbnailUrl?: string;
};

// ============================================================================
// Audiences (4 doi tuong)
// ============================================================================

export const AUDIENCES: Array<{
  id: Audience;
  label: string;
  description: string;
  emoji: string;
  count: number;
}> = [
  {
    id: 'buyer',
    label: 'Người mua / thuê',
    description: 'Tìm và đầu tư BĐS an toàn',
    emoji: '🏠',
    count: 18,
  },
  {
    id: 'agent',
    label: 'Môi giới',
    description: 'Tăng doanh số với RealtyHub',
    emoji: '💼',
    count: 24,
  },
  {
    id: 'developer',
    label: 'Chủ đầu tư',
    description: 'Quản lý dự án & đăng tin',
    emoji: '🏗️',
    count: 12,
  },
  {
    id: 'partner',
    label: 'Đối tác',
    description: 'Tích hợp API & liên kết',
    emoji: '🤝',
    count: 9,
  },
];

// ============================================================================
// Guide groups + articles
// ============================================================================

export const GUIDE_GROUPS: GuideGroup[] = [
  {
    publicId: 'getting-started',
    title: 'Bắt đầu nhanh',
    description: 'Thiết lập tài khoản và khám phá RealtyHub trong 10 phút',
    icon: '🚀',
    articleIds: ['gs-01', 'gs-02'],
  },
  {
    publicId: 'search',
    title: 'Tìm kiếm dự án',
    description: 'Sử dụng bộ lọc nâng cao và bản đồ để tìm BĐS phù hợp',
    icon: '🔍',
    articleIds: ['sr-01', 'sr-02', 'sr-03'],
  },
  {
    publicId: 'favorites',
    title: 'Yêu thích & so sánh',
    description: 'Lưu, so sánh và chia sẻ danh sách BĐS quan tâm',
    icon: '❤️',
    articleIds: ['fv-01', 'fv-02'],
  },
  {
    publicId: 'agent-tools',
    title: 'Công cụ môi giới',
    description: 'CRM, pipeline, đăng tin và báo cáo doanh thu',
    icon: '💼',
    articleIds: ['at-01', 'at-02'],
  },
  {
    publicId: 'security',
    title: 'Bảo mật & pháp lý',
    description: 'Xác minh danh tính, bảo vệ tài khoản và hỗ trợ pháp lý',
    icon: '🔒',
    articleIds: ['sc-01', 'sc-02'],
  },
];

export const GUIDE_ARTICLES: GuideArticle[] = [
  // ============ GETTING STARTED ============
  {
    publicId: 'gs-01',
    coverImage: '/images/guide/guide-01.jpg',
    groupId: 'getting-started',
    audience: 'buyer',
    title: 'Đăng ký tài khoản trong 60 giây',
    excerpt: 'Hướng dẫn tạo tài khoản cá nhân bằng email, Google hoặc Zalo.',
    readMinutes: 3,
    steps: [
      {
        title: 'Truy cập trang đăng ký',
        content:
          'Nhấn nút "Đăng nhập" ở góc phải trên cùng, sau đó chọn tab "Đăng ký". Bạn có thể dùng email, số điện thoại, Google hoặc Zalo.',
      },
      {
        title: 'Điền thông tin cá nhân',
        content:
          'Nhập họ tên, email và mật khẩu (tối thiểu 8 ký tự, có chữ và số). Tick đồng ý điều khoản.',
      },
      {
        title: 'Xác minh email',
        content:
          'Mở email vừa nhận được, nhấn vào link xác minh. Tài khoản được kích hoạt ngay lập tức.',
      },
    ],
    tips: [
      'Dùng email công ty nếu là môi giới',
      'Bật xác thực 2 yếu tố (2FA) để bảo vệ tài khoản',
    ],
  },
  {
    publicId: 'gs-02',
    coverImage: '/images/guide/guide-02.jpg',
    groupId: 'getting-started',
    audience: 'buyer',
    title: 'Hoàn thiện hồ sơ cá nhân',
    excerpt: 'Cập nhật avatar, sở thích BĐS và khu vực quan tâm để nhận đề xuất phù hợp.',
    readMinutes: 2,
    steps: [
      {
        title: 'Vào trang cá nhân',
        content:
          'Nhấn vào avatar ở góc phải trên, chọn "Tài khoản của tôi" → tab "Hồ sơ".',
      },
      {
        title: 'Cập nhật sở thích',
        content:
          'Chọn 3-5 khu vực quan tâm (quận/huyện), loại hình BĐS (căn hộ, đất nền,...) và khoảng giá.',
      },
    ],
  },

  // ============ SEARCH ============
  {
    publicId: 'sr-01',
    coverImage: '/images/guide/guide-03.jpg',
    groupId: 'search',
    audience: 'buyer',
    title: 'Dùng bộ lọc nâng cao để thu hẹp kết quả',
    excerpt: 'Kết hợp 12 tiêu chí để tìm đúng căn phù hợp trong vài giây.',
    readMinutes: 4,
    steps: [
      {
        title: 'Mở bộ lọc nâng cao',
        content:
          'Trang chủ hoặc trang /gio-hang, nhấn nút "Bộ lọc" ở góc trên bên phải.',
      },
      {
        title: 'Chọn tiêu chí',
        content:
          'Giá (thanh trượt), diện tích, số phòng ngủ, hướng ban công, tiện ích (gym, hồ bơi,...) và năm bàn giao.',
      },
      {
        title: 'Lưu bộ lọc',
        content:
          'Nhấn "Lưu bộ lọc" để nhận email khi có BĐS mới phù hợp.',
      },
    ],
    tips: [
      'Có thể lưu tối đa 10 bộ lọc khác nhau',
      'Dùng nút "Reset" nếu kết quả quá ít',
    ],
  },
  {
    publicId: 'sr-02',
    coverImage: '/images/guide/guide-04.jpg',
    groupId: 'search',
    audience: 'buyer',
    title: 'Tìm kiếm trên bản đồ',
    excerpt: 'Zoom vào khu vực quan tâm, kéo thả để xem các dự án xung quanh.',
    readMinutes: 3,
    steps: [
      {
        title: 'Chuyển sang chế độ bản đồ',
        content:
          'Trang /gio-hang, nhấn icon bản đồ ở góc phải. Bản đồ OpenStreetMap sẽ hiển thị.',
      },
      {
        title: 'Vẽ vùng tìm kiếm',
        content:
          'Nhấn nút "Vẽ vùng", kéo chuột để tạo hình chữ nhật. Chỉ các dự án nằm trong vùng mới hiển thị.',
      },
    ],
  },
  {
    publicId: 'sr-03',
    coverImage: '/images/guide/guide-05.jpg',
    groupId: 'search',
    audience: 'agent',
    title: 'Xuất danh sách dự án ra Excel',
    excerpt: 'Tiết kiệm 2 giờ nhập liệu mỗi tuần bằng cách xuất Excel trực tiếp.',
    readMinutes: 2,
    steps: [
      {
        title: 'Áp dụng bộ lọc',
        content: 'Lọc danh sách theo tiêu chí cần xuất.',
      },
      {
        title: 'Nhấn "Xuất Excel"',
        content:
          'Nút xuất nằm ở góc phải thanh công cụ. File .xlsx sẽ tải về trong 5 giây.',
      },
    ],
  },

  // ============ FAVORITES ============
  {
    publicId: 'fv-01',
    coverImage: '/images/guide/guide-06.jpg',
    groupId: 'favorites',
    audience: 'buyer',
    title: 'Lưu và quản lý danh sách yêu thích',
    excerpt: 'Đánh dấu trái tim ở bất kỳ dự án nào để xem lại sau.',
    readMinutes: 2,
    steps: [
      {
        title: 'Đăng nhập trước',
        content: 'Yêu thích chỉ hoạt động khi đã đăng nhập.',
      },
      {
        title: 'Nhấn icon trái tim',
        content: 'Icon hình trái tim nằm ở góc phải mỗi card dự án.',
      },
      {
        title: 'Xem lại ở /yeu-thich',
        content: 'Truy cập /yeu-thich để xem toàn bộ danh sách đã lưu.',
      },
    ],
  },
  {
    publicId: 'fv-02',
    coverImage: '/images/guide/guide-07.jpg',
    groupId: 'favorites',
    audience: 'buyer',
    title: 'So sánh tối đa 4 dự án cùng lúc',
    excerpt: 'Dùng tính năng so sánh để đưa ra quyết định nhanh hơn.',
    readMinutes: 3,
    steps: [
      {
        title: 'Tick "So sánh" trên các card',
        content: 'Mỗi card có checkbox "So sánh" ở góc trên bên trái.',
      },
      {
        title: 'Nhấn nút So sánh',
        content: 'Nút nổi ở góc dưới màn hình khi có ≥2 dự án được chọn.',
      },
    ],
  },

  // ============ AGENT TOOLS ============
  {
    publicId: 'at-01',
    coverImage: '/images/guide/guide-08.jpg',
    groupId: 'agent-tools',
    audience: 'agent',
    title: 'Thiết lập CRM cá nhân trong 15 phút',
    excerpt: 'Import khách hàng từ Excel, thiết lập pipeline và bắt đầu bán hàng.',
    readMinutes: 8,
    steps: [
      {
        title: 'Import khách hàng',
        content:
          'CRM → "Khách hàng" → "Import Excel". File mẫu có sẵn để tải về. Hỗ trợ tối đa 10.000 leads/lần.',
      },
      {
        title: 'Tạo pipeline',
        content:
          'CRM → "Pipeline". Tạo các bước: Mới tiếp xúc → Đang tư vấn → Đặt cọc → Chốt.',
      },
      {
        title: 'Gắn lead vào pipeline',
        content: 'Kéo thả lead giữa các bước. Mỗi lần chuyển có thể ghi chú thêm.',
      },
    ],
    tips: [
      'Bật thông báo email khi lead chuyển pipeline',
      'Dùng tag (màu sắc) để phân loại nguồn lead',
    ],
  },
  {
    publicId: 'at-02',
    coverImage: '/images/guide/guide-09.jpg',
    groupId: 'agent-tools',
    audience: 'agent',
    title: 'Đăng tin dự án tối ưu SEO',
    excerpt: 'Mẹo để tin của bạn lên top tìm kiếm và nhận nhiều lead hơn 3x.',
    readMinutes: 5,
    steps: [
      {
        title: 'Tiêu đề chuẩn SEO',
        content:
          'Dùng công thức: [Loại hình] + [Dự án] + [Khu vực] + [Lợi thế]. VD: "Căn hộ 2PN Vinhomes Grand Park — view sông, ưu đãi 5%".',
      },
      {
        title: 'Ảnh chất lượng cao',
        content:
          'Tối thiểu 8 ảnh, kích thước 1920×1080, có ảnh phòng ngủ, bếp, view, tiện ích.',
      },
    ],
  },

  // ============ SECURITY ============
  {
    publicId: 'sc-01',
    coverImage: '/images/guide/guide-10.jpg',
    groupId: 'security',
    audience: 'buyer',
    title: 'Bật xác thực 2 yếu tố (2FA)',
    excerpt: 'Lớp bảo vệ quan trọng nhất cho tài khoản của bạn — kích hoạt trong 30 giây.',
    readMinutes: 2,
    steps: [
      {
        title: 'Vào cài đặt bảo mật',
        content:
          'Tài khoản → Cài đặt → Bảo mật → "Bật 2FA".',
      },
      {
        title: 'Quét QR bằng Google Authenticator',
        content: 'Mở app Google Authenticator hoặc Authy, quét mã QR.',
      },
      {
        title: 'Lưu mã dự phòng',
        content:
          'Hệ thống cung cấp 10 mã dự phòng. Lưu ở nơi an toàn (không phải email).',
      },
    ],
  },
  {
    publicId: 'sc-02',
    coverImage: '/images/guide/guide-11.jpg',
    groupId: 'security',
    audience: 'buyer',
    title: 'Nhận biết tin đăng lừa đảo',
    excerpt: '6 dấu hiệu nhận biết BĐS "ma" và cách bảo vệ tài sản của bạn.',
    readMinutes: 6,
    steps: [
      {
        title: 'Giá thấp hơn 30% thị trường',
        content: 'Nếu giá rẻ bất thường, 90% là lừa đảo. Luôn so sánh với 3 dự án cùng khu vực.',
      },
      {
        title: 'Yêu cầu đặt cọc trước khi xem',
        content: 'Không bao giờ chuyển cọc khi chưa xem giấy tờ pháp lý gốc.',
      },
    ],
    tips: [
      'Kiểm tra số đăng ký kinh doanh của môi giới',
      'Gọi hotline dự án để xác minh thông tin',
    ],
  },
];

// ============================================================================
// FAQ
// ============================================================================

export const FAQS: FaqItem[] = [
  {
    publicId: 'faq-01',
    audience: 'buyer',
    question: 'RealtyHub có tính phí sử dụng không?',
    answer:
      'Hoàn toàn miễn phí cho người mua/thuê. Bạn có thể tìm kiếm, lưu yêu thích, so sánh và liên hệ môi giới không giới hạn. Phí chỉ áp dụng với môi giới khi đăng tin hoặc dùng gói Pro.',
  },
  {
    publicId: 'faq-02',
    audience: 'buyer',
    question: 'Làm sao biết một tin đăng có đáng tin cậy?',
    answer:
      'Mỗi tin đăng có 4 chỉ báo: (1) tick xanh "Đã xác minh" — dự án đã được team RealtyHub kiểm tra pháp lý, (2) số điện thoại hiển thị — môi giới đã xác thực danh tính, (3) lịch sử giao dịch — số deal đã chốt thành công, (4) đánh giá từ khách hàng trước.',
  },
  {
    publicId: 'faq-03',
    audience: 'buyer',
    question: 'Tôi có thể liên hệ trực tiếp chủ nhà không?',
    answer:
      'Tùy thuộc vào tin đăng. Một số dự án do chủ đầu tư đăng → bạn liên hệ trực tiếp. Một số qua môi giới → bạn liên hệ môi giới và họ sẽ kết nối. Thông tin này hiển thị rõ ở đầu mỗi tin đăng.',
  },
  {
    publicId: 'faq-04',
    audience: 'agent',
    question: 'Gói Pro có những quyền lợi gì?',
    answer:
      'Gói Pro (199.000đ/tháng) bao gồm: đăng tối đa 50 tin/tháng, ưu tiên hiển thị trên top tìm kiếm, tùy chỉnh trang cá nhân, CRM nâng cao, và hỗ trợ riêng qua Zalo. Gói Enterprise dành cho team ≥5 người với dashboard quản lý.',
  },
  {
    publicId: 'faq-05',
    audience: 'agent',
    question: 'Tôi quên mật khẩu, làm sao khôi phục?',
    answer:
      'Trang đăng nhập → nhấn "Quên mật khẩu" → nhập email → kiểm tra hộp thư (kể cả thư mục Spam) → nhấn link để đặt lại mật khẩu mới. Nếu không nhận được email trong 5 phút, liên hệ support@realtyhub.vn.',
  },
  {
    publicId: 'faq-06',
    audience: 'developer',
    question: 'Chi phí đăng dự án mới là bao nhiêu?',
    answer:
      'Dự án đăng lần đầu: 2.990.000đ/năm. Bao gồm trang dự án chuyên nghiệp, tối đa 100 căn hộ, quản lý leads, và báo cáo thị trường hàng tháng. Liên hệ sales@realtyhub.vn để được tư vấn gói Enterprise.',
  },
  {
    publicId: 'faq-07',
    audience: 'partner',
    question: 'RealtyHub có API public không?',
    answer:
      'Có. API REST + Webhook. Tài liệu đầy đủ tại /api-docs (yêu cầu tài khoản Partner). Có sandbox miễn phí để test, giới hạn 1.000 requests/ngày. Gói Production không giới hạn khi đăng ký partnership chính thức.',
  },
  {
    publicId: 'faq-08',
    audience: 'partner',
    question: 'Làm sao trở thành đối tác tích hợp?',
    answer:
      'Gửi đề xuất tới partners@realtyhub.vn bao gồm: tên công ty, mô tả sản phẩm, use case tích hợp, traffic ước tính. Đội ngũ sẽ phản hồi trong 5 ngày làm việc. Yêu cầu công ty đã hoạt động ≥1 năm và có ≥10.000 users.',
  },
];

// ============================================================================
// Videos (YouTube mock embed)
// ============================================================================

export const VIDEOS: VideoItem[] = [
  {
    publicId: 'v-01',
    thumbnailUrl: '/images/guide/guide-11.jpg',
    audience: 'buyer',
    title: '5 bước mua căn hộ an toàn cho người mua lần đầu',
    description: 'Hướng dẫn chi tiết từ chọn dự án đến ký hợp đồng công chứng.',
    duration: '12:45',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    publicId: 'v-02',
    thumbnailUrl: '/images/guide/guide-12.jpg',
    audience: 'agent',
    title: 'CRM RealtyHub — Setup pipeline trong 15 phút',
    description: 'Walkthrough từ import leads đến chốt deal đầu tiên trên hệ thống.',
    duration: '15:20',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    publicId: 'v-03',
    thumbnailUrl: '/images/guide/guide-13.jpg',
    audience: 'agent',
    title: 'Cách viết tin đăng thu hút 100+ leads',
    description: 'Công thức SEO + ảnh + video để tin đăng viral trên RealtyHub.',
    duration: '8:30',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    publicId: 'v-04',
    thumbnailUrl: '/images/guide/guide-14.jpg',
    audience: 'developer',
    title: 'Quản lý dự án quy mô lớn trên RealtyHub',
    description: 'Case study Vinhomes Grand Park — 12.000 căn, 200 leads/ngày.',
    duration: '20:15',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
  {
    publicId: 'v-05',
    thumbnailUrl: '/images/guide/guide-15.jpg',
    audience: 'buyer',
    title: 'Phân biệt sổ đỏ thật - giả trong 2 phút',
    description: 'Hướng dẫn kiểm tra sổ đỏ thật - giả, tránh bị lừa khi mua BĐS.',
    duration: '2:10',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  },
];

// ============================================================================
// Quick links (bottom CTA - lien he cac kenh support)
// ============================================================================

export const QUICK_LINKS = [
  {
    icon: '💬',
    title: 'Live Chat',
    description: 'Hỗ trợ tức thì 8:00 - 22:00',
    href: '#live-chat',
  },
  {
    icon: '📧',
    title: 'Email hỗ trợ',
    description: 'support@realtyhub.vn',
    href: 'mailto:support@realtyhub.vn',
  },
  {
    icon: '📞',
    title: 'Hotline',
    description: '024 7100 0000',
    href: 'tel:+842471000000',
  },
  {
    icon: '💡',
    title: 'Góp ý & phản hồi',
    description: 'Giúp chúng tôi cải thiện',
    href: '/gop-y-va-phan-hoi',
  },
];
