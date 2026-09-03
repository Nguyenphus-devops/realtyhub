/**
 * Mock data cho trang /tinh-nang (Tính năng phần mềm).
 *
 * Phan loai thanh 8 nhom chinh (cong cum chuc nang). Moi nhom chua 6-10
 * tinh nang con. Trang /tinh-nang hien thi grid theo nhom, moi feature co
 * icon + ten + 1 dong mo ta.
 *
 * Cam hung: bang features cua Linear / Notion / Vercel - clean grid, de scan.
 *
 * Khi co backend: thay bang GET /features -> cung shape.
 */

import type { ComponentType } from 'react';

import {
  HiOutlineAcademicCap,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineArchiveBox,
  HiOutlineBanknotes,
  HiOutlineBellAlert,
  HiOutlineBuildingOffice2,
  HiOutlineCalculator,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCheckBadge,
  HiOutlineClipboardDocumentCheck,
  HiOutlineClock,
  HiOutlineCloud,
  HiOutlineCog6Tooth,
  HiOutlineCube,
  HiOutlineCurrencyDollar,
  HiOutlineDocument,
  HiOutlineDocumentChartBar,
  HiOutlineDocumentDuplicate,
  HiOutlineFilm,
  HiOutlineFingerPrint,
  HiOutlineGlobeAlt,
  HiOutlineHomeModern,
  HiOutlineKey,
  HiOutlineLightBulb,
  HiOutlineLink,
  HiOutlineMap,
  HiOutlineMapPin,
  HiOutlineMegaphone,
  HiOutlineMoon,
  HiOutlineNewspaper,
  HiOutlinePaintBrush,
  HiOutlinePencilSquare,
  HiOutlinePhone,
  HiOutlinePresentationChartLine,
  HiOutlineQrCode,
  HiOutlineQuestionMarkCircle,
  HiOutlineScale,
  HiOutlineShare,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineSquares2X2,
  HiOutlineStar,
  HiOutlineTag,
  HiOutlineTrophy,
  HiOutlineUserGroup,
  HiOutlineVideoCamera,
  HiOutlineWrenchScrewdriver,
} from 'react-icons/hi2';

export type FeatureItem = {
  publicId: string;
  /** Ten tinh nang (VD: "Tinh khoan vay") */
  label: string;
  /** Mo ta 1 dong */
  description: string;
  icon: ComponentType<{ 'aria-hidden'?: boolean; className?: string }>;
};

export type FeatureGroup = {
  publicId: string;
  /** Ten nhom (VD: "Tim kiem & Kham pha") */
  title: string;
  /** Mo ta 1 dong cho nhom */
  subtitle: string;
  /** Eyebrow hien thi phia tren title (VD: "01") */
  eyebrow: string;
  icon: ComponentType<{ 'aria-hidden'?: boolean; className?: string }>;
  features: FeatureItem[];
};

export const MOCK_FEATURE_GROUPS: FeatureGroup[] = [
  {
    publicId: 'group-discovery',
    eyebrow: '01',
    title: 'Tìm kiếm & Khám phá',
    subtitle: 'Bộ lọc thông minh giúp bạn tìm dự án phù hợp trong vài giây',
    icon: HiOutlineMap,
    features: [
      {
        publicId: 'f-search-projects',
        label: 'Tìm kiếm dự án',
        description: 'Bộ lọc 12 tiêu chí: vị trí, giá, diện tích, pháp lý, tiện ích.',
        icon: HiOutlineMap,
      },
      {
        publicId: 'f-search-map',
        label: 'Tìm trên bản đồ',
        description: 'Bản đồ tương tác, vẽ vùng tìm kiếm, xem giá theo khu vực.',
        icon: HiOutlineGlobeAlt,
      },
      {
        publicId: 'f-compare',
        label: 'So sánh căn hộ',
        description: 'Đặt cùng lúc 4 căn lên bàn cân, so sánh đầy đủ tiêu chí.',
        icon: HiOutlineScale,
      },
      {
        publicId: 'f-saved',
        label: 'Lưu & yêu thích',
        description: 'Bookmark dự án và căn hộ, nhận thông báo khi có thay đổi giá.',
        icon: HiOutlineStar,
      },
      {
        publicId: 'f-recommend',
        label: 'Gợi ý cá nhân hoá',
        description: 'AI đề xuất dự án phù hợp nhu cầu, ngân sách, khu vực của bạn.',
        icon: HiOutlineSparkles,
      },
      {
        publicId: 'f-history',
        label: 'Lịch sử xem',
        description: 'Theo dõi các dự án đã xem, quay lại đúng chỗ đang xem dở.',
        icon: HiOutlineClock,
      },
    ],
  },

  {
    publicId: 'group-consulting',
    eyebrow: '02',
    title: 'Tư vấn & Giao dịch',
    subtitle: 'Bộ công cụ bán hàng chuyên nghiệp cho môi giới',
    icon: HiOutlineMegaphone,
    features: [
      {
        publicId: 'f-loan',
        label: 'Tính khoản vay',
        description: 'Tính số tiền vay, lãi suất, kỳ hạn theo 30+ ngân hàng.',
        icon: HiOutlineBanknotes,
      },
      {
        publicId: 'f-phiếu-tu-van',
        label: 'Tạo phiếu tư vấn',
        description: 'Tạo phiếu tư vấn PDF gửi khách qua Zalo / email.',
        icon: HiOutlineClipboardDocumentCheck,
      },
      {
        publicId: 'f-hoa-hong',
        label: 'Tra cứu hoa hồng',
        description: 'Xem hoa hồng theo dự án, chủ đầu tư, thời điểm.',
        icon: HiOutlineCurrencyDollar,
      },
      {
        publicId: 'f-lock',
        label: 'Lock căn',
        description: 'Giữ chỗ căn hộ trong 48h để tư vấn khách rõ ràng hơn.',
        icon: HiOutlineKey,
      },
      {
        publicId: 'f-docs',
        label: 'Tài liệu bán hàng',
        description: 'Brochure, bảng giá, mặt bằng, hợp đồng mẫu từ chủ đầu tư.',
        icon: HiOutlineDocumentDuplicate,
      },
      {
        publicId: 'f-video-sales',
        label: 'Video bán hàng',
        description: 'Video nhà mẫu, flycam, animation từ chủ đầu tư.',
        icon: HiOutlineVideoCamera,
      },
      {
        publicId: 'f-lich-hen',
        label: 'Lịch hẹn tự động',
        description: 'Booking lịch hẹn trực tuyến, nhắc nhở qua SMS / Zalo.',
        icon: HiOutlineCalendarDays,
      },
      {
        publicId: 'f-chat',
        label: 'Chat với khách hàng',
        description: 'Hội thoại tích hợp, lưu lịch sử theo từng khách.',
        icon: HiOutlineChatBubbleLeftRight,
      },
    ],
  },

  {
    publicId: 'group-fengshui',
    eyebrow: '03',
    title: 'Phong thủy & Tâm linh',
    subtitle: 'Tra cứu phong thủy truyền thống kết hợp công nghệ hiện đại',
    icon: HiOutlineMoon,
    features: [
      {
        publicId: 'f-lich-am',
        label: 'Lịch âm Việt Nam',
        description: 'Lịch âm, can chi, ngày tốt xấu, giờ hoàng đạo.',
        icon: HiOutlineMoon,
      },
      {
        publicId: 'f-la-ban',
        label: 'La bàn phong thủy',
        description: 'La bàn số kết hợp định vị, xác định hướng nhà theo tuổi.',
        icon: HiOutlineMapPin,
      },
      {
        publicId: 'f-huong-can',
        label: 'Xem hướng căn theo tuổi',
        description: 'Tìm hướng cửa chính, ban thờ phù hợp với tuổi gia chủ.',
        icon: HiOutlineMap,
      },
      {
        publicId: 'f-tuoi-mua-nha',
        label: 'Xem tuổi mua nhà',
        description: 'Năm nào hợp tuổi để mua nhà, ký hợp đồng, nhận nhà.',
        icon: HiOutlineCalendarDays,
      },
      {
        publicId: 'f-tuoi-xay-nha',
        label: 'Xem tuổi xây nhà',
        description: 'Năm nào hợp tuổi để khởi công, động thổ xây dựng.',
        icon: HiOutlineHomeModern,
      },
      {
        publicId: 'f-ngay-tot',
        label: 'Ngày tốt xem nhà',
        description: 'Tra cứu ngày giờ hoàng đạo đi xem nhà, ký cọc, nhập trạch.',
        icon: HiOutlineCheckBadge,
      },
      {
        publicId: 'f-goi-y-tang',
        label: 'Gợi ý tầng / hướng / vị trí căn',
        description: 'AI gợi ý tầng, hướng ban công, vị trí căn hộ hợp tuổi.',
        icon: HiOutlineLightBulb,
      },
    ],
  },

  {
    publicId: 'group-design',
    eyebrow: '04',
    title: 'Thiết kế & Nội thất',
    subtitle: 'Trợ lý AI thiết kế nội thất cho căn hộ mơ ước',
    icon: HiOutlinePaintBrush,
    features: [
      {
        publicId: 'f-design-ai',
        label: 'AI thiết kế nội thất',
        description: 'Nhập mô tả, AI tạo ảnh 3D phối cảnh căn hộ.',
        icon: HiOutlineSparkles,
      },
      {
        publicId: 'f-design-template',
        label: 'Mẫu nội thất tham khảo',
        description: '1000+ mẫu thiết kế: Bắc Âu, Nhật, Vintage, Luxury.',
        icon: HiOutlineSquares2X2,
      },
      {
        publicId: 'f-design-cost',
        label: 'Ước tính chi phí',
        description: 'Tính chi phí nội thất theo diện tích và phong cách.',
        icon: HiOutlineCalculator,
      },
      {
        publicId: 'f-design-layout',
        label: 'Bố trí công năng',
        description: 'Bố trí phòng khách, bếp, ngủ tối ưu diện tích căn hộ.',
        icon: HiOutlineAdjustmentsHorizontal,
      },
      {
        publicId: 'f-design-materials',
        label: 'Vật liệu & thiết bị',
        description: 'Catalogue gạch, sơn, đèn, nội thất từ nhà cung cấp uy tín.',
        icon: HiOutlineCube,
      },
      {
        publicId: 'f-design-contractor',
        label: 'Nhà thầu thi công',
        description: 'Danh sách nhà thầu uy tín, đánh giá từ khách hàng thật.',
        icon: HiOutlineWrenchScrewdriver,
      },
    ],
  },

  {
    publicId: 'group-training',
    eyebrow: '05',
    title: 'Đào tạo & Phát triển',
    subtitle: 'Nâng cao kỹ năng bán hàng và kiến thức dự án',
    icon: HiOutlineAcademicCap,
    features: [
      {
        publicId: 'f-train-project',
        label: 'Đào tạo dự án',
        description: 'Tài liệu, video chi tiết từng dự án đang mở bán.',
        icon: HiOutlineBuildingOffice2,
      },
      {
        publicId: 'f-train-sales',
        label: 'Kỹ năng sale',
        description: 'Khóa học kỹ năng bán hàng từ cơ bản đến nâng cao.',
        icon: HiOutlineChartBar,
      },
      {
        publicId: 'f-train-script',
        label: 'Kịch bản tư vấn',
        description: 'Mẫu kịch bản theo từng phân khúc khách hàng.',
        icon: HiOutlineChatBubbleLeftRight,
      },
      {
        publicId: 'f-train-faq',
        label: 'Câu hỏi thường gặp',
        description: 'Bộ FAQ + cách trả lời chuyên nghiệp cho môi giới.',
        icon: HiOutlineQuestionMarkCircle,
      },
      {
        publicId: 'f-train-quiz',
        label: 'Kiểm tra kiến thức',
        description: 'Bài test kiến thức, cấp chứng chỉ nội bộ.',
        icon: HiOutlineClipboardDocumentCheck,
      },
      {
        publicId: 'f-train-video',
        label: 'Video đào tạo',
        description: 'Thư viện video từ chuyên gia bất động sản trong nước.',
        icon: HiOutlineFilm,
      },
      {
        publicId: 'f-train-doc',
        label: 'Tài liệu đào tạo',
        description: 'Slide, ebook, checklist đào tạo dự án và bán hàng.',
        icon: HiOutlineDocumentChartBar,
      },
      {
        publicId: 'f-train-news',
        label: 'Tin tức & Cập nhật',
        description: 'Tin tức thị trường, chính sách mới, sự kiện ngành.',
        icon: HiOutlineNewspaper,
      },
    ],
  },

  {
    publicId: 'group-crm',
    eyebrow: '06',
    title: 'CRM & Tự động hoá',
    subtitle: 'Quản lý khách hàng và chăm sóc tự động cho môi giới',
    icon: HiOutlineUserGroup,
    features: [
      {
        publicId: 'f-crm-customers',
        label: 'Quản lý khách hàng',
        description: 'Lưu thông tin, lịch sử liên hệ, gắn nhãn khách hàng.',
        icon: HiOutlineUserGroup,
      },
      {
        publicId: 'f-crm-deal',
        label: 'Quản lý deal pipeline',
        description: 'Kanban board theo dõi deal theo giai đoạn tư vấn.',
        icon: HiOutlinePresentationChartLine,
      },
      {
        publicId: 'f-crm-tag',
        label: 'Nhãn khách hàng',
        description: 'Gắn nhãn VIP, tiềm năng, follow-up để phân nhóm dễ.',
        icon: HiOutlineTag,
      },
      {
        publicId: 'f-crm-automation',
        label: 'Chăm sóc tự động',
        description: 'Auto nhắc lịch hẹn, gửi tin nhắn chăm sóc theo lịch.',
        icon: HiOutlineBellAlert,
      },
      {
        publicId: 'f-crm-stat',
        label: 'Thống kê hiệu suất',
        description: 'Thống kê doanh số, tỷ lệ chuyển đổi, hiệu suất cá nhân.',
        icon: HiOutlineChartBar,
      },
      {
        publicId: 'f-crm-ranking',
        label: 'Bảng xếp hạng',
        description: 'Ranking môi giới theo doanh số, đánh giá, hoạt động.',
        icon: HiOutlineTrophy,
      },
    ],
  },

  {
    publicId: 'group-legal',
    eyebrow: '07',
    title: 'Pháp lý & Quy hoạch',
    subtitle: 'Tra cứu pháp lý dự án và quy hoạch đô thị đáng tin cậy',
    icon: HiOutlineScale,
    features: [
      {
        publicId: 'f-legal-project',
        label: 'Pháp lý dự án',
        description: 'Giấy phép xây dựng, phê duyệt, quyết định giao đất.',
        icon: HiOutlineDocument,
      },
      {
        publicId: 'f-legal-unit',
        label: 'Pháp lý căn hộ',
        description: 'Sổ hồng, sổ đỏ, hợp đồng mua bán, thế chấp căn hộ.',
        icon: HiOutlineDocumentDuplicate,
      },
      {
        publicId: 'f-legal-planning',
        label: 'Tra cứu quy hoạch',
        description: 'Bản đồ quy hoạch tỉnh, quận, khu đô thị chi tiết.',
        icon: HiOutlineMap,
      },
      {
        publicId: 'f-legal-check',
        label: 'Kiểm tra quy hoạch',
        description: 'Kiểm tra thửa đất có thuộc quy hoạch hay dự án treo.',
        icon: HiOutlineCheckBadge,
      },
      {
        publicId: 'f-legal-risk',
        label: 'Cảnh báo rủi ro',
        description: 'Cảnh báo dự án đang bị đình chỉ, chủ đầu tư nợ xấu.',
        icon: HiOutlineShieldCheck,
      },
    ],
  },

  {
    publicId: 'group-tools',
    eyebrow: '08',
    title: 'Công cụ & Tiện ích',
    subtitle: 'Bộ công cụ nhỏ hữu ích cho công việc hằng ngày',
    icon: HiOutlineWrenchScrewdriver,
    features: [
      {
        publicId: 'f-tool-pdf',
        label: 'PDF Converter',
        description: 'Chuyển PDF ↔ Word / Excel / PPT / JPG, xử lý hàng loạt.',
        icon: HiOutlineDocument,
      },
      {
        publicId: 'f-tool-scan',
        label: 'PDF Scanner',
        description: 'Quét tài liệu bằng camera thành PDF sắc nét.',
        icon: HiOutlineFingerPrint,
      },
      {
        publicId: 'f-tool-watermark',
        label: 'Watermark',
        description: 'Thêm watermark bản quyền lên ảnh và PDF.',
        icon: HiOutlineShieldCheck,
      },
      {
        publicId: 'f-tool-share',
        label: 'Chia sẻ nhanh',
        description: 'Tạo link chia sẻ nhanh qua Zalo, Messenger, Email.',
        icon: HiOutlineShare,
      },
      {
        publicId: 'f-tool-qr',
        label: 'Quét mã QR',
        description: 'Quét QR từ camera để mở nhanh link dự án, tài liệu.',
        icon: HiOutlineQrCode,
      },
      {
        publicId: 'f-tool-cloud',
        label: 'Lưu trữ đám mây',
        description: 'Lưu tài liệu, ảnh, video lên cloud cá nhân an toàn.',
        icon: HiOutlineCloud,
      },
      {
        publicId: 'f-tool-calc',
        label: 'Máy tính BĐS',
        description: 'Máy tính cơ bản + máy tính lãi vay, diện tích, hoa hồng.',
        icon: HiOutlineCalculator,
      },
      {
        publicId: 'f-tool-currency',
        label: 'Tỷ giá - Lãi suất',
        description: 'Tra cứu tỷ giá ngoại tệ, lãi suất ngân hàng mới nhất.',
        icon: HiOutlineCurrencyDollar,
      },
      {
        publicId: 'f-tool-note',
        label: 'Ghi chú nhanh',
        description: 'Ghi chú nhanh về khách hàng, dự án, công việc trong ngày.',
        icon: HiOutlinePencilSquare,
      },
      {
        publicId: 'f-tool-shortlink',
        label: 'Rút gọn link',
        description: 'Tạo link rút gọn chia sẻ dự án, theo dõi lượt click.',
        icon: HiOutlineLink,
      },
    ],
  },

  {
    publicId: 'group-platform',
    eyebrow: '09',
    title: 'Hệ thống & Bảo mật',
    subtitle: 'Nền tảng ổn định, bảo mật cao, hỗ trợ 24/7',
    icon: HiOutlineShieldCheck,
    features: [
      {
        publicId: 'f-plat-2fa',
        label: 'Bảo mật 2 lớp',
        description: '2FA qua SMS / Authenticator cho tài khoản cá nhân.',
        icon: HiOutlineShieldCheck,
      },
      {
        publicId: 'f-plat-mobile',
        label: 'Responsive mobile',
        description: 'Giao diện tối ưu cho mobile, tablet và desktop.',
        icon: HiOutlinePhone,
      },
      {
        publicId: 'f-plat-backup',
        label: 'Sao lưu tự động',
        description: 'Backup dữ liệu hằng ngày, khôi phục trong 24h.',
        icon: HiOutlineArchiveBox,
      },
      {
        publicId: 'f-plat-support',
        label: 'Hỗ trợ 24/7',
        description: 'Hotline, chat trực tuyến, ticket hỗ trợ 24/7.',
        icon: HiOutlinePhone,
      },
      {
        publicId: 'f-plat-settings',
        label: 'Cài đặt cá nhân',
        description: 'Tùy chỉnh thông báo, ngôn ngữ, giao diện, quyền riêng tư.',
        icon: HiOutlineCog6Tooth,
      },
    ],
  },
];