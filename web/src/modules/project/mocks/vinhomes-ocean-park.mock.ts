/**
 * DU LIEU THAT - Vinhomes Ocean Park (Gia Lam, Ha Noi)
 * ====================================================
 *
 * File nay khac moi file khac trong mocks/: so lieu o day KHONG phai sinh ngau
 * nhien ma tra tu nguon cong khai, phuc vu demo "neu la du lieu that thi trang
 * hien ra sao".
 *
 * NGUON:
 *  - vinhomes.vn/vi/kham-pha-cac-phan-khu-vinhomes-ocean-park  (phan khu, dong SP)
 *  - vnexpress.net/vinhomes-ocean-park-gia-lam-don-hon-60-000-cu-dan-4719226.html
 *  - market.vinhomes.vn/du-an/vinhomes-ocean-park               (anh chinh thuc)
 *  - Bao do ket noi giao thong chinh thuc cua CDT (anh trong public/images)
 *  - Toa do: OpenStreetMap / Nominatim
 *
 * PHAN NAO LA THAT:
 *  Quy mo 420 ha, 66 toa 23-26 tang, can ho 35-85 m2, 3 dong Sapphire/Ruby/
 *  Diamond, 4 phan khu thap tang Hai Au - Ngoc Trai - San Ho - Sao Bien,
 *  2.390 can thap tang, ho trung tam 24,5 ha, bien ho nuoc man 6,1 ha,
 *  VinUni - Vinmec - Vinschool - Vincom Mega Mall, hon 60.000 cu dan,
 *  toan bo so phut di chuyen trong tab Vi tri, va TAT CA anh.
 *
 * PHAN NAO LA MINH HOA (khong co nguon cong khai, bo sinh tu dien):
 *  Bang hang tung can, chinh sach ban hang, vi tri pin gia tren mat bang,
 *  anh 360, tai lieu dao tao, moc tien do, ten + so dien thoai chuyen vien.
 *  Chi tiet xem GHI-CHU-DU-LIEU.md cung thu muc.
 */
import type {
  MasterPlanSheet,
  ProjectAmenity,
  ProjectConsultant,
  ProjectDetail,
  ProjectLocation,
  ProjectProduct,
  ProjectSpec,
  ProjectStat,
  MediaSlide,
} from '../models/project-detail.model';

export const VOP_SLUG = 'vinhomes-ocean-park-gia-lam';

const IMG = `/images/projects/${VOP_SLUG}`;

/** Sau anh hero - deu la anh that tu marketplace chinh thuc cua Vinhomes */
const hero: MediaSlide[] = [
  {
    publicId: 'vop-hero-1',
    imageUrl: `${IMG}/hero-1-hoang-hon-ho-trung-tam.jpg`,
    caption: 'Hoàng hôn trên hồ trung tâm 24,5 ha',
  },
  {
    publicId: 'vop-hero-2',
    imageUrl: `${IMG}/hero-2-bien-ho-nuoc-man.jpg`,
    caption: 'Biển hồ nước mặn 6,1 ha với bãi cát trắng',
  },
  {
    publicId: 'vop-hero-3',
    imageUrl: `${IMG}/hero-3-phoi-canh-tong-the.jpg`,
    caption: 'Phối cảnh tổng thể khu đô thị 420 ha',
  },
  {
    publicId: 'vop-hero-4',
    imageUrl: `${IMG}/hero-4-cong-chao-bieu-tuong.jpg`,
    caption: 'Cổng chào biểu tượng Vinhomes Ocean Park',
  },
  {
    publicId: 'vop-hero-5',
    imageUrl: `${IMG}/hero-5-phan-khu-thap-tang.jpg`,
    caption: 'Phân khu thấp tầng ven hồ',
  },
  {
    publicId: 'vop-hero-6',
    imageUrl: `${IMG}/hero-6-hoang-hon-toa-kinh.jpg`,
    caption: 'Trục cảnh quan ven hồ lúc hoàng hôn',
  },
];

/** Ba chi so noi bat - deu co nguon */
const stats: ProjectStat[] = [
  { key: 'scale', label: 'Quy mô dự án', value: '420 ha' },
  { key: 'capital', label: 'Số căn hộ', value: '~50.000 căn' },
  { key: 'population', label: 'Cư dân', value: 'Hơn 60.000 người' },
];

const specs: ProjectSpec[] = [
  { label: 'Tên dự án', value: 'Vinhomes Ocean Park (Gia Lâm)' },
  { label: 'Vị trí', value: 'Xã Gia Lâm, TP. Hà Nội' },
  { label: 'Quy mô dự án', value: '420 ha' },
  { label: 'Mật độ xây dựng', value: 'Khoảng 19%, còn lại là cảnh quan' },
  { label: 'Quy mô dân số', value: 'Hơn 60.000 cư dân đã về ở' },
  { label: 'Loại hình sản phẩm', value: 'Căn hộ, biệt thự, nhà phố, shophouse' },
  { label: 'Chủ đầu tư', value: 'Vingroup' },
  { label: 'Hình thức sở hữu', value: 'Sổ lâu dài (thấp tầng), 50 năm (căn hộ)' },
];

/** Ba dong san pham can ho that cua Vinhomes + thap tang */
const products: ProjectProduct[] = [
  {
    publicId: 'vop-sp-sapphire',
    name: 'Vinhomes Sapphire',
    areaLabel: 'Căn hộ 35 – 85 m², dòng phổ thông',
    imageUrl: `${IMG}/sp-cao-tang-ven-kenh.jpg`,
  },
  {
    publicId: 'vop-sp-ruby',
    name: 'Vinhomes Ruby',
    areaLabel: 'Căn hộ cao cấp, tiện ích nội khu đầy đủ',
    imageUrl: `${IMG}/hero-6-hoang-hon-toa-kinh.jpg`,
  },
  {
    publicId: 'vop-sp-diamond',
    name: 'Vinhomes Diamond',
    areaLabel: 'Dòng cao cấp nhất trong hệ thống Vinhomes',
    imageUrl: `${IMG}/hero-1-hoang-hon-ho-trung-tam.jpg`,
  },
  {
    publicId: 'vop-sp-thap-tang',
    name: 'Biệt thự & shophouse',
    areaLabel: '2.390 căn thấp tầng thuộc 4 phân khu',
    imageUrl: `${IMG}/hero-5-phan-khu-thap-tang.jpg`,
  },
];

/** Tien ich co that, anh da xem tan mat dung la cong trinh do */
const amenities: ProjectAmenity[] = [
  {
    publicId: 'vop-ti-bien-ho',
    name: 'Biển hồ nước mặn 6,1 ha',
    imageUrl: `${IMG}/hero-2-bien-ho-nuoc-man.jpg`,
  },
  {
    publicId: 'vop-ti-vinuni',
    name: 'Đại học VinUni',
    imageUrl: `${IMG}/tien-ich-dai-hoc-vinuni.jpg`,
  },
  {
    publicId: 'vop-ti-vincom',
    name: 'Vincom Mega Mall Ocean Park',
    imageUrl: `${IMG}/tien-ich-vincom-mega-mall.jpg`,
  },
  {
    publicId: 'vop-ti-vinschool',
    name: 'Vinschool liên cấp',
    imageUrl: `${IMG}/tien-ich-vinschool.jpg`,
  },
  {
    publicId: 'vop-ti-ho-trung-tam',
    name: 'Hồ trung tâm 24,5 ha',
    imageUrl: `${IMG}/hero-1-hoang-hon-ho-trung-tam.jpg`,
  },
  {
    publicId: 'vop-ti-vinuni-2',
    name: 'Quảng trường VinUni',
    imageUrl: `${IMG}/tien-ich-vinuni-chinh-dien.jpg`,
  },
  {
    publicId: 'vop-ti-vincom-dem',
    name: 'Vincom Mega Mall về đêm',
    imageUrl: `${IMG}/tien-ich-vincom-mega-mall-dem.jpg`,
  },
  {
    publicId: 'vop-ti-canh-quan',
    name: 'Trục cảnh quan ven kênh đào',
    imageUrl: `${IMG}/sp-cao-tang-ven-kenh.jpg`,
  },
];

/**
 * Vi tri - toan bo so phut lay tu BAN DO KET NOI GIAO THONG chinh thuc cua chu
 * dau tu (anh luu trong public/images/.../ban-do-ket-noi-giao-thong.jpg).
 * Toa do tu OpenStreetMap.
 */
const location: ProjectLocation = {
  bannerUrl: `${IMG}/ban-do-ket-noi-giao-thong.jpg`,
  headline: 'Cửa ngõ phía Đông Hà Nội, kết nối trực tiếp cao tốc Hà Nội – Hải Phòng',
  intro:
    'Vinhomes Ocean Park nằm tại xã Gia Lâm, phía Đông Hà Nội, tiếp giáp cao tốc Hà Nội – Hải Phòng và nút giao Cổ Linh. Vị trí này cho phép di chuyển vào trung tâm thành phố qua nhiều hướng khác nhau mà không phụ thuộc một trục đường duy nhất.',
  highlights: [
    {
      publicId: 'vop-vt-1',
      icon: 'car',
      title: '10 phút tới cầu Thanh Trì',
      description:
        'Từ cầu Thanh Trì rẽ vào cao tốc Hà Nội – Hải Phòng là tới đại đô thị.',
    },
    {
      publicId: 'vop-vt-2',
      icon: 'car',
      title: '15 phút tới Vinhomes Times City',
      description:
        'Đi theo hướng cầu Vĩnh Tuy, đường Cổ Linh rồi vào cao tốc Hà Nội – Hải Phòng.',
    },
    {
      publicId: 'vop-vt-3',
      icon: 'globe',
      title: '25 phút tới Hồ Hoàn Kiếm',
      description:
        'Qua cầu Chương Dương hoặc cầu Vĩnh Tuy, đi thẳng đường Cổ Linh vào đại đô thị.',
    },
    {
      publicId: 'vop-vt-4',
      icon: 'ship',
      title: '5 phút tới Aeon Mall Long Biên',
      description: 'Trung tâm thương mại lớn nằm ngay trên trục đường Cổ Linh.',
    },
    {
      publicId: 'vop-vt-5',
      icon: 'rocket',
      title: 'Tiếp giáp cao tốc 5B Hà Nội – Hải Phòng',
      description:
        'Có nhánh rẽ riêng từ cao tốc vào đại lộ 52m và chiều ngược lại.',
    },
    {
      publicId: 'vop-vt-6',
      icon: 'train',
      title: 'Đường Đông Dư – Dương Xá 40m',
      description: 'Kết nối từ Quốc lộ 5A vào thẳng đại đô thị.',
    },
  ],
  closing:
    'Bốn lộ trình độc lập vào trung tâm giúp cư dân không bị phụ thuộc vào một hướng di chuyển duy nhất — yếu tố hiếm có với các đại đô thị vùng ven.',
  latitude: 20.9942646,
  longitude: 105.948475,
  mapLabel: 'Vinhomes Ocean Park, xã Gia Lâm, TP. Hà Nội',
};

/**
 * Chuyen vien tu van - DAY LA DU LIEU GIA.
 * Ten va so dien thoai deu bia; khong dung thong tin nguoi that.
 * So dien thoai dat trong dai 0000 de nhin la biet khong co that.
 */
const consultants: ProjectConsultant[] = [
  {
    publicId: 'vop-cv-1',
    role: 'Chuyên viên tư vấn',
    name: 'Nguyễn Minh Anh (dữ liệu mẫu)',
    phone: '0000 000 001',
  },
  {
    publicId: 'vop-cv-2',
    role: 'Quản lý kinh doanh',
    name: 'Trần Hải Long (dữ liệu mẫu)',
    phone: '0000 000 002',
  },
];

// ── Mat bang quy can ───────────────────────────────────────────────────────

/**
 * Cac dai toa do (%) trung voi cac day lo THAT tren anh mat bang phan lo.
 * Vung ho dieu hoa 24,5 ha nam giua anh (x 35-60%, y 45-65%) nen khong ghim.
 *
 * Ten loai hinh va khoang dien tich la SO LIEU THAT (nguon: cac trang phan
 * phoi chinh thuc). Rieng GIA la minh hoa - chu dau tu khong cong bo gia tung
 * can, xem GHI-CHU-DU-LIEU.md.
 */
type PlanBand = {
  phase: string;
  prefix: string;
  type: string;
  area: [number, number];
  x: [number, number];
  y: [number, number];
  rows: number;
  perRow: number;
};

const PLAN_BANDS: PlanBand[] = [
  {
    phase: 'Ngọc Trai',
    prefix: 'NT',
    type: 'LIỀN KỀ',
    area: [90, 130],
    x: [43, 56],
    y: [22, 34],
    rows: 4,
    perRow: 5,
  },
  {
    phase: 'Sao Biển',
    prefix: 'SB',
    type: 'ĐƠN LẬP',
    area: [250, 450],
    x: [61, 72],
    y: [22, 32],
    rows: 3,
    perRow: 4,
  },
  {
    phase: 'San Hô',
    prefix: 'SH',
    type: 'SONG LẬP',
    area: [180, 250],
    x: [41, 52],
    y: [45, 57],
    rows: 4,
    perRow: 4,
  },
  {
    phase: 'Hải Âu',
    prefix: 'HA',
    type: 'SHOPHOUSE',
    area: [170, 300],
    x: [66, 82],
    y: [45, 56],
    rows: 3,
    perRow: 5,
  },
];

const FUND_CYCLE = ['doc-quyen', 'an-cheo', 'thuong'] as const;
const STATUS_CYCLE = ['con-hang', 'con-hang', 'giu-cho', 'con-hang', 'da-ban'] as const;

const buildPlanMarkers = () => {
  const markers = [];
  let n = 0;

  for (const band of PLAN_BANDS) {
    for (let row = 0; row < band.rows; row += 1) {
      for (let col = 0; col < band.perRow; col += 1) {
        n += 1;
        const tx = band.perRow === 1 ? 0.5 : col / (band.perRow - 1);
        const ty = band.rows === 1 ? 0.5 : row / (band.rows - 1);

        const landArea = Math.round(
          band.area[0] + ((band.area[1] - band.area[0]) * ((row * 7 + col * 3) % 10)) / 10,
        );
        // Don gia minh hoa 118-142 trieu/m2, bam quanh mat bang gia khu Dong HN
        const unitPrice = 118_000_000 + (((row * 5 + col * 11) % 25) * 1_000_000);

        markers.push({
          publicId: `vop-pin-${n}`,
          code: `${band.prefix}${row + 1}-${String(col + 1).padStart(2, '0')}`,
          price: Math.round((landArea * unitPrice) / 1e8) * 1e8,
          fundType: FUND_CYCLE[n % FUND_CYCLE.length],
          phaseName: band.phase,
          propertyTypeLabel: band.type,
          landArea,
          status: STATUS_CYCLE[n % STATUS_CYCLE.length],
          x: band.x[0] + (band.x[1] - band.x[0]) * tx,
          y: band.y[0] + (band.y[1] - band.y[0]) * ty,
        });
      }
    }
  }

  return markers;
};

/**
 * Ban do mat bang dung ANH PHAN LO THAT cua du an (1024x853), thay cho anh
 * placeholder gradient. `width`/`height` la he toa do quy uoc cho Leaflet
 * CRS.Simple - chi ti le giua chung moi quan trong, va no phai khop ti le anh
 * that (1024/853) neu khong pin se lech khoi o dat.
 */
export const VOP_PLAN_MAP = {
  imageUrl: `${IMG}/mat-bang-tien-ich-tong-the.jpg`,
  width: 2560,
  height: 1280,
  markers: buildPlanMarkers(),
};

/**
 * Anh 360 - DAY LA ANH MAU, KHONG PHAI OCEAN PARK.
 *
 * Anh 360 that phai la anh equirectangular (ti le dung 2:1, chua tron 360x180
 * do) chup bang may 360. Anh phoi canh cua du an la anh thuong 16:9 nen khong
 * the xoay tron vong - du lieu cua ~300 do con lai khong ton tai.
 *
 * Nam anh duoi day lay tu Poly Haven, giay phep CC0 (mien phi tuyet doi, khong
 * can ghi nguon), 8192x4096. Chung o day de bo xem 360 chay that va kiem chung
 * duoc; khi co anh 360 that cua du an thi CHI can thay duong dan trong mang nay.
 */
export const VOP_PANORAMAS = [
  {
    publicId: 'vop-pano-1',
    title: 'Toàn cảnh đô thị từ trên cao (ảnh mẫu)',
    imageUrl: '/images/panorama-demo/thanh-pho-tu-tren-cao.jpg',
    hotspots: [
      { publicId: 'vop-hs-1', label: 'Khu cao tầng', x: 24, y: 48 },
      { publicId: 'vop-hs-2', label: 'Trục cảnh quan', x: 66, y: 52 },
    ],
  },
  {
    publicId: 'vop-pano-2',
    title: 'Quảng trường trung tâm (ảnh mẫu)',
    imageUrl: '/images/panorama-demo/quang-truong-trung-tam.jpg',
    hotspots: [{ publicId: 'vop-hs-3', label: 'Quảng trường', x: 50, y: 55 }],
  },
  {
    publicId: 'vop-pano-3',
    title: 'Khu đô thị ven sông (ảnh mẫu)',
    imageUrl: '/images/panorama-demo/khu-do-thi-ven-song.jpg',
    hotspots: [{ publicId: 'vop-hs-4', label: 'Đường dạo ven sông', x: 38, y: 54 }],
  },
  {
    publicId: 'vop-pano-4',
    title: 'Phố đi bộ nội khu (ảnh mẫu)',
    imageUrl: '/images/panorama-demo/pho-di-bo-do-thi.jpg',
    hotspots: [{ publicId: 'vop-hs-5', label: 'Khu thương mại', x: 58, y: 52 }],
  },
  {
    publicId: 'vop-pano-5',
    title: 'Phố nhà ở đô thị (ảnh mẫu)',
    imageUrl: '/images/panorama-demo/pho-nha-o-do-thi.jpg',
    hotspots: [{ publicId: 'vop-hs-6', label: 'Khu thấp tầng', x: 45, y: 53 }],
  },
];

/**
 * Ban ve mat bang that cua du an, dung cho muc "Mat bang" o tab Tong quan.
 *
 * To dau tien la mat bang tong the toan khu 420 ha; bon to sau lay chung mot
 * ban ve goc, moi to to dam dung mot phan khu de nguoi xem doi chieu duoc vi
 * tri phan khu do trong tong the. Anh goc 8000x6000, da nen ve 2400 px.
 *
 * Khong dung anh 16:9 nen cac o hien thi phai de `fit="contain"` - cat bot la
 * mat la chu, mat kim chi nam va mat chu giai mau.
 */
export const VOP_MASTER_PLAN: MasterPlanSheet[] = [
  { key: 'tong-quan', label: 'Tổng quan', imageUrl: `${IMG}/mat-bang-tong-the-du-an.jpg` },
  { key: 'hai-au', label: 'PK Hải Âu', imageUrl: `${IMG}/mat-bang-phan-khu-hai-au.jpg` },
  { key: 'ngoc-trai', label: 'PK Ngọc Trai', imageUrl: `${IMG}/mat-bang-phan-khu-ngoc-trai.jpg` },
  { key: 'san-ho', label: 'PK San Hô', imageUrl: `${IMG}/mat-bang-phan-khu-san-ho.jpg` },
  { key: 'sao-bien', label: 'PK Sao Biển', imageUrl: `${IMG}/mat-bang-phan-khu-sao-bien.jpg` },
];

/**
 * Ghi de len ban sinh tu dong. Chi liet ke nhung truong co nguon that;
 * cac truong khong co o day (bang hang, chinh sach ban hang, anh 360, tai lieu,
 * tien do, pin gia tren mat bang) van do bo sinh dien - do la phan minh hoa.
 */
export const VOP_DETAIL_OVERRIDE: Partial<ProjectDetail> = {
  description:
    'Vinhomes Ocean Park là đại đô thị quy mô 420 ha tại xã Gia Lâm, phía Đông Hà Nội, do Vingroup phát triển. Khoảng 19% diện tích dành cho xây dựng, phần còn lại là cảnh quan và mặt nước. Điểm nhấn là hồ trung tâm 24,5 ha và biển hồ nước mặn nhân tạo 6,1 ha — hai công trình từng được ghi nhận kỷ lục thế giới. Dự án gồm 66 toà căn hộ cao 23–26 tầng thuộc ba dòng Sapphire, Ruby và Diamond, cùng 2.390 căn thấp tầng chia thành bốn phân khu. Hiện đã có hơn 60.000 cư dân về sinh sống, với hệ tiện ích nội khu gồm Đại học VinUni, bệnh viện Vinmec, Vinschool liên cấp và Vincom Mega Mall.',
  hero,
  stats,
  specs,
  overviewImageUrl: `${IMG}/hero-3-phoi-canh-tong-the.jpg`,
  masterPlan: VOP_MASTER_PLAN,
  products,
  amenities,
  location,
  consultants,
  planMap: VOP_PLAN_MAP,
  panoramas: VOP_PANORAMAS,
  intro: {
    title: 'Giới thiệu dự án',
    body: 'Vinhomes Ocean Park được quy hoạch theo mô hình đô thị tất cả trong một: ở, học, khám chữa bệnh, mua sắm và vui chơi đều nằm trong bán kính đi bộ. Trọng tâm quy hoạch là hai mặt nước lớn — hồ trung tâm 24,5 ha và biển hồ nước mặn 6,1 ha — bao quanh bởi trục cảnh quan và các phân khu thấp tầng.',
    videoThumbnailUrl: `${IMG}/hero-2-bien-ho-nuoc-man.jpg`,
    videoUrl: '',
  },
  closing: {
    title: 'Đô thị đã vận hành, không còn là dự án trên giấy',
    body: 'Khác với phần lớn đại đô thị vùng ven, Vinhomes Ocean Park đã có hơn 60.000 cư dân sinh sống, trường học và trung tâm thương mại đi vào hoạt động. Người mua có thể đến tận nơi kiểm chứng hệ tiện ích thay vì chỉ nhìn phối cảnh.',
    videoThumbnailUrl: `${IMG}/tien-do-duong-dai-duong-1.jpg`,
    videoUrl: '',
  },
};

/** Ten bon phan khu thap tang co that, thay cho ten sinh ngau nhien */
export const VOP_PHASE_NAMES = ['Hải Âu', 'Ngọc Trai', 'San Hô', 'Sao Biển'] as const;

/** Anh dai dien cho tung phan khu, theo dung thu tu VOP_PHASE_NAMES */
export const VOP_PHASE_IMAGES = [
  `${IMG}/hero-5-phan-khu-thap-tang.jpg`,
  `${IMG}/hero-3-phoi-canh-tong-the.jpg`,
  `${IMG}/hero-2-bien-ho-nuoc-man.jpg`,
  `${IMG}/sp-cao-tang-ven-kenh.jpg`,
];
