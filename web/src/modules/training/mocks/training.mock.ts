/**
 * Mock data cho trang /dao-tao.
 *
 * Noi dung tieng Viet, tap trung vao dao tao moi gioi bat dong san:
 *   - Hero (eyebrow + headline + tagline + 4 so lieu)
 *   - 4 cap do (Fresher -> Junior -> Senior -> Manager) theo lo trinh
 *   - 6 khoa hoc noi bat (card grid)
 *   - 4 giang vien (mentor)
 *   - 4 lich khai giang sap toi
 *   - 3 loi chung nhan tu hoc vien
 *
 * Khi co backend: thay bang GET /training -> tra ve TrainingContent.
 *
 * Icon dung react-icons/hi2 (Heroicons v2 outline) - cung nhom voi about.
 */

import type { ComponentType } from 'react';

import {
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCheckBadge,
  HiOutlineClipboardDocumentCheck,
  HiOutlineClock,
  HiOutlineCodeBracket,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineGlobeAlt,
  HiOutlineMegaphone,
  HiOutlinePresentationChartLine,
  HiOutlineScale,
  HiOutlineSparkles,
  HiOutlineTrophy,
  HiOutlineUsers,
  HiOutlineVideoCamera,
} from 'react-icons/hi2';

// ============================================================================
// Types
// ============================================================================

export type TrainingLevel = {
  id: string;
  /** Ma cap do: LV1, LV2, ... */
  code: string;
  /** Ten hien thi (VD: "Mo hinh moi giao") */
  title: string;
  /** Subtitle ngan mo ta */
  subtitle: string;
  /** Danh sach ky nang dat duoc sau cap do */
  outcomes: string[];
  /** Icon dai dien */
  icon: ComponentType<{ 'aria-hidden'?: boolean; className?: string }>;
};

export type TrainingCourse = {
  publicId: string;
  /** Danh muc: 'foundation' | 'sales' | 'legal' | 'marketing' | 'advanced' */
  category: 'foundation' | 'sales' | 'legal' | 'marketing' | 'advanced';
  title: string;
  description: string;
  /** So buoi hoc */
  sessions: number;
  /** Tong thoi luong (gio) */
  hours: number;
  /** Trinh do: 'Co ban' | 'Trung cap' | 'Nang cao' */
  level: 'Cơ bản' | 'Trung cấp' | 'Nâng cao';
  /** Hoc phi (VND) - hien thi khong cham, co the kem "Mien phi" neu = 0 */
  price: number;
  icon: ComponentType<{ 'aria-hidden'?: boolean; className?: string }>;
  /** Ten giang vien phu trach */
  instructor: string;
};

export type TrainingInstructor = {
  publicId: string;
  name: string;
  role: string;
  /** So nam kinh nghiem */
  experience: string;
  avatar?: string;
  bio: string;
  specialties: string[];
};

export type TrainingSession = {
  publicId: string;
  /** Tieu de lop (thuong la ten khoa hoc) */
  title: string;
  /** Ngay khai giang (DD/MM) */
  startDate: string;
  /** Khung gio (VD: "T2 - T6 | 19:30 - 21:30") */
  schedule: string;
  /** Hinh thuc: 'Online' | 'Offline' | 'Hybrid' */
  format: 'Online' | 'Offline' | 'Hybrid';
  /** Dia diem neu offline */
  location?: string;
  /** So cho con lai / tong cho */
  seats: { remaining: number; total: number };
  /** Gia (VND) - 0 nghia la mien phi */
  price: number;
};

export type TrainingTestimonial = {
  publicId: string;
  name: string;
  role: string;
  avatar?: string;
  /** Loi nhan xet */
  quote: string;
  /** Ten khoa da hoan thanh */
  course: string;
};

export type TrainingMetric = {
  value: string;
  label: string;
  suffix?: string;
};

export type TrainingContent = {
  hero: {
    eyebrow: string;
    headline: string;
    tagline: string;
    byline: string;
  };
  metrics: TrainingMetric[];
  levels: TrainingLevel[];
  courses: TrainingCourse[];
  instructors: TrainingInstructor[];
  upcomingSessions: TrainingSession[];
  testimonials: TrainingTestimonial[];
};

// ============================================================================
// Hero
// ============================================================================

const HERO = {
  eyebrow: 'RealtyHub Academy',
  headline: 'Trở thành môi giới chuyên nghiệp',
  tagline:
    'Lộ trình 4 cấp độ, từ nền tảng đến quản lý — giúp bạn đi từ người mới đến chuyên viên tư vấn hàng đầu trong 12 tháng.',
  byline: 'Đào tạo thực chiến · Cấp chứng nhận · Hỗ trợ việc làm',
};

// ============================================================================
// Số liệu
// ============================================================================

const METRICS: TrainingMetric[] = [
  { value: '12', label: 'Khóa học trực tuyến', suffix: '+' },
  { value: '8', label: 'Giảng viên thực chiến', suffix: '' },
  { value: '2.500', label: 'Học viên đã tốt nghiệp', suffix: '+' },
  { value: '85', label: 'Tỷ lệ có việc sau 3 tháng', suffix: '%' },
];

// ============================================================================
// Lộ trình 4 cấp độ
// ============================================================================

const LEVELS: TrainingLevel[] = [
  {
    id: 'lv1',
    code: 'LV1',
    title: 'Mô hình môi giới',
    subtitle: 'Nền tảng cho người mới',
    icon: HiOutlineAcademicCap,
    outcomes: [
      'Hiểu thị trường BĐS Việt Nam và phân khúc phổ biến',
      'Nắm quy trình một giao dịch từ lead đến chốt',
      'Sử dụng CRM và công cụ của RealtyHub',
    ],
  },
  {
    id: 'lv2',
    code: 'LV2',
    title: 'Bán hàng chuyên sâu',
    subtitle: 'Tư vấn khách hàng thực chiến',
    icon: HiOutlineChartBar,
    outcomes: [
      'Phỏng vấn nhu cầu và định vị sản phẩm phù hợp',
      'Xử lý 8 tình huống từ chối thường gặp',
      'Xây dựng kịch bản tư vấn cho 4 phân khúc',
    ],
  },
  {
    id: 'lv3',
    code: 'LV3',
    title: 'Pháp lý & Thủ tục',
    subtitle: 'An toàn, không tranh chấp',
    icon: HiOutlineScale,
    outcomes: [
      'Đọc hiểu sổ đỏ, hợp đồng mua bán và đặt cọc',
      'Quy trình sang tên, thế chấp, công chứng',
      'Nhận diện rủi ro pháp lý phổ biến',
    ],
  },
  {
    id: 'lv4',
    code: 'LV4',
    title: 'Quản lý & Vận hành',
    subtitle: 'Trưởng nhóm / Manager',
    icon: HiOutlineUsers,
    outcomes: [
      'Xây dựng team 5-15 môi giới',
      'Quản trị pipeline và KPI doanh số',
      'Tuyển dụng, đào tạo nội bộ và giữ chân nhân sự',
    ],
  },
];

// ============================================================================
// Khóa học nổi bật (6 khóa)
// ============================================================================

const COURSES: TrainingCourse[] = [
  {
    publicId: 'foundation-101',
    category: 'foundation',
    title: 'Nhập môn BĐS cho môi giới',
    description:
      'Tổng quan thị trường, vai trò môi giới, quy trình một giao dịch và các khái niệm bắt buộc trước khi ra thực địa.',
    sessions: 6,
    hours: 12,
    level: 'Cơ bản',
    price: 0,
    icon: HiOutlineAcademicCap,
    instructor: 'Nguyễn Minh Khoa',
  },
  {
    publicId: 'sales-script',
    category: 'sales',
    title: 'Xây dựng kịch bản tư vấn 1-1',
    description:
      'Cách đặt câu hỏi khám phá nhu cầu, xử lý phản đối, dẫn dắt khách hàng đến quyết định — kèm 8 tình huống thực tế.',
    sessions: 8,
    hours: 16,
    level: 'Trung cấp',
    price: 1490000,
    icon: HiOutlineChatBubbleLeftRight,
    instructor: 'Trần Thanh Hải',
  },
  {
    publicId: 'legal-101',
    category: 'legal',
    title: 'Pháp lý BĐS ứng dụng',
    description:
      'Đọc sổ đỏ, hợp đồng đặt cọc - mua bán, quy trình công chứng và những rủi ro pháp lý môi giới hay gặp nhất.',
    sessions: 10,
    hours: 20,
    level: 'Trung cấp',
    price: 1990000,
    icon: HiOutlineScale,
    instructor: 'Luật sư Phạm Đức Thịnh',
  },
  {
    publicId: 'digital-marketing',
    category: 'marketing',
    title: 'Digital Marketing cho môi giới',
    description:
      'Facebook Ads, Zalo OA, TikTok — vận hành kênh cá nhân, ra lead và chuyển đổi sang tư vấn offline hiệu quả.',
    sessions: 8,
    hours: 16,
    level: 'Trung cấp',
    price: 1790000,
    icon: HiOutlineMegaphone,
    instructor: 'Lê Quốc Bảo',
  },
  {
    publicId: 'crm-pipeline',
    category: 'advanced',
    title: 'Quản trị pipeline & chốt deal',
    description:
      'Thiết lập CRM, phân nhóm khách hàng, đo lường chuyển đổi và các chiến thuật chốt deal cuối tháng.',
    sessions: 6,
    hours: 12,
    level: 'Nâng cao',
    price: 1290000,
    icon: HiOutlineClipboardDocumentCheck,
    instructor: 'Nguyễn Minh Khoa',
  },
  {
    publicId: 'team-management',
    category: 'advanced',
    title: 'Xây dựng team môi giới 5-15 người',
    description:
      'Tuyển dụng, đào tạo nội bộ, đặt KPI, giữ chân nhân sự giỏi và mở rộng quy mô đội nhóm bền vững.',
    sessions: 10,
    hours: 20,
    level: 'Nâng cao',
    price: 2490000,
    icon: HiOutlineUsers,
    instructor: 'Võ Hoàng Nam',
  },
];

// ============================================================================
// Giảng viên (4 mentor)
// ============================================================================

const INSTRUCTORS: TrainingInstructor[] = [
  {
    publicId: 'instructor-khoa',
    avatar: '/images/dao-tao/avatar-1.jpg',
    name: 'Nguyễn Minh Khoa',
    role: 'Giảng viên cao cấp · Nền tảng & CRM',
    experience: '11 năm',
    bio: 'Cựu trưởng phòng kinh doanh Tập đoàn Địa ốc X. Đã đào tạo hơn 1.200 học viên trở thành môi giới chuyên nghiệp.',
    specialties: ['Mô hình môi giới', 'CRM & Pipeline', 'Đàm phán'],
  },
  {
    publicId: 'instructor-ha',
    avatar: '/images/dao-tao/avatar-2.jpg',
    name: 'Trần Thanh Hải',
    role: 'Giảng viên · Bán hàng & Tư vấn',
    experience: '8 năm',
    bio: 'Top 10 môi giới xuất sắc toàn quốc 2023. Chuyên gia xây dựng kịch bản tư vấn cho phân khúc cao cấp.',
    specialties: ['Kịch bản tư vấn', 'Xử lý từ chối', 'Bán hàng cao cấp'],
  },
  {
    publicId: 'instructor-phamha',
    avatar: '/images/dao-tao/avatar-3.jpg',
    name: 'Luật sư Phạm Đức Thịnh',
    role: 'Giảng viên · Pháp lý BĐS',
    experience: '14 năm',
    bio: 'Luật sư chuyên ngành BĐS, từng tư vấn cho hơn 500 giao dịch mua bán và sang tên. Đồng tác giả 2 cuốn sách về pháp lý BĐS.',
    specialties: ['Sổ đỏ - Hợp đồng', 'Công chứng', 'Tranh chấp'],
  },
  {
    publicId: 'instructor-bao',
    avatar: '/images/dao-tao/avatar-4.jpg',
    name: 'Lê Quốc Bảo',
    role: 'Giảng viên · Marketing số',
    experience: '7 năm',
    bio: 'Chuyên gia chạy ads cho ngành BĐS. Đã scale kênh Facebook & TikTok từ 0 lên 50.000 follower trong 14 tháng.',
    specialties: ['Facebook Ads', 'Zalo OA', 'TikTok'],
  },
];

// ============================================================================
// Lịch khai giảng (4 lớp sắp tới)
// ============================================================================

const UPCOMING_SESSIONS: TrainingSession[] = [
  {
    publicId: 'session-001',
    title: 'Nhập môn BĐS cho môi giới',
    startDate: '15/09',
    schedule: 'T2 - T6 | 19:30 - 21:30',
    format: 'Online',
    seats: { remaining: 12, total: 50 },
    price: 0,
  },
  {
    publicId: 'session-002',
    title: 'Xây dựng kịch bản tư vấn 1-1',
    startDate: '22/09',
    schedule: 'T7 - CN | 09:00 - 12:00',
    format: 'Offline',
    location: 'RealtyHub Hub - Quận 1, TP.HCM',
    seats: { remaining: 6, total: 30 },
    price: 1490000,
  },
  {
    publicId: 'session-003',
    title: 'Pháp lý BĐS ứng dụng',
    startDate: '01/10',
    schedule: 'T3 - T5 | 20:00 - 22:00',
    format: 'Online',
    seats: { remaining: 18, total: 60 },
    price: 1990000,
  },
  {
    publicId: 'session-004',
    title: 'Digital Marketing cho môi giới',
    startDate: '08/10',
    schedule: 'T7 | 14:00 - 17:00',
    format: 'Hybrid',
    seats: { remaining: 22, total: 40 },
    price: 1790000,
  },
];

// ============================================================================
// Học viên nói gì (3 testimonials)
// ============================================================================

const TESTIMONIALS: TrainingTestimonial[] = [
  {
    publicId: 'testimonial-001',
    name: 'Đặng Quốc Đạt',
    role: 'Môi giới tự do · Hà Nội',
    quote:
      'Sau khóa "Kịch bản tư vấn" tôi tăng tỷ lệ chốt từ 8% lên 19% chỉ trong 2 tháng. Phần thực hành với tình huống thực tế là điểm mạnh nhất.',
    course: 'Xây dựng kịch bản tư vấn 1-1',
  },
  {
    publicId: 'testimonial-002',
    name: 'Phạm Kiều Trang',
    role: 'Trưởng nhóm · Công ty BĐS Hoàng Gia',
    quote:
      'Khóa "Xây dựng team" giúp tôi thiết kế lại toàn bộ quy trình tuyển dụng và onboarding. Team tôi từ 4 người lên 11 người trong 5 tháng.',
    course: 'Xây dựng team môi giới 5-15 người',
  },
  {
    publicId: 'testimonial-003',
    name: 'Trịnh Bảo Long',
    role: 'Môi giới cao cấp · TP.HCM',
    quote:
      'Phần pháp lý của luật sư Hà cực kỳ thực tế. Tôi đã tránh được một vụ tranh chấp tiền đặt cọc 4 tỷ nhờ phát hiện sai sót trong hợp đồng.',
    course: 'Pháp lý BĐS ứng dụng',
  },
];

// ============================================================================
// Export gộp
// ============================================================================

export const MOCK_TRAINING_CONTENT: TrainingContent = {
  hero: HERO,
  metrics: METRICS,
  levels: LEVELS,
  courses: COURSES,
  instructors: INSTRUCTORS,
  upcomingSessions: UPCOMING_SESSIONS,
  testimonials: TESTIMONIALS,
};

// Icon phu - export rieng de tranh unused warnings khi import sau
export const _trainingIcons = {
  HiOutlineCheckBadge,
  HiOutlineClock,
  HiOutlineCodeBracket,
  HiOutlineCurrencyDollar,
  HiOutlineDocumentText,
  HiOutlineGlobeAlt,
  HiOutlinePresentationChartLine,
  HiOutlineSparkles,
  HiOutlineTrophy,
  HiOutlineVideoCamera,
};