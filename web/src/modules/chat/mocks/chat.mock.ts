/**
 * Du lieu hoi thoai mau. Noi dung hu cau, chi de demo giao dien.
 *
 * Khi co bot that: xoa thu muc mocks/, khong sua file nao khac ngoai
 * services/chat.service.ts.
 */
import type { ChatMessage, QuickReply } from '../models/chat.model';

/** Hai cau chao co san khi mo khung chat lan dau */
export const MOCK_HISTORY: ChatMessage[] = [
  {
    publicId: 'msg-seed-1',
    role: 'bot',
    text: 'Chào anh/chị! Em là trợ lý ảo của RealtyHub, hỗ trợ tra cứu dự án, bảng giá, quỹ căn và chính sách bán hàng.',
    sentAt: '2026-08-09T02:00:00.000Z',
  },
  {
    publicId: 'msg-seed-2',
    role: 'bot',
    text: 'Anh/chị đang quan tâm tới nội dung nào ạ?',
    sentAt: '2026-08-09T02:00:04.000Z',
  },
];

export const MOCK_QUICK_REPLIES: QuickReply[] = [
  { publicId: 'qr-1', label: 'Dự án nào đang mở bán?' },
  { publicId: 'qr-2', label: 'Xem bảng giá & quỹ căn' },
  { publicId: 'qr-3', label: 'Chính sách thanh toán' },
  { publicId: 'qr-4', label: 'Đặt lịch xem nhà mẫu' },
];

/**
 * Bo cau tra loi mau.
 *
 * `keywords` viet khong dau, chu thuong - ChatService chuan hoa cau nguoi dung
 * ve cung dang truoc khi so khop, nen go "mo ban" hay "Mở bán" deu khop.
 * Duyet tu tren xuong, lay muc dau tien trung bat ky tu khoa nao.
 */
export const MOCK_REPLIES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ['mo ban', 'du an nao', 'dang ban', 'con hang'],
    reply:
      'Hiện có 3 dự án đang mở bán nổi bật: Green Harbor Hạ Long, Lotus Park Hưng Yên và Sunrise Bay Đà Nẵng. Anh/chị muốn em gửi thông tin chi tiết dự án nào ạ?',
  },
  {
    keywords: ['gia', 'bang gia', 'bao nhieu', 'quy can', 'bang hang'],
    reply:
      'Giá bán hiện dao động từ 2,8 tỷ (căn 2 phòng ngủ) đến 18 tỷ (biệt thự đơn lập). Anh/chị có thể xem bảng hàng đầy đủ ở tab "Quỹ căn" trong trang chi tiết từng dự án, có lọc theo phân khu, hướng và tình trạng.',
  },
  {
    keywords: ['thanh toan', 'chinh sach', 'tra gop', 'lai suat', 'vay'],
    reply:
      'Chính sách hiện tại: thanh toán sớm chiết khấu tới 9%, hoặc vay tới 70% với hỗ trợ lãi suất 0% trong 24 tháng đầu. Em gửi anh/chị bảng tiến độ thanh toán chi tiết nhé?',
  },
  {
    keywords: ['vi tri', 'o dau', 'dia chi', 'ban do', 'duong'],
    reply:
      'Mỗi dự án đều có tab "Vị trí" kèm bản đồ và các trục kết nối chính. Anh/chị cho em biết đang quan tâm khu vực nào — Hà Nội, Hải Phòng, Quảng Ninh hay Đà Nẵng ạ?',
  },
  {
    keywords: ['xem nha', 'dat lich', 'tham quan', 'nha mau', 'hen'],
    reply:
      'Dạ em đã ghi nhận. Anh/chị để lại số điện thoại và khung giờ thuận tiện, chuyên viên tư vấn sẽ liên hệ xác nhận lịch trong vòng 30 phút ạ.',
  },
  {
    keywords: ['mat bang', '360', 'hinh anh', 'phoi canh', 'video'],
    reply:
      'Anh/chị có thể xem mặt bằng quỹ căn tương tác và ảnh 360° ngay trên trang chi tiết dự án — ba nút tắt nằm ngay trên thẻ dự án ở trang danh sách ạ.',
  },
  {
    keywords: ['cam on', 'thanks', 'ok', 'tuyet'],
    reply: 'Dạ em cảm ơn anh/chị! Có thêm câu hỏi nào anh/chị cứ nhắn em nhé.',
  },
];

export const MOCK_FALLBACK =
  'Em chưa có sẵn thông tin cho câu hỏi này. Anh/chị để lại số điện thoại, chuyên viên tư vấn sẽ gọi lại hỗ trợ trực tiếp trong ít phút ạ.';
