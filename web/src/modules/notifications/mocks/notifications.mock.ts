/**
 * Mock data cho trang thong bao cua toi.
 *
 * Notification: su kien he thong gui cho user (project update, lead reply, ...).
 * Settings: tuy chinh user muon nhan loai thong bao nao qua kenh nao.
 *
 * Khi co backend:
 *   - GET /notifications?category=X&page=N -> { items, hasMore, total }
 *   - PATCH /notifications/:id/read
 *   - POST /notifications/read-all
 *   - DELETE /notifications/:id
 *   - GET /notifications/settings
 *   - PATCH /notifications/settings
 */

export type NotificationCategory =
  | 'project'
  | 'lead'
  | 'news'
  | 'system'
  | 'price';

export type NotificationPriority = 'normal' | 'high' | 'critical';

export type NotificationItem = {
  publicId: string;
  category: NotificationCategory;
  priority: NotificationPriority;
  /** Icon hien thi (emoji hoac luc_icon mapping) */
  icon: string;
  /** Ngu gui / brand */
  source: string;
  title: string;
  excerpt: string;
  /** Link di den khi click */
  href: string;
  /** Optional thumbnail / preview */
  thumbnail?: string;
  createdAt: string;
  isRead: boolean;
};

// ============================================================================
// Lookups
// ============================================================================

export const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  project: 'Dự án',
  lead: 'Tư vấn',
  news: 'Tin tức',
  system: 'Hệ thống',
  price: 'Giá & ưu đãi',
};

export const CATEGORY_ICONS: Record<NotificationCategory, string> = {
  project: '🏗️',
  lead: '💬',
  news: '📰',
  system: '⚙️',
  price: '💰',
};

export const CATEGORY_TONE: Record<NotificationCategory, string> = {
  project: 'bg-brand-50 text-brand-700',
  lead: 'bg-cyan-50 text-cyan-700',
  news: 'bg-purple-50 text-purple-700',
  system: 'bg-gray-100 text-gray-700',
  price: 'bg-amber-50 text-amber-700',
};

export const PRIORITY_LABELS: Record<NotificationPriority, string> = {
  normal: 'Bình thường',
  high: 'Quan trọng',
  critical: 'Khẩn cấp',
};

export const PRIORITY_TONE: Record<NotificationPriority, string> = {
  normal: 'bg-gray-100 text-gray-600',
  high: 'bg-amber-100 text-amber-700',
  critical: 'bg-rose-100 text-rose-700',
};

// ============================================================================
// Mock items (30 notifications, trai qua 14 ngay)
// ============================================================================

const now = new Date('2026-08-09T10:00:00.000Z');
const minutesAgo = (m: number) => new Date(now.getTime() - m * 60_000).toISOString();
const hoursAgo = (h: number) => minutesAgo(h * 60);
const daysAgo = (d: number) => hoursAgo(d * 24);

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  // ============ HOMNAY ============
  {
    publicId: 'nt-01',
    category: 'lead',
    priority: 'high',
    icon: '💬',
    source: 'Môi giới Nguyễn Văn A',
    title: 'Phản hồi mới về căn hộ Vinhomes Grand Park',
    excerpt:
      'Môi giới đã gửi báo giá chi tiết kèm 3 phương án thanh toán cho căn 2PN view sông.',
    href: '/ho-so/nguyen-van-a',
    createdAt: minutesAgo(15),
    isRead: false,
  },
  {
    publicId: 'nt-02',
    category: 'price',
    priority: 'critical',
    icon: '💰',
    source: 'Vinhomes',
    title: 'Giảm giá 8% căn hộ 2PN — chỉ trong hôm nay',
    excerpt:
      'Căn hộ 2PN diện tích 68m² giá chỉ từ 2.95 tỷ. Ưu đãi áp dụng đến 23:59 hôm nay.',
    href: '/gio-hang/vinhomes-grand-park',
    createdAt: minutesAgo(45),
    isRead: false,
  },
  {
    publicId: 'nt-03',
    category: 'project',
    priority: 'normal',
    icon: '🏗️',
    source: 'Masteri Thảo Điền',
    title: 'Cập nhật tiến độ dự án — Tháng 8/2026',
    excerpt:
      'Tiến độ xây dựng đạt 78%. Phân khu The Sun đã cất nóc, dự kiến bàn giao Q2/2027.',
    href: '/gio-hang/masteri-thao-dien',
    createdAt: hoursAgo(2),
    isRead: false,
  },
  {
    publicId: 'nt-04',
    category: 'news',
    priority: 'normal',
    icon: '📰',
    source: 'RealtyHub Newsroom',
    title: 'Báo cáo thị trường BĐS Quý 2/2026 đã được xuất bản',
    excerpt:
      'Phân tích chuyên sâu thị trường căn hộ TP.HCM — giá tăng 12% so với cùng kỳ, khu vực Thủ Đức dẫn đầu.',
    href: '/tin-tuc/bao-cao-thi-truong-q2-2026',
    createdAt: hoursAgo(4),
    isRead: true,
  },

  // ============ HOM QUA ============
  {
    publicId: 'nt-05',
    category: 'project',
    priority: 'normal',
    icon: '🏗️',
    source: 'The Maris Vũng Tàu',
    title: 'Mở bán đợt 2 — 80 căn view biển',
    excerpt:
      'Giai đoạn 2 mở bán với mức giá ưu đãi dành cho khách hàng đăng ký sớm. Đặt cọc chỉ 50 triệu.',
    href: '/gio-hang/the-maris-vung-tau',
    createdAt: hoursAgo(18),
    isRead: false,
  },
  {
    publicId: 'nt-06',
    category: 'lead',
    priority: 'normal',
    icon: '💬',
    source: 'Môi giới Trần Thị B',
    title: 'Lịch hẹn tham quan dự án đã được xác nhận',
    excerpt:
      'Bạn có lịch tham quan căn hộ mẫu Masteri Thảo Điền vào 14:00 ngày mai. Môi giới sẽ đón tại sảnh.',
    href: '/tai-khoan',
    createdAt: hoursAgo(22),
    isRead: false,
  },
  {
    publicId: 'nt-07',
    category: 'system',
    priority: 'normal',
    icon: '⚙️',
    source: 'RealtyHub',
    title: 'Hoàn tất xác minh danh tính',
    excerpt:
      'Tài khoản của bạn đã được xác minh cấp độ 2. Bạn có thể đặt cọc trực tuyến ngay bây giờ.',
    href: '/tai-khoan',
    createdAt: daysAgo(1),
    isRead: true,
  },
  {
    publicId: 'nt-08',
    category: 'price',
    priority: 'high',
    icon: '💰',
    source: 'Ecopark',
    title: 'Cơ hội cuối: căn shop-house view hồ cuối cùng',
    excerpt:
      'Chỉ còn 1 căn duy nhất. Giá ưu đãi kèm nội thất trị giá 800 triệu. Liên hệ ngay để giữ chỗ.',
    href: '/gio-hang/ecopark',
    createdAt: daysAgo(1),
    isRead: true,
  },

  // ============ 3-7 NAY ============
  {
    publicId: 'nt-09',
    category: 'project',
    priority: 'normal',
    icon: '🏗️',
    source: 'Vinhomes Ocean Park',
    title: 'Lịch thanh toán đợt 5 — Đến hạn 15/08',
    excerpt:
      'Đợt thanh toán 5 (10% giá trị căn hộ) đến hạn trong 6 ngày. Vui lòng thanh toán đúng hạn để tránh phí trễ.',
    href: '/tai-khoan/thanh-toan',
    createdAt: daysAgo(2),
    isRead: true,
  },
  {
    publicId: 'nt-10',
    category: 'news',
    priority: 'normal',
    icon: '📰',
    source: 'RealtyHub Newsroom',
    title: 'Luật đất đai 2026 — 5 điểm mới người mua cần biết',
    excerpt:
      'Luật mới có hiệu lực từ 01/08/2026 với nhiều thay đổi về bảng giá đất, thủ tục chuyển nhượng và quyền sử dụng.',
    href: '/tin-tuc/luat-dat-dai-2026',
    createdAt: daysAgo(2),
    isRead: true,
  },
  {
    publicId: 'nt-11',
    category: 'lead',
    priority: 'normal',
    icon: '💬',
    source: 'Môi giới Lê Quốc C',
    title: 'Đề xuất 3 căn hộ phù hợp với yêu cầu của bạn',
    excerpt:
      'Dựa trên tiêu chí của bạn (2PN, <3 tỷ, view sông), môi giới đã chọn 3 căn tốt nhất từ 2 dự án khác nhau.',
    href: '/ho-so/le-quoc-c',
    createdAt: daysAgo(3),
    isRead: true,
  },
  {
    publicId: 'nt-12',
    category: 'project',
    priority: 'normal',
    icon: '🏗️',
    source: 'The Global City',
    title: 'Phân khu mới The Light chính thức ra mắt',
    excerpt:
      'Phân khu thứ 6 với 250 căn hộ, hướng Đông Nam, view sông Sài Gòn. Mở bán ưu đãi đợt đầu.',
    href: '/gio-hang/the-global-city',
    createdAt: daysAgo(4),
    isRead: true,
  },
  {
    publicId: 'nt-13',
    category: 'system',
    priority: 'normal',
    icon: '⚙️',
    source: 'RealtyHub',
    title: 'Bảo mật: đăng nhập từ thiết bị mới',
    excerpt:
      'Phát hiện đăng nhập từ iPhone 15 Pro (Hà Nội). Nếu không phải bạn, vui lòng đổi mật khẩu ngay.',
    href: '/tai-khoan/bao-mat',
    createdAt: daysAgo(5),
    isRead: true,
  },
  {
    publicId: 'nt-14',
    category: 'price',
    priority: 'high',
    icon: '💰',
    source: 'Masterise Homes',
    title: 'Flash sale 12 giờ: căn 3PN giảm 250 triệu',
    excerpt:
      'Chỉ trong hôm nay từ 10:00 - 22:00. Căn 3PN Grand Marina, view sông Sài Gòn. Cọc 100 triệu giữ chỗ.',
    href: '/gio-hang/grand-marina',
    createdAt: daysAgo(5),
    isRead: true,
  },
  {
    publicId: 'nt-15',
    category: 'news',
    priority: 'normal',
    icon: '📰',
    source: 'RealtyHub Newsroom',
    title: 'Top 10 dự án đáng mua nhất 2026',
    excerpt:
      'Đánh giá khách quan từ 12 chuyên gia và 8.000 khảo sát khách hàng. Xem danh sách đầy đủ trong bài viết.',
    href: '/tin-tuc/top-10-du-an-2026',
    createdAt: daysAgo(6),
    isRead: true,
  },

  // ============ TUAN TRUOC / CU HON ============
  {
    publicId: 'nt-16',
    category: 'lead',
    priority: 'normal',
    icon: '💬',
    source: 'Môi giới Phạm Văn D',
    title: 'Yêu cầu tư vấn của bạn đã được tiếp nhận',
    excerpt:
      'Chuyên viên tư vấn BĐS cao cấp sẽ liên hệ với bạn trong 2 giờ tới (giờ hành chính).',
    href: '/tai-khoan/yeu-cau',
    createdAt: daysAgo(8),
    isRead: true,
  },
  {
    publicId: 'nt-17',
    category: 'project',
    priority: 'normal',
    icon: '🏗️',
    source: 'Vinhomes Grand Park',
    title: 'Bàn giao sổ hồng đợt đầu — Tháng 9/2026',
    excerpt:
      'Đợt bàn giao sổ hồng đầu tiên cho cư dân phân khu The Manhattan. Vui lòng chuẩn bị CMND/CCCD.',
    href: '/gio-hang/vinhomes-grand-park',
    createdAt: daysAgo(10),
    isRead: true,
  },
  {
    publicId: 'nt-18',
    category: 'system',
    priority: 'critical',
    icon: '⚙️',
    source: 'RealtyHub',
    title: 'Cập nhật điều khoản dịch vụ — Có hiệu lực từ 01/09/2026',
    excerpt:
      'Chúng tôi cập nhật điều khoản dịch vụ và chính sách bảo mật. Vui lòng xem chi tiết trước khi tiếp tục sử dụng.',
    href: '/dieu-khoan',
    createdAt: daysAgo(12),
    isRead: true,
  },
  {
    publicId: 'nt-19',
    category: 'price',
    priority: 'normal',
    icon: '💰',
    source: 'Sun Group',
    title: 'Chính sách chiết khấu 5% cho khách thanh toán sớm',
    excerpt:
      'Áp dụng cho dự án Sun Grand City Thanh Hóa. Thanh toán 100% giá trị trong 30 ngày được giảm ngay 5%.',
    href: '/gio-hang/sun-grand-city',
    createdAt: daysAgo(13),
    isRead: true,
  },
  {
    publicId: 'nt-20',
    category: 'news',
    priority: 'normal',
    icon: '📰',
    source: 'RealtyHub Newsroom',
    title: 'Hướng dẫn thủ tục sang tên sổ đỏ năm 2026',
    excerpt:
      'Thủ tục đơn giản hơn với luật mới: chỉ cần 3 giấy tờ thay vì 7 như trước. Thời gian xử lý 7-10 ngày.',
    href: '/tin-tuc/sang-ten-so-do-2026',
    createdAt: daysAgo(13),
    isRead: true,
  },
];

// ============================================================================
// Settings (tuy chinh nhan thong bao qua kenh nao)
// ============================================================================

export type NotificationSetting = {
  category: NotificationCategory;
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSetting[] = [
  { category: 'project', emailEnabled: true, pushEnabled: true, smsEnabled: false },
  { category: 'price', emailEnabled: true, pushEnabled: true, smsEnabled: true },
  { category: 'lead', emailEnabled: true, pushEnabled: true, smsEnabled: true },
  { category: 'news', emailEnabled: false, pushEnabled: false, smsEnabled: false },
  { category: 'system', emailEnabled: true, pushEnabled: false, smsEnabled: false },
];

export const CHANNEL_LABELS: Record<'email' | 'push' | 'sms', string> = {
  email: 'Email',
  push: 'Push',
  sms: 'SMS',
};

export const CHANNEL_DESCRIPTIONS: Record<'email' | 'push' | 'sms', string> = {
  email: 'Gửi về email đăng ký',
  push: 'Thông báo đẩy trên trình duyệt',
  sms: 'Tin nhắn SMS điện thoại',
};