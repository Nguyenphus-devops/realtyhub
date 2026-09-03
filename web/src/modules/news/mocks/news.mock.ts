/** Du lieu mau - tieu de hu cau, thay bang API `blog` khi lam backend */
import type { NewsArticle } from '../models/news.model';

export const MOCK_NEWS: NewsArticle[] = [
  {
    publicId: 'news-001',
    slug: 'gia-tri-bat-dong-san-khong-chi-nam-o-khoang-cach',
    title: 'Giá trị bất động sản không chỉ nằm ở khoảng cách',
    excerpt:
      'Khoảng cách tới trung tâm không còn là thước đo duy nhất. Chất lượng hạ tầng kết nối, tiện ích nội khu và mật độ cây xanh đang định nghĩa lại giá trị của một khu đô thị.',
    category: 'phan-tich-nhan-dinh',
    thumbnailUrl: '/images/news/news-001.jpg',
    publishedAt: '2026-08-07T02:00:00.000Z',
  },
  {
    publicId: 'news-002',
    slug: 'khoi-cong-phan-khu-thap-tang-tai-khu-dong',
    title: 'Khởi công phân khu thấp tầng đầu tiên tại khu Đông',
    excerpt:
      'Phân khu thấp tầng quy mô 42 ha chính thức được khởi công, dự kiến bàn giao những căn đầu tiên vào quý IV năm sau theo tiến độ đã công bố.',
    category: 'tin-tuc-du-an',
    thumbnailUrl: '/images/news/news-002.jpg',
    publishedAt: '2026-08-07T03:30:00.000Z',
  },
  {
    publicId: 'news-003',
    slug: 'ban-giao-toa-thap-dau-tien-cua-metro-star-tower',
    title: 'Bàn giao tòa tháp đầu tiên của Metro Star Tower',
    excerpt:
      'Tòa tháp đầu tiên hoàn thiện đúng cam kết, cư dân bắt đầu nhận bàn giao từ tuần này cùng toàn bộ tiện ích khối đế đã đi vào vận hành.',
    category: 'tin-tuc-du-an',
    thumbnailUrl: '/images/news/news-003.jpg',
    publishedAt: '2026-08-07T04:15:00.000Z',
  },
  {
    publicId: 'news-004',
    slug: 'xu-huong-can-ho-ven-song-nam-2026',
    title: 'Xu hướng căn hộ ven sông sẽ dẫn dắt thị trường 2026',
    excerpt:
      'Nguồn cung ven sông ngày càng khan hiếm trong khi nhu cầu ở thực tăng đều, tạo nên chênh lệch cung cầu rõ rệt ở nhóm sản phẩm này.',
    category: 'phan-tich-nhan-dinh',
    thumbnailUrl: '/images/news/news-004.jpg',
    publishedAt: '2026-08-06T08:00:00.000Z',
  },
  {
    publicId: 'news-005',
    slug: 'green-harbor-ha-long-cat-noc-phan-khu-ven-vinh',
    title: 'Green Harbor Hạ Long cất nóc phân khu ven vịnh',
    excerpt:
      'Sự kiện cất nóc đánh dấu cột mốc quan trọng của phân khu ven vịnh, đồng thời mở màn cho đợt mở bán tiếp theo trong tháng tới.',
    category: 'tin-tuc-du-an',
    thumbnailUrl: '/images/news/news-005.jpg',
    publishedAt: '2026-08-06T09:20:00.000Z',
  },
  {
    publicId: 'news-006',
    slug: 'nam-loi-the-cua-bat-dong-san-nghi-duong-mien-trung',
    title: 'Năm lợi thế của bất động sản nghỉ dưỡng miền Trung',
    excerpt:
      'Đường bờ biển dài, hạ tầng sân bay được nâng cấp và dòng khách quốc tế phục hồi là ba trong năm yếu tố đang nâng đỡ thị trường khu vực.',
    category: 'phan-tich-nhan-dinh',
    thumbnailUrl: '/images/news/news-006.jpg',
    publishedAt: '2026-08-06T10:45:00.000Z',
  },
  {
    publicId: 'news-007',
    slug: 'lotus-park-hung-yen-mo-ban-dot-hai',
    title: 'Lotus Park Hưng Yên mở bán đợt hai từ giữa tháng 8',
    excerpt:
      'Đợt hai đưa ra thị trường hơn 200 sản phẩm nhà phố và shophouse, kèm chính sách hỗ trợ lãi suất trong 24 tháng đầu.',
    category: 'tin-tuc-du-an',
    thumbnailUrl: '/images/news/news-007.jpg',
    publishedAt: '2026-08-05T07:10:00.000Z',
  },
  {
    publicId: 'news-008',
    slug: 'chinh-sach-thanh-toan-moi-cho-nguoi-mua-lan-dau',
    title: 'Chính sách thanh toán mới dành cho người mua lần đầu',
    excerpt:
      'Người mua lần đầu được giãn tiến độ thanh toán tới 36 tháng, giảm đáng kể áp lực dòng tiền trong giai đoạn xây dựng.',
    category: 'tin-tuc-du-an',
    thumbnailUrl: '/images/news/news-008.jpg',
    publishedAt: '2026-08-05T11:00:00.000Z',
  },
  {
    publicId: 'news-009',
    slug: 'bao-gia-dat-nen-vung-ven-2026-tang-15',
    title: 'Bảng giá đất nền vùng ven 2026 tăng 15%',
    excerpt:
      'Số liệu từ các sàn lớn cho thấy đất nền vùng ven ghi nhận mức tăng 15% so với cùng kỳ, trong khi nguồn cung tiếp tục thu hẹp.',
    category: 'phan-tich-nhan-dinh',
    thumbnailUrl: '/images/news/news-009.jpg',
    publishedAt: '2026-08-04T03:00:00.000Z',
  },
  {
    publicId: 'news-010',
    slug: 'the-arcadia-giai-doan-2-da-co-giay-phep-xay-dung',
    title: 'The Arcadia giai đoạn 2 đã có giấy phép xây dựng',
    excerpt:
      'Chủ đầu tư chính thức công bố giấy phép xây dựng giai đoạn 2, đồng thời xác nhận tiến độ bàn giao vào cuối năm 2027.',
    category: 'tin-tuc-du-an',
    thumbnailUrl: '/images/news/news-010.jpg',
    publishedAt: '2026-08-03T08:30:00.000Z',
  },
  {
    publicId: 'news-011',
    slug: 'chuyen-gia-nhan-dinh-thi-truong-shophouse-2026',
    title: 'Chuyên gia nhận định thị trường shophouse 2026',
    excerpt:
      'Shophouse tiếp tục là kênh đầu tư được yêu thích nhờ khả năng kết hợp kinh doanh và cho thuê, nhưng cần cân nhắc kỹ vị trí.',
    category: 'phan-tich-nhan-dinh',
    thumbnailUrl: '/images/news/news-011.jpg',
    publishedAt: '2026-08-02T02:45:00.000Z',
  },
  {
    publicId: 'news-012',
    slug: 'thu-tuc-sang-ten-nha-dat-duoc-don-gian-hoa',
    title: 'Thủ tục sang tên nhà đất được đơn giản hóa',
    excerpt:
      'Nhiều thủ tục hành chính về sang tên, cấp sổ đỏ được rút ngắn còn 5-7 ngày làm việc nhờ ứng dụng công nghệ số.',
    category: 'tin-tuc-du-an',
    thumbnailUrl: '/images/news/news-012.jpg',
    publishedAt: '2026-08-01T09:15:00.000Z',
  },
];
