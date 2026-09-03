/**
 * Mock data cho module events.
 *
 * 8 su kien:
 *   - 4 upcoming (workshop / seminar / open-house / webinar)
 *   - 1 ongoing (networking)
 *   - 3 past (da dien ra, cho phep xem lai)
 *
 * Ngay gio seed la 2026-08-09 (hom nay theo timestamp he thong):
 *   - Past: 2026-07-25, 2026-08-01, 2026-08-05
 *   - Ongoing: 2026-08-09 (hom nay, 09:00 - 12:00)
 *   - Upcoming: 2026-08-15, 2026-08-22, 2026-08-29, 2026-09-12
 *
 * Khi co backend: thay bang GET /events -> { items, total }.
 */

import type { EventItem } from '../models/event.model';

const NOW = new Date('2026-08-09T15:00:00.000+07:00');

const iso = (offsetDays: number, hour: number, minute = 0): string => {
  const d = new Date(NOW);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export const MOCK_EVENTS: EventItem[] = [
  // ============ UPCOMING ============
  {
    publicId: 'event-001',
    coverImage: '/images/projects/vinhomes-ocean-park-gia-lam/tien-ich-vincom-mega-mall-dem.jpg',
    slug: 'workshop-thuong-luong-giao-dich-bds',
    title: 'Workshop: Thương lượng giao dịch BĐS chuyên nghiệp',
    excerpt:
      'Thực hành 6 tình huống thương lượng thực tế với chuyên gia 12 năm kinh nghiệm. Áp dụng ngay cho mọi giao dịch căn hộ và đất nền.',
    description:
      'Buổi workshop kéo dài 4 giờ, tập trung vào các kỹ thuật thương lượng từ cơ bản đến nâng cao. Mỗi học viên sẽ được đóng vai cả hai phía trong 6 tình huống thực tế và nhận feedback trực tiếp từ giảng viên.',
    type: 'workshop',
    status: 'upcoming',
    startAt: iso(6, 9, 30), // 2026-08-15 09:30
    endAt: iso(6, 13, 30),
    location: {
      name: 'RealtyHub Hub - Quận 1',
      address: 'Tầng 5, 88 Nguyễn Huệ, Quận 1, TP.HCM',
      isOnline: false,
    },
    capacity: 30,
    registered: 22,
    isFree: false,
    price: 990000,
    speakers: [
      { publicId: 'sp-1', name: 'Nguyễn Minh Khoa', role: 'Giảng viên RealtyHub' },
      { publicId: 'sp-2', name: 'Trần Thanh Hải', role: 'Top 10 Môi giới 2023' },
    ],
    tags: ['Thương lượng', 'Bán hàng', 'Kỹ năng'],
  },
  {
    publicId: 'event-002',
    coverImage: '/images/projects/vinhomes-ocean-park-gia-lam/tien-ich-dai-hoc-vinuni.jpg',
    slug: 'seminar-phap-ly-bds-cap-nhat-2026',
    title: 'Hội thảo: Cập nhật pháp lý BĐS 2026',
    excerpt:
      'Luật sư Phạm Đức Thịnh phân tích 4 thay đổi pháp lý quan trọng nhất năm 2026 ảnh hưởng đến người mua và môi giới.',
    type: 'seminar',
    status: 'upcoming',
    startAt: iso(13, 19, 0), // 2026-08-22 19:00
    endAt: iso(13, 21, 30),
    location: {
      name: 'Online qua Zoom',
      isOnline: true,
      onlineUrl: 'https://zoom.us/j/example',
    },
    capacity: 500,
    registered: 318,
    isFree: true,
    speakers: [
      { publicId: 'sp-3', name: 'Luật sư Phạm Đức Thịnh', role: '14 năm kinh nghiệm BĐS' },
    ],
    tags: ['Pháp lý', 'Sổ đỏ', 'Hợp đồng'],
  },
  {
    publicId: 'event-003',
    coverImage: '/images/projects/vinhomes-ocean-park-gia-lam/sp-cao-tang-ven-kenh.jpg',
    slug: 'open-house-green-harbor-ha-long',
    title: 'Open House: Trải nghiệm căn hộ mẫu Green Harbor Hạ Long',
    excerpt:
      'Tham quan thực tế căn hộ mẫu 2PN và 3PN, nhận ngay ưu đãi 2% cho khách đặt cọc trong ngày tại sự kiện.',
    type: 'open-house',
    status: 'upcoming',
    startAt: iso(20, 14, 0), // 2026-08-29 14:00
    endAt: iso(20, 18, 0),
    location: {
      name: 'Sales Gallery Green Harbor',
      address: 'Đường Bến Đoan, Hạ Long, Quảng Ninh',
      isOnline: false,
    },
    capacity: 100,
    registered: 67,
    isFree: true,
    tags: ['Green Harbor', 'Trải nghiệm', 'Hạ Long'],
  },
  {
    publicId: 'event-004',
    slug: 'webinar-digital-marketing-cho-moi-gioi',
    title: 'Webinar: Digital Marketing cho môi giới - từ 0 đến 100 leads/tháng',
    excerpt:
      'Chuyên gia Lê Quốc Bảo chia sẻ chiến lược Facebook Ads + Zalo OA + TikTok đã scale kênh lên 50K follower trong 14 tháng.',
    type: 'webinar',
    status: 'upcoming',
    startAt: iso(34, 20, 0), // 2026-09-12 20:00
    endAt: iso(34, 22, 0),
    location: {
      name: 'Online qua Zoom',
      isOnline: true,
      onlineUrl: 'https://zoom.us/j/example',
    },
    capacity: 300,
    registered: 145,
    isFree: false,
    price: 199000,
    speakers: [
      { publicId: 'sp-4', name: 'Lê Quốc Bảo', role: 'Chuyên gia Marketing số' },
    ],
    tags: ['Marketing', 'Facebook Ads', 'Zalo OA'],
  },

  // ============ ONGOING ============
  {
    publicId: 'event-005',
    coverImage: '/images/projects/vinhomes-ocean-park-gia-lam/tien-ich-vincom-mega-mall.jpg',
    slug: 'networking-monthly-meetup-thang-8',
    title: 'Monthly Meetup: Gặp gỡ môi giới tháng 8',
    excerpt:
      'Buổi gặp mặt định kỳ tháng 8 của cộng đồng môi giới RealtyHub. Chia sẻ deal, tìm đối tác, networking thư giãn.',
    type: 'networking',
    status: 'ongoing',
    startAt: iso(0, 9, 0), // 2026-08-09 09:00 - hom nay
    endAt: iso(0, 12, 0),
    location: {
      name: 'The Coffee House - Nguyễn Huệ',
      address: 'Số 6 Nguyễn Huệ, Quận 1, TP.HCM',
      isOnline: false,
    },
    capacity: 40,
    registered: 35,
    isFree: true,
    tags: ['Cộng đồng', 'Networking'],
  },

  // ============ PAST ============
  {
    publicId: 'event-006',
    coverImage: '/images/projects/vinhomes-ocean-park-gia-lam/tien-ich-vinuni-chinh-dien.jpg',
    slug: 'workshop-crm-pipeline-thang-7',
    title: 'Workshop: Thiết lập CRM & Pipeline chuyên nghiệp',
    excerpt:
      'Buổi workshop thực chiến về CRM và pipeline đã diễn ra vào cuối tháng 7, có 28/30 học viên hoàn thành khóa học.',
    type: 'workshop',
    status: 'past',
    startAt: iso(-15, 14, 0), // 2026-07-25
    endAt: iso(-15, 17, 0),
    location: {
      name: 'RealtyHub Hub - Quận 1',
      address: 'Tầng 5, 88 Nguyễn Huệ, Quận 1, TP.HCM',
      isOnline: false,
    },
    capacity: 30,
    registered: 28,
    isFree: false,
    price: 890000,
    speakers: [
      { publicId: 'sp-1', name: 'Nguyễn Minh Khoa', role: 'Giảng viên RealtyHub' },
    ],
    tags: ['CRM', 'Pipeline'],
  },
  {
    publicId: 'event-007',
    coverImage: '/images/projects/vinhomes-ocean-park-gia-lam/hero-3-phoi-canh-tong-the.jpg',
    slug: 'seminar-thi-truong-bds-nua-dau-nam-2026',
    title: 'Hội thảo: Toàn cảnh thị trường BĐS nửa đầu năm 2026',
    excerpt:
      'Tổng kết 6 tháng đầu năm với số liệu từ 12 sàn lớn, cập nhật xu hướng giá, nguồn cung và chính sách mới.',
    type: 'seminar',
    status: 'past',
    startAt: iso(-8, 19, 0), // 2026-08-01
    endAt: iso(-8, 21, 0),
    location: {
      name: 'Online qua Zoom',
      isOnline: true,
      onlineUrl: 'https://zoom.us/j/example',
    },
    capacity: 500,
    registered: 412,
    isFree: true,
    tags: ['Thị trường', 'Phân tích'],
  },
  {
    publicId: 'event-008',
    slug: 'webinar-xay-dung-team-5-15-nguoi',
    title: 'Webinar: Xây dựng team môi giới 5-15 người',
    excerpt:
      'Võ Hoàng Nam chia sẻ quy trình scale team từ 4 lên 11 người trong 5 tháng. Đã có 280 môi giới tham dự.',
    type: 'webinar',
    status: 'past',
    startAt: iso(-4, 20, 0), // 2026-08-05
    endAt: iso(-4, 22, 0),
    location: {
      name: 'Online qua Zoom',
      isOnline: true,
      onlineUrl: 'https://zoom.us/j/example',
    },
    capacity: 300,
    registered: 280,
    isFree: false,
    price: 199000,
    speakers: [
      { publicId: 'sp-5', name: 'Võ Hoàng Nam', role: 'Founder Team Building' },
    ],
    tags: ['Quản lý', 'Team building'],
  },
];