/**
 * Mock data cho trang /tai-khoan. Trang nay can 1 user cung de demo UI
 * cac section (dong tot, tien ich, dich vu tra phi, khuyen mai). Sau
 * nay noi backend that, doi `MOCK_PROFILE` thanh goi /users/me.
 */

import type { ComponentType } from 'react';
import {
  FiBookmark,
  FiClock,
  FiCreditCard,
  FiGift,
  FiHelpCircle,
  FiLogOut,
  FiMessageSquare,
  FiPackage,
  FiPercent,
  FiSearch,
  FiSettings,
  FiShoppingBag,
  FiStar,
  FiTag,
  FiTrendingUp,
  FiUserCheck,
} from 'react-icons/fi';

export type ProfileStat = {
  /** Key de map icon (xem STAT_ICONS trong ProfileCard). */
  key: 'followers' | 'following' | 'joined';
  label: string;
  value: number;
};

export type BadgeVariant = 'new' | 'gold' | 'pro';

export type MenuItem = {
  /** Href tuyet doi (next/link). Neu undefined -> placeholder, click khong di dau. */
  href?: string;
  /** Icon component tu react-icons/fi (Feather). Chuyen nghiep hon emoji. */
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
  /** Mau nen cho icon tile: 'brand' | 'navy' | 'warning' | 'success' | 'gray' | 'accent'. */
  tone: 'brand' | 'navy' | 'warning' | 'success' | 'gray' | 'accent';
  label: string;
  /** Mo ta ngan duoi label (optional, de lam sub-text). */
  description?: string;
  badge?: { text: string; variant: BadgeVariant };
};

export type Profile = {
  /** URL slug (khoang trang -> '-', bo dau). Dung cho trang public
      /ho-so/[slug]. */
  slug: string;
  name: string;
  email: string;
  /** Chu cai hien thi khi khong co avatar that. */
  initials: string;
  /** URL avatar that, neu co. Trong mock hien khong co nen se fallback initials. */
  avatar?: string;
  /** So nguoi theo doi (chi so public, khac stats private trong /tai-khoan). */
  followers: number;
  /** Chuoi hien thi "Da tham gia X thang Y ngay". */
  joinedAt: string;
  /** Dia chi dang hien thi (Quan, TP). */
  location: string;
  stats: ProfileStat[];
  wallet: {
    /** So dong tot dang co. */
    balance: number;
    /** Ten hien thi tren card. */
    title: string;
    /** Mo ta ngan duoi balance. */
    subtitle: string;
  };
  utilities: MenuItem[];
  paidServices: MenuItem[];
  promotions: MenuItem[];
  others: MenuItem[];
};

export const MOCK_PROFILE: Profile = {
  slug: 'nguyen-gia-khang',
  name: 'Nguyễn Gia Khang',
  email: 'khang.nguyen@realtyhub.vn',
  initials: 'NK',
  // Mock chua co file avatar that - de undefined de UserAvatar fallback
  // sang gradient + initials "NK". Khi nao co file that, set URL o day.
  avatar: undefined,
  followers: 0,
  joinedAt: 'Đã tham gia 2 tháng 30 ngày',
  location: 'Quận Tân Phú, TP.HCM',
  stats: [
    { key: 'followers', label: 'Người theo dõi', value: 12 },
    { key: 'following', label: 'Đang theo dõi', value: 4 },
    { key: 'joined', label: 'Tin đã đăng', value: 8 },
  ],
  wallet: {
    title: 'Tài khoản Định danh',
    balance: 1250,
    subtitle: 'Đồng Tốt là đơn vị dùng để đăng tin nổi bật, tạo chuyên trang.',
  },
  // "Tien ich": cac trang quan ly noi dung cua toi
  utilities: [
    {
      icon: FiBookmark,
      tone: 'brand',
      label: 'Tin đã lưu',
      description: 'Danh sách các dự án bạn đã thêm vào bộ sưu tập',
      href: '/tai-khoan/tin-da-luu',
    },
    {
      icon: FiSearch,
      tone: 'brand',
      label: 'Tìm kiếm đã lưu',
      description: 'Các bộ lọc và gợi ý bạn đã lưu để xem lại',
      href: '/tai-khoan/tim-kiem-da-luu',
    },
    {
      icon: FiClock,
      tone: 'gray',
      label: 'Lịch sử xem tin',
      description: 'Hoạt động xem dự án trong 30 ngày gần nhất',
      href: '/tai-khoan/lich-su',
    },
    {
      icon: FiStar,
      tone: 'warning',
      label: 'Đánh giá từ tôi',
      description: 'Những đánh giá bạn đã viết về các dự án',
      href: '/tai-khoan/danh-gia',
    },
    {
      icon: FiTrendingUp,
      tone: 'success',
      label: 'Đánh giá khu vực',
      description: 'Theo dõi biến động giá và xu hướng khu vực bạn quan tâm',
      href: '/tai-khoan/danh-gia-khu-vuc',
      badge: { text: 'Mới', variant: 'new' },
    },
  ],
  // "Dich vu tra phi": cac goi tang kha nang tiep can
  paidServices: [
    {
      icon: FiPackage,
      tone: 'warning',
      label: 'Đồng Tốt',
      description: 'Đơn vị để đăng tin nổi bật và tạo chuyên trang',
      href: '/tai-khoan/dong-tot',
    },
    {
      icon: FiUserCheck,
      tone: 'navy',
      label: 'Gói PRO',
      description: 'Ưu tiên hiển thị, huy hiệu PRO, hỗ trợ riêng',
      href: '/tai-khoan/goi-pro',
      badge: { text: 'PRO', variant: 'pro' },
    },
    {
      icon: FiShoppingBag,
      tone: 'success',
      label: 'Kênh Đối Tác',
      description: 'Hợp tác cùng dự án và nhận hoa hồng giới thiệu',
      href: '/tai-khoan/kenh-doi-tac',
    },
    {
      icon: FiCreditCard,
      tone: 'gray',
      label: 'Lịch sử giao dịch',
      description: 'Hóa đơn, biên nhận và trạng thái thanh toán',
      href: '/tai-khoan/giao-dich',
    },
    {
      icon: FiMessageSquare,
      tone: 'brand',
      label: 'Cửa hàng / Chuyên trang của tôi',
      description: 'Tạo trang riêng để showcase dự án của bạn',
      href: '/tai-khoan/chuyen-trang',
      badge: { text: 'Tạo ngay', variant: 'gold' },
    },
  ],
  // "Uu dai, khuyen mai": marketing cho user
  promotions: [
    {
      icon: FiGift,
      tone: 'warning',
      label: 'RealtyHub ưu đãi',
      description: 'Chương trình khuyến mãi đang diễn ra',
      href: '/uu-dai',
    },
    {
      icon: FiTag,
      tone: 'brand',
      label: 'Ưu đãi của tôi',
      description: 'Voucher và mã giảm giá đã lưu',
      href: '/tai-khoan/uu-dai-cua-toi',
    },
  ],
  // "Khac": cai dat + tro giup + dang xuat
  others: [
    {
      icon: FiSettings,
      tone: 'gray',
      label: 'Cài đặt tài khoản',
      description: 'Thông tin cá nhân, bảo mật, thông báo',
      href: '/cai-dat',
    },
    {
      icon: FiHelpCircle,
      tone: 'brand',
      label: 'Trợ giúp',
      description: 'Hướng dẫn sử dụng và câu hỏi thường gặp',
      href: '/tro-giup',
    },
    {
      icon: FiPercent,
      tone: 'success',
      label: 'Đóng góp ý kiến',
      description: 'Gửi phản hồi để chúng tôi cải thiện sản phẩm',
      href: '/dong-gop-y-kien',
    },
    {
      icon: FiLogOut,
      tone: 'gray',
      label: 'Đăng xuất',
      description: 'Đăng xuất khỏi tài khoản trên thiết bị này',
      href: '/dang-xuat',
    },
  ],
};