/**
 * Mock data cho module events - bo sung schema day du cho trang chi tiet.
 *
 * Schema (mock = se thay bang API that):
 *   {
 *     publicId, slug, title, excerpt, description,
 *     type, status, startAt, endAt,
 *     location { name, address, isOnline, onlineUrl },
 *     organizer, capacity, registered, registrationCount, checkinCount,
 *     isFree, price, speakers[], tags[],
 *     coverImage, invitationImage, checkinQr,
 *     documents[], isRegistrationOpen
 *   }
 *
 * Chu de 100% moi gioi bat dong san (ty le goi y):
 *   - 40% dao tao / nang cao ky nang moi gioi
 *   - 30% kickoff / ra mat du an
 *   - 20% cap nhat thi truong / san pham / chinh sach
 *   - 10% networking / hoi thao sales
 *
 * 10 su kien, status da du:
 *   - 5 upcoming (trong tuong lai)
 *   - 1 ongoing (dang dien ra)
 *   - 1 full (da day)
 *   - 3 past (da ket thuc)
 *
 * QR check-in duoc mock bang SVG QR noi dung "REALTYHUB-EVENT-<id>" - moi
 * event co mot ma rieng (can lam that khi co backend).
 *
 * Anh:
 *   - coverImage: anh du an that tu /images/projects/* (kickoff) hoac
 *     placeholder gradient (dao tao / seminar).
 *   - invitationImage: dung lai coverImage de khong bi broken image; detail
 *     page render object-contain, khong crop thiệp.
 *   - checkinQr: SVG QR inline, rieng cho moi event.
 *
 * Khi co backend: thay bang GET /events -> PaginatedEvent { items, total }.
 * Cac field moi (organizer, registrationCount, checkinCount, invitationImage,
 * checkinQr, documents, isRegistrationOpen) deu optional nen cac trang khac
 * (EventsSection, EventsListPage) khong can sua code.
 */

import type { EventItem } from '../models/event.model';

/** Ngay "hom nay" gia dinh trong he thong (seed mock). */
const NOW = new Date('2026-08-09T15:00:00.000+07:00');

const iso = (offsetDays: number, hour: number, minute = 0): string => {
  const d = new Date(NOW);
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

// ============================================================================
// QR check-in (mock)
// ============================================================================
//
// Trong thuc te, backend se tao QR PNG/SVG cho moi event (JWT sign + expiry).
// Mock: tao SVG QR noi dung "REALTYHUB-EVENT-<id>" voi pattern don gian
// (deterministic) - moi event co mot QR rieng de test UI.

const makeQrSvg = (eventId: string): string => {
  // 25x25 module pattern, mot cell don gian cho moi vi tri hash(eventId)
  const size = 25;
  const cells: string[] = [];

  // Simple deterministic hash -> 0/1
  const bit = (x: number, y: number): number => {
    const h = ((x * 73856093) ^ (y * 19349663) ^ eventId.charCodeAt(0) * 83492791) >>> 0;
    return h & 1;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      // Finder pattern (3 o goc)
      const inFinder =
        (x < 7 && y < 7) ||
        (x >= size - 7 && y < 7) ||
        (x < 7 && y >= size - 7);
      if (inFinder) {
        const lx = x < 7 ? x : x - (size - 7);
        const ly = y < 7 ? y : y - (size - 7);
        const outer = lx === 0 || lx === 6 || ly === 0 || ly === 6;
        const inner = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
        if (outer || inner) cells.push('1');
        else cells.push('0');
      } else if (bit(x, y)) {
        cells.push('1');
      } else {
        cells.push('0');
      }
    }
  }

  // Build SVG (mau den tren nen trang)
  const cell = 8; // px
  const total = size * cell;
  let rects = '';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (cells[y * size + x] === '1') {
        rects += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}"/>`;
      }
    }
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" width="${total}" height="${total}">` +
    `<rect width="${total}" height="${total}" fill="#ffffff"/>` +
    `<g fill="#0f172a">${rects}</g>` +
    `</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// ============================================================================
// Documents mock - giu cho moi event 1-3 file
// ============================================================================

const docsDaoTao = (eventId: string) => [
  {
    name: 'Slide bài giảng đào tạo.pdf',
    url: `/mock/documents/${eventId}-slide.pdf`,
    type: 'pdf',
    size: 4_200_000,
  },
  {
    name: 'Checklist kịch bản tư vấn.xlsx',
    url: `/mock/documents/${eventId}-checklist.xlsx`,
    type: 'xlsx',
    size: 180_000,
  },
  {
    name: 'Mẫu CRM pipeline.xlsx',
    url: `/mock/documents/${eventId}-crm.xlsx`,
    type: 'xlsx',
    size: 95_000,
  },
];

const docsKickoff = (eventId: string, project: string) => [
  {
    name: `Bảng giá & chính sách bán hàng ${project}.pdf`,
    url: `/mock/documents/${eventId}-pricing.pdf`,
    type: 'pdf',
    size: 2_100_000,
  },
  {
    name: `Mặt bằng tổng thể ${project}.pdf`,
    url: `/mock/documents/${eventId}-matbang.pdf`,
    type: 'pdf',
    size: 6_800_000,
  },
  {
    name: 'Bộ tài liệu training sales.pptx',
    url: `/mock/documents/${eventId}-training.pptx`,
    type: 'pptx',
    size: 12_300_000,
  },
];

const docsSeminar = (eventId: string) => [
  {
    name: 'Báo cáo phân tích thị trường Q2-2026.pdf',
    url: `/mock/documents/${eventId}-market-report.pdf`,
    type: 'pdf',
    size: 8_400_000,
  },
  {
    name: 'Tổng hợp chính sách mới 2026.pdf',
    url: `/mock/documents/${eventId}-policy.pdf`,
    type: 'pdf',
    size: 1_200_000,
  },
];

const docsNetworking = (eventId: string) => [
  {
    name: 'Danh sách đối tác & môi giới.xlsx',
    url: `/mock/documents/${eventId}-contacts.xlsx`,
    type: 'xlsx',
    size: 320_000,
  },
];

// ============================================================================
// Source-of-truth data (10 events)
// ============================================================================
//
// status trong mock de UI render cho moi state. Tinh toan status dong khi can
// (computeStatus), nhung mock 'status' gia dinh de hien thi nhan trong list.

export const MOCK_EVENTS: EventItem[] = [
  // ---------- KICKOFF DỰ ÁN (30%) — 3 events ----------
  {
    publicId: 'event-001',
    slug: 'kickoff-vinhomes-ocean-park-gia-doan-3',
    title: 'KICKOFF DỰ ÁN VINHOMES OCEAN PARK - GIAI ĐOẠN 3',
    excerpt:
      'Ra mắt giai đoạn 3 với 1.200 căn shophouse và liền kề view kênh đào. Cập nhật chính sách bán hàng, bảng giá mới nhất và ưu đãi dành riêng cho sales team.',
    description:
      'Chương trình kickoff chính thức cho giai đoạn 3 Vinhomes Ocean Park. Ban lãnh đạo Vinhomes trực tiếp công bố chính sách giá, tiến độ thi công và cơ chế hoa hồng đặc biệt dành cho môi giới tham gia đợt mở bán đầu tiên. Nội dung gồm: (1) Phân tích quy hoạch kênh đào và view đắc địa, (2) Cập nhật tiến độ thi công và ngày bàn giao dự kiến, (3) Bảng giá & chính sách chiết khấu theo đợt, (4) Cơ chế thưởng nóng cho sales top đầu mỗi tuần, (5) Hướng dẫn sử dụng bộ tài liệu sales chuẩn hoá.',
    type: 'open-house',
    status: 'upcoming',
    startAt: iso(6, 9, 0), // 2026-08-15 09:00
    endAt: iso(6, 12, 0),
    location: {
      name: 'Vinhomes Ocean Park - Sales Gallery',
      address: 'Đường Đại Dương, Gia Lâm, Hà Nội',
      isOnline: false,
    },
    organizer: 'VinHomes × RealtyHub',
    capacity: 200,
    registered: 147,
    registrationCount: 147,
    checkinCount: 0,
    isFree: true,
    speakers: [
      { publicId: 'sp-001', name: 'Trần Quốc Việt', role: 'GĐKD Vinhomes' },
      { publicId: 'sp-002', name: 'Nguyễn Minh Khoa', role: 'Giảng viên RealtyHub' },
    ],
    tags: ['Kickoff', 'Vinhomes Ocean Park', 'Shophouse'],
    coverImage: '/images/projects/vinhomes-ocean-park-gia-lam/hero-3-phoi-canh-tong-the.jpg',
    invitationImage: '/images/projects/vinhomes-ocean-park-gia-lam/sp-cao-tang-ven-kenh.jpg',
    checkinQr: makeQrSvg('event-001'),
    documents: docsKickoff('event-001', 'Vinhomes Ocean Park'),
    isRegistrationOpen: true,
  },
  {
    publicId: 'event-002',
    slug: 'kickoff-vinhomes-global-gate-mo-ban-dot-1',
    title: 'KICKOFF DỰ ÁN VINHOMES GLOBAL GATE - MỞ BÁN ĐỢT 1',
    excerpt:
      'Cập nhật quỹ căn đợt 1: 850 căn hộ 1PN-3PN và shophouse mặt tiền. Học cách tư vấn khách nước ngoài và cách sử dụng bộ brochure song ngữ.',
    description:
      'Sự kiện kickoff mở bán đợt 1 Vinhomes Global Gate - dự án trọng điểm phía Tây Hà Nội. Nội dung: (1) Giới thiệu tổng quan dự án và tiện ích quốc tế, (2) Phân tích quỹ căn đợt 1 và bảng giá công bố, (3) Hướng dẫn sales flow cho khách hàng Việt kiều và nước ngoài, (4) Chính sách thanh toán ưu đãi đợt đầu và quà tặng nội thất, (5) Phân bổ lead và công cụ chăm sóc sau bán hàng.',
    type: 'open-house',
    status: 'upcoming',
    startAt: iso(11, 14, 0), // 2026-08-20 14:00
    endAt: iso(11, 17, 0),
    location: {
      name: 'Vinhomes Global Gate - Trung tâm mở bán',
      address: 'Cổ Nhuế, Nam Từ Liêm, Hà Nội',
      isOnline: false,
    },
    organizer: 'Vinhomes × RealtyHub',
    capacity: 300,
    registered: 198,
    registrationCount: 198,
    checkinCount: 0,
    isFree: true,
    speakers: [
      { publicId: 'sp-003', name: 'Lê Hồng Phong', role: 'Phó GĐKD Vinhomes' },
      { publicId: 'sp-004', name: 'Phạm Thị Mai', role: 'Trưởng nhóm Việt kiều' },
    ],
    tags: ['Kickoff', 'Vinhomes Global Gate', 'Việt kiều'],
    coverImage: '/images/projects/vinhomes-global-gate.jpg',
    invitationImage: '/images/projects/vinhomes-grand-park.jpg',
    checkinQr: makeQrSvg('event-002'),
    documents: docsKickoff('event-002', 'Vinhomes Global Gate'),
    isRegistrationOpen: true,
  },
  {
    publicId: 'event-003',
    slug: 'kickoff-green-skyline-phoi-canh-moi',
    title: 'KICKOFF DỰ ÁN GREEN SKYLINE - PHIÊN BẢN PHỐI CẢNH MỚI',
    excerpt:
      'Cập nhật phối cảnh 2026 với công viên trung tâm 4.2ha và 12 tiện ích xanh. Đào tạo cách tư vấn nhóm khách gia đình trẻ và phân tích đối thủ cạnh tranh.',
    description:
      'Kickoff phiên bản phối cảnh mới Green Skyline. Tập trung vào nhóm khách hàng gia đình trẻ và đối thủ cạnh tranh trong khu vực. Nội dung: (1) Phối cảnh 2026 và điểm nhấn công viên trung tâm, (2) So sánh ưu điểm với 3 đối thủ cùng phân khúc, (3) Cách tư vấn nhóm khách gia đình trẻ với câu chuyện giáo dục và sức khoẻ, (4) Bảng giá và chính sách ưu đãi đợt đầu, (5) Phân bổ lead theo khu vực.',
    type: 'open-house',
    status: 'upcoming',
    startAt: iso(20, 9, 30), // 2026-08-29 09:30
    endAt: iso(20, 12, 0),
    location: {
      name: 'Hotel Grand Plaza - Sảnh Hội nghị',
      address: '117 Trần Duy Hưng, Cầu Giấy, Hà Nội',
      isOnline: false,
    },
    organizer: 'Green Skyline Group × RealtyHub',
    capacity: 150,
    registered: 86,
    registrationCount: 86,
    checkinCount: 0,
    isFree: true,
    speakers: [
      { publicId: 'sp-005', name: 'Đặng Hữu Trí', role: 'Chủ đầu tư Green Skyline' },
    ],
    tags: ['Kickoff', 'Green Skyline', 'Phối cảnh mới'],
    coverImage: '/images/projects/green-skyline.jpg',
    invitationImage: '/images/projects/green-skyline.jpg',
    checkinQr: makeQrSvg('event-003'),
    documents: docsKickoff('event-003', 'Green Skyline'),
    isRegistrationOpen: true,
  },

  // ---------- ĐÀO TẠO MÔI GIỚI (40%) — 4 events ----------
  {
    publicId: 'event-004',
    slug: 'workshop-ky-nang-tu-van-khach-hang-bds',
    title: 'Workshop: Kỹ năng tư vấn khách hàng bất động sản hiệu quả',
    excerpt:
      'Thực hành 8 tình huống tư vấn thực tế với 4 nhóm khách hàng điển hình. Học cách đặt câu hỏi phân tích nhu cầu và đề xuất sản phẩm phù hợp.',
    description:
      'Workshop 4 giờ tập trung vào kỹ năng tư vấn và phân tích nhu cầu khách hàng BĐS. Học viên được chia nhóm đóng vai 8 tình huống thực tế (mua đầu tư, mua ở, mua cho con, mua chuyển nhượng, khách khó tính, khách so sánh 3 dự án, khách chưa có nhu cầu rõ ràng, khách đã mua). Mỗi tình huống được quay video và nhận feedback trực tiếp từ giảng viên. Bộ câu hỏi SPIN selling và mẫu script tư vấn được cung cấp đầy đủ.',
    type: 'workshop',
    status: 'upcoming',
    startAt: iso(13, 9, 0), // 2026-08-22 09:00
    endAt: iso(13, 13, 0),
    location: {
      name: 'RealtyHub Hub - Quận 1',
      address: 'Tầng 5, 88 Nguyễn Huệ, Quận 1, TP.HCM',
      isOnline: false,
    },
    organizer: 'RealtyHub Academy',
    capacity: 30,
    registered: 22,
    registrationCount: 22,
    checkinCount: 0,
    isFree: false,
    price: 990_000,
    speakers: [
      { publicId: 'sp-006', name: 'Nguyễn Minh Khoa', role: 'Giảng viên RealtyHub' },
      { publicId: 'sp-007', name: 'Trần Thanh Hải', role: 'Top 10 Môi giới 2023' },
    ],
    tags: ['Kỹ năng', 'Tư vấn', 'Đào tạo'],
    coverImage: '/images/projects/the-global-city.jpg',
    invitationImage: '/images/projects/the-global-city.jpg',
    checkinQr: makeQrSvg('event-004'),
    documents: docsDaoTao('event-004'),
    isRegistrationOpen: true,
  },
  {
    publicId: 'event-005',
    slug: 'workshop-nghe-thuat-chot-deal-bds',
    title: 'Workshop: Nghệ thuật chốt deal bất động sản',
    excerpt:
      'Bí quyết chốt deal từ 3 chuyên gia đã bán 500+ căn/năm. Học 5 bước chốt deal chuyên nghiệp và cách xử lý 7 tình huống từ chối phổ biến.',
    description:
      'Workshop thực chiến về nghệ thuật chốt deal trong bất động sản. Học 5 bước chốt deal từ tạo nhu cầu đến ký hợp đồng. Thực hành xử lý 7 tình huống từ chối phổ biến nhất: từ chối về giá, vị trí, pháp lý, tiến độ, so sánh dự án khác, chưa sẵn sàng, đã mua nơi khác. Cung cấp bộ 12 câu phản hồi mẫu và 5 mẫu email follow-up sau buổi xem.',
    type: 'workshop',
    status: 'upcoming',
    startAt: iso(20, 14, 0), // 2026-08-29 14:00
    endAt: iso(20, 17, 30),
    location: {
      name: 'RealtyHub Hub - Quận 1',
      address: 'Tầng 5, 88 Nguyễn Huệ, Quận 1, TP.HCM',
      isOnline: false,
    },
    organizer: 'RealtyHub Academy',
    capacity: 40,
    registered: 31,
    registrationCount: 31,
    checkinCount: 0,
    isFree: false,
    price: 1_290_000,
    speakers: [
      { publicId: 'sp-008', name: 'Phạm Quốc Đạt', role: 'Chuyên gia chốt deal - 500+ căn/năm' },
    ],
    tags: ['Chốt deal', 'Bán hàng', 'Đào tạo'],
    coverImage: '/images/projects/vinhomes-grand-park.jpg',
    invitationImage: '/images/projects/vinhomes-grand-park.jpg',
    checkinQr: makeQrSvg('event-005'),
    documents: docsDaoTao('event-005'),
    isRegistrationOpen: true,
  },
  {
    publicId: 'event-006',
    slug: 'workshop-ky-nang-xu-ly-tu-choi',
    title: 'Workshop: Kỹ năng xử lý từ chối của khách hàng',
    excerpt:
      '9 nguyên tắc xử lý từ chối + 12 mẫu câu phản hồi. Thực hành nhóm với 6 tình huống thực tế từ thị trường căn hộ, đất nền và shophouse.',
    description:
      'Workshop chuyên sâu về kỹ năng xử lý từ chối - kỹ năng sống còn của môi giới. Học 9 nguyên tắc tâm lý và 12 mẫu câu phản hồi đã được kiểm chứng. Thực hành nhóm với 6 tình huống thực tế từ thị trường căn hộ, đất nền và shophouse. Mỗi nhóm được quay video và nhận feedback 1-1 từ giảng viên.',
    type: 'workshop',
    status: 'ongoing',
    startAt: iso(0, 14, 0), // 2026-08-09 14:00 - hom nay, dang dien ra
    endAt: iso(0, 17, 30),
    location: {
      name: 'RealtyHub Hub - Quận 1',
      address: 'Tầng 5, 88 Nguyễn Huệ, Quận 1, TP.HCM',
      isOnline: false,
    },
    organizer: 'RealtyHub Academy',
    capacity: 30,
    registered: 28,
    registrationCount: 28,
    checkinCount: 12,
    isFree: false,
    price: 890_000,
    speakers: [
      { publicId: 'sp-009', name: 'Võ Hoàng Nam', role: 'Founder Team Building' },
    ],
    tags: ['Từ chối', 'Kỹ năng', 'Đào tạo'],
    coverImage: '/images/projects/the-berkeley.jpg',
    invitationImage: '/images/projects/the-berkeley.jpg',
    checkinQr: makeQrSvg('event-006'),
    documents: docsDaoTao('event-006'),
    isRegistrationOpen: true,
  },
  {
    publicId: 'event-007',
    slug: 'workshop-ung-dung-ai-trong-bds',
    title: 'Workshop: Ứng dụng AI trong kinh doanh bất động sản',
    excerpt:
      'Từ viết content, chăm sóc lead đến phân tích thị trường - học cách tận dụng AI để tăng 3 lần hiệu suất bán hàng mà vẫn cá nhân hoá.',
    description:
      'Workshop thực chiến về AI trong BĐS. Nội dung: (1) Viết content Facebook/Zalo cá nhân hoá bằng AI, (2) Auto phân loại lead và tự động phản hồi ban đầu, (3) Phân tích dữ liệu thị trường với công cụ AI, (4) Tạo video ngắn và ảnh marketing chỉ trong 5 phút, (5) Workflow tích hợp AI vào CRM. Cung cấp 25 prompt mẫu và 3 workflow Zapier/Make có sẵn.',
    type: 'workshop',
    status: 'full',
    startAt: iso(15, 9, 0), // 2026-08-24 09:00
    endAt: iso(15, 12, 0),
    location: {
      name: 'RealtyHub Hub - Quận 1',
      address: 'Tầng 5, 88 Nguyễn Huệ, Quận 1, TP.HCM',
      isOnline: false,
    },
    organizer: 'RealtyHub Academy × AI Hub VN',
    capacity: 30,
    registered: 30,
    registrationCount: 30,
    checkinCount: 0,
    isFree: false,
    price: 1_490_000,
    speakers: [
      { publicId: 'sp-010', name: 'Lê Quốc Bảo', role: 'Chuyên gia Marketing số' },
    ],
    tags: ['AI', 'Marketing', 'Đào tạo'],
    coverImage: '/images/projects/eco-retreat-long-an.jpg',
    invitationImage: '/images/projects/eco-retreat-long-an.jpg',
    checkinQr: makeQrSvg('event-007'),
    documents: docsDaoTao('event-007'),
    isRegistrationOpen: false,
  },

  // ---------- THỊ TRƯỜNG / CHÍNH SÁCH / SẢN PHẨM (20%) — 2 events ----------
  {
    publicId: 'event-008',
    slug: 'seminar-cap-nhat-thi-truong-bds-q3-2026',
    title: 'Seminar: Cập nhật thị trường BĐS Quý 3/2026 và chính sách mới',
    excerpt:
      'Số liệu chính thức từ 18 sàn lớn + phân tích tác động của 3 chính sách mới. Cập nhật nguồn cung, giá và thanh khoản theo từng phân khúc.',
    description:
      'Seminar cập nhật thị trường BĐS Quý 3/2026 với số liệu từ 18 sàn lớn (Đất Xanh, Hưng Thịnh, Khang Điền, Vinhomes, Masterise...). Phân tích tác động của 3 chính sách mới vừa ban hành lên nguồn cung, giá và thanh khoản từng phân khúc (căn hộ, shophouse, đất nền, BĐS công nghiệp). Cung cấp bộ 18 biểu đồ so sánh và file Excel dữ liệu thô để sales tự phân tích.',
    type: 'seminar',
    status: 'upcoming',
    startAt: iso(27, 19, 0), // 2026-09-05 19:00
    endAt: iso(27, 21, 30),
    location: {
      name: 'Online qua Zoom',
      isOnline: true,
      onlineUrl: 'https://zoom.us/j/example',
    },
    organizer: 'RealtyHub Research',
    capacity: 500,
    registered: 318,
    registrationCount: 318,
    checkinCount: 0,
    isFree: true,
    speakers: [
      { publicId: 'sp-011', name: 'TS. Nguyễn Văn Hùng', role: 'Chuyên gia kinh tế - 18 năm KN' },
    ],
    tags: ['Thị trường', 'Chính sách', 'Phân tích'],
    coverImage: '/images/projects/ixora-ho-tram-by-fusion.jpg',
    invitationImage: '/images/projects/ixora-ho-tram-by-fusion.jpg',
    checkinQr: makeQrSvg('event-008'),
    documents: docsSeminar('event-008'),
    isRegistrationOpen: true,
  },
  {
    publicId: 'event-009',
    slug: 'seminar-phap-ly-bds-cho-moi-gioi',
    title: 'Seminar: Pháp lý BĐS cập nhật 2026 dành cho môi giới',
    excerpt:
      'Luật sư Phạm Đức Thịnh phân tích 4 thay đổi pháp lý quan trọng nhất 2026. Nắm rõ quy trình sổ đỏ, hợp đồng đặt cọc và trách nhiệm pháp lý của môi giới.',
    description:
      'Seminar chuyên sâu về pháp lý BĐS 2026 dành cho môi giới. Luật sư Phạm Đức Thịnh (14 năm kinh nghiệm) phân tích 4 thay đổi pháp lý quan trọng nhất: (1) Quy trình cấp sổ đỏ mới theo Luật Đất đai 2024, (2) Hợp đồng đặt cọc - điều khoản cần lưu ý, (3) Trách nhiệm pháp lý của môi giới khi khách hàng tranh chấp, (4) Thuế TNCN và VAT khi mua bán BĐS. Cung cấp bộ 12 mẫu hợp đồng chuẩn và checklist pháp lý.',
    type: 'seminar',
    status: 'past',
    startAt: iso(-15, 19, 0), // 2026-07-25
    endAt: iso(-15, 21, 30),
    location: {
      name: 'Online qua Zoom',
      isOnline: true,
      onlineUrl: 'https://zoom.us/j/example',
    },
    organizer: 'RealtyHub × Cty Luật Phạm Đức',
    capacity: 500,
    registered: 412,
    registrationCount: 412,
    checkinCount: 386,
    isFree: true,
    speakers: [
      { publicId: 'sp-012', name: 'Luật sư Phạm Đức Thịnh', role: '14 năm kinh nghiệm BĐS' },
    ],
    tags: ['Pháp lý', 'Sổ đỏ', 'Hợp đồng'],
    coverImage: '/images/projects/la-home-long-an.jpg',
    invitationImage: '/images/projects/la-home-long-an.jpg',
    checkinQr: makeQrSvg('event-009'),
    documents: docsSeminar('event-009'),
    isRegistrationOpen: false,
  },

  // ---------- NETWORKING / SALES GATHERING (10%) — 1 event ----------
  {
    publicId: 'event-010',
    slug: 'networking-monthly-meetup-thang-8',
    title: 'Monthly Meetup: Gặp gỡ môi giới tháng 8',
    excerpt:
      'Buổi gặp mặt định kỳ tháng 8 của cộng đồng môi giới RealtyHub. Chia sẻ deal, tìm đối tác, networking thư giãn cùng 35 môi giới top đầu.',
    description:
      'Monthly Meetup tháng 8 - buổi gặp mặt định kỳ của cộng đồng môi giới RealtyHub với 35 môi giới top đầu TP.HCM. Chương trình: (1) 3 deal nổi bật trong tháng được chia sẻ bởi sales top 3, (2) Mini-game kết nối đối tác 1-1, (3) Buffet nhẹ và quay số trúng thưởng, (4) Cập nhật tin tức thị trường tuần qua. Đây là sự kiện networking thường kỳ được tổ chức mỗi tháng một lần.',
    type: 'networking',
    status: 'past',
    startAt: iso(-8, 18, 0), // 2026-08-01
    endAt: iso(-8, 21, 0),
    location: {
      name: 'The Coffee House - Nguyễn Huệ',
      address: 'Số 6 Nguyễn Huệ, Quận 1, TP.HCM',
      isOnline: false,
    },
    organizer: 'RealtyHub Community',
    capacity: 40,
    registered: 35,
    registrationCount: 35,
    checkinCount: 33,
    isFree: true,
    tags: ['Cộng đồng', 'Networking'],
    coverImage: '/images/projects/lapura.jpg',
    invitationImage: '/images/projects/lapura.jpg',
    checkinQr: makeQrSvg('event-010'),
    documents: docsNetworking('event-010'),
    isRegistrationOpen: false,
  },
];
