/**
 * Mock data cho module feedback (gop y & phan hoi).
 *
 * Khi co backend:
 *   - Thay bang GET /feedback -> { items, total }
 *   - POST /feedback (multipart neu co screenshot)
 *   - Stats goi /feedback/stats
 *   - Roadmap goi /feedback/roadmap
 */

export type FeedbackCategory =
  | 'ui-ux'
  | 'tinh-nang'
  | 'hieu-nang'
  | 'noi-dung'
  | 'dich-vu'
  | 'khac';

export type FeedbackRating = 'pos' | 'neu' | 'neg';

export type FeedbackStatus = 'received' | 'reviewing' | 'planned' | 'shipped';

export type FeedbackItem = {
  publicId: string;
  /** Hien thi publicId-001, khong lo danh cap */
  displayId: string;
  category: FeedbackCategory;
  rating: FeedbackRating;
  title: string;
  content: string;
  /** Trang thai xu ly public */
  status: FeedbackStatus;
  /** Nguoi gui (display name hoac "An danh") */
  authorName: string;
  /** Co dang nhap hay an danh */
  isAnonymous: boolean;
  /** Co screenshot hay khong */
  hasScreenshot: boolean;
  /** So nguoi cung dong y */
  upvotes: number;
  submittedAt: string;
  /** Admin reply (neu co) */
  adminReply?: string;
};

// ============================================================================
// Lookups
// ============================================================================

export const FEEDBACK_CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  'ui-ux': 'Giao diện & Trải nghiệm',
  'tinh-nang': 'Tính năng',
  'hieu-nang': 'Hiệu năng & Tốc độ',
  'noi-dung': 'Nội dung',
  'dich-vu': 'Dịch vụ & Hỗ trợ',
  khac: 'Khác',
};

export const FEEDBACK_CATEGORY_ICONS: Record<FeedbackCategory, string> = {
  'ui-ux': '🎨',
  'tinh-nang': '⚙️',
  'hieu-nang': '⚡',
  'noi-dung': '📝',
  'dich-vu': '🎧',
  khac: '💬',
};

export const FEEDBACK_STATUS_LABELS: Record<FeedbackStatus, string> = {
  received: 'Đã tiếp nhận',
  reviewing: 'Đang xem xét',
  planned: 'Đã lên kế hoạch',
  shipped: 'Đã triển khai',
};

export const FEEDBACK_STATUS_TONE: Record<FeedbackStatus, string> = {
  received: 'bg-gray-100 text-gray-700',
  reviewing: 'bg-cyan-50 text-cyan-700',
  planned: 'bg-amber-50 text-amber-700',
  shipped: 'bg-green-50 text-green-700',
};

export const FEEDBACK_RATING_LABELS: Record<FeedbackRating, string> = {
  pos: 'Hài lòng',
  neu: 'Tạm được',
  neg: 'Cần cải thiện',
};

export const FEEDBACK_RATING_TONE: Record<FeedbackRating, { bg: string; chip: string; emoji: string }> = {
  pos: { bg: 'bg-green-50 border-green-200', chip: 'bg-green-500', emoji: '👍' },
  neu: { bg: 'bg-amber-50 border-amber-200', chip: 'bg-amber-500', emoji: '😐' },
  neg: { bg: 'bg-rose-50 border-rose-200', chip: 'bg-rose-500', emoji: '👎' },
};

// ============================================================================
// Stats (counters cho hero + sidebar)
// ============================================================================

export const FEEDBACK_STATS = {
  totalReceived: 1247,
  /** Tong phan hoi da xu ly xong (status = shipped) */
  totalShipped: 218,
  /** Trung binh thoi gian phan hoi (gio) */
  avgResponseHours: 18,
  /** Tỉ lệ feedback duoc upvote boi nguoi khac */
  upvoteRate: 73,
};

// ============================================================================
// Roadmap (cac cai tien sap toi dua tren feedback)
// ============================================================================

export const FEEDBACK_ROADMAP = [
  {
    title: 'So sánh dự án side-by-side',
    description: 'Tính năng đang được 87 người dùng yêu cầu. Dự kiến ra mắt tháng 9/2026.',
    relatedFeedbackCount: 87,
    progress: 60,
  },
  {
    title: 'Bản đồ nhiệt giá BĐS theo quận',
    description: 'Visualization trực quan giúp môi giới nắm nhanh biến động giá thị trường.',
    relatedFeedbackCount: 54,
    progress: 30,
  },
  {
    title: 'Xuất danh sách căn hộ ra Excel',
    description: 'Tiết kiệm thời gian nhập liệu cho môi giới khi gửi báo giá cho khách.',
    relatedFeedbackCount: 41,
    progress: 80,
  },
  {
    title: 'Dark mode cho toàn bộ admin',
    description: 'Sau 1 năm yêu cầu, cuối cùng dark mode cũng sắp ra mắt.',
    relatedFeedbackCount: 128,
    progress: 90,
  },
];

// ============================================================================
// Mock recent feedbacks (public wall)
// ============================================================================

export const MOCK_RECENT_FEEDBACKS: FeedbackItem[] = [
  {
    publicId: 'fb-001',
    displayId: 'FB-1247',
    category: 'tinh-nang',
    rating: 'pos',
    title: 'Tính năng so sánh rất tiện',
    content:
      'So sánh 3 dự án cùng lúc giúp tôi gửi báo giá cho khách nhanh hơn 40%. Mong có thêm tuỳ chọn so sánh căn hộ theo mặt bằng.',
    status: 'shipped',
    authorName: 'Nguyễn Minh K.',
    isAnonymous: false,
    hasScreenshot: false,
    upvotes: 47,
    submittedAt: '2026-08-07T03:15:00.000Z',
    adminReply: 'Cảm ơn bạn! So sánh mặt bằng dự kiến ra mắt Q4/2026.',
  },
  {
    publicId: 'fb-002',
    displayId: 'FB-1246',
    category: 'hieu-nang',
    rating: 'neg',
    title: 'Trang chi tiết dự án load chậm trên mobile',
    content:
      'Khi mở ảnh 360°, app bị giật 2-3 giây trên iPhone 12. Mong team tối ưu thêm.',
    status: 'planned',
    authorName: 'Ẩn danh',
    isAnonymous: true,
    hasScreenshot: true,
    upvotes: 89,
    submittedAt: '2026-08-06T08:20:00.000Z',
  },
  {
    publicId: 'fb-003',
    displayId: 'FB-1245',
    category: 'ui-ux',
    rating: 'neu',
    title: 'Menu mobile hơi khó tìm',
    content:
      'Menu 3 chấm trên mobile nên làm to hơn, mình hay bấm nhầm. Ngoài ra các tính năng rất tốt!',
    status: 'reviewing',
    authorName: 'Trần Thu H.',
    isAnonymous: false,
    hasScreenshot: true,
    upvotes: 23,
    submittedAt: '2026-08-05T10:45:00.000Z',
  },
  {
    publicId: 'fb-004',
    displayId: 'FB-1244',
    category: 'noi-dung',
    rating: 'pos',
    title: 'Tin tức rất chất lượng',
    content:
      'Các bài phân tích thị trường giúp tôi nắm được biến động nhanh hơn báo chí. Mong ra thêm bài chuyên sâu.',
    status: 'shipped',
    authorName: 'Lê Quốc B.',
    isAnonymous: false,
    hasScreenshot: false,
    upvotes: 56,
    submittedAt: '2026-08-04T02:30:00.000Z',
  },
  {
    publicId: 'fb-005',
    displayId: 'FB-1243',
    category: 'dich-vu',
    rating: 'neg',
    title: 'Hỗ trợ live chat phản hồi chậm',
    content:
      'Hôm qua mình hỏi về phí đăng tin mà phải đợi 25 phút mới có ai reply. Hy vọng cải thiện.',
    status: 'received',
    authorName: 'Phạm Văn C.',
    isAnonymous: false,
    hasScreenshot: false,
    upvotes: 18,
    submittedAt: '2026-08-03T14:00:00.000Z',
  },
  {
    publicId: 'fb-006',
    displayId: 'FB-1242',
    category: 'tinh-nang',
    rating: 'pos',
    title: 'Yêu thích hoạt động tốt',
    content:
      'Có thể sync yêu thích giữa web và mobile. Tính năng này thật sự hữu ích cho người di chuyển nhiều.',
    status: 'shipped',
    authorName: 'Hoàng Thị M.',
    isAnonymous: false,
    hasScreenshot: false,
    upvotes: 34,
    submittedAt: '2026-08-02T07:50:00.000Z',
  },
];