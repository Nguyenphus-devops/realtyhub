import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineUserGroup } from 'react-icons/hi2';
import { FaFacebookF, FaTiktok, FaYoutube } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import AppStoreBadges from '@/common/components/AppStoreBadges';
import FooterHeading from '@/common/layout/FooterHeading';
import FooterLinkList from '@/common/layout/FooterLinkList';


const POPULAR_SEARCHES = [
  'Giỏ hàng mới',
  'Căn hộ giá tốt',
  'Căn hộ dưới 3 tỷ',
  'Căn hộ 2PN',
  'Dự án mới mở bán',
  'Bảng giá dự án',
  'Giá bán mới nhất',
  'Chính sách bán hàng',
  'Chiết khấu',
  'Hỗ trợ vay ngân hàng',
  'Pháp lý dự án',
  'Tiến độ dự án',
  'Ngày bàn giao',
  'Hàng chủ đầu tư',
  'Căn hộ 2PN dưới 3 tỷ tại Bình Dương',
  'Nhà phố',
  'Shophouse',
  'Biệt thự',
  'Căn hộ cho thuê',
  'Đầu tư căn hộ',
  'So sánh dự án',
  'Tính khoản vay',
  'Eco Retreat Long An',
  'So sánh chính sách',
];

const ABOUT_LINKS = [
  { label: 'Giới thiệu', href: '/gioi-thieu' },
  { label: 'Điều khoản sử dụng', href: '/dieu-khoan-su-dung' },
  { label: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat' },
  { label: 'Liên hệ', href: '/lien-he-chung-toi' },
];

const BROKER_LINKS = [
  { label: 'Trở thành môi giới', href: '/tro-thanh-moi-gioi' },
  { label: 'Giỏ hàng BĐS', href: '/gio-hang' },
  { label: 'Đào tạo', href: '/dao-tao' },
  { label: 'Hướng dẫn sử dụng', href: '/huong-dan' },
  { label: 'So sánh chính sách', href: '/so-sanh-chinh-sach' },
];

/** Nam sau nut "Xem thêm" cua cot "Danh cho moi gioi" - deu la route da co */
const BROKER_MORE_LINKS = [
  { label: 'Sự kiện', href: '/su-kien' },
  { label: 'Tin tức', href: '/tin-tuc' },
  { label: 'Góp ý & phản hồi', href: '/gop-y-va-phan-hoi' },
];

const OTHER_LINKS = [
  { label: 'Điểm tích lũy VIP', href: '/diem-tich-luy-vip' },
  { label: 'Lịch sử mua hàng', href: '/lich-su-mua-hang' },
  { label: 'Bán hàng doanh nghiệp', href: '/ban-hang-doanh-nghiep' },
  { label: 'Đăng ký bán hàng CTV', href: '/dang-ky-ban-hang-ctv' },
  { label: 'Chính sách bảo hành', href: '/chinh-sach-bao-hanh' },
  { label: 'Chính sách đổi trả', href: '/chinh-sach-doi-tra' },
  { label: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat' },
];

/** Nam sau nut "Xem thêm" cua cot "Thong tin khac" - deu la route da co */
const OTHER_MORE_LINKS = [
  { label: 'Tiện ích', href: '/tien-ich' },
  { label: 'So sánh dự án', href: '/so-sanh' },
];

/**
 * CHUA CO duong dan that - dat '#' theo dung cach APP_LINKS trong
 * AppStoreBadges dang lam, thay bang URL that khi co.
 *
 * `stat` la con so trong ban thiet ke. Doi so o day la doi ca chan trang.
 */
const SOCIAL_LINKS = [
  {
    label: 'Facebook',
    stat: '56k follow',
    href: '#',
    color: '#1877F2',
    icon: <FaFacebookF aria-hidden />,
  },
  {
    label: 'YouTube',
    stat: '12k follow',
    href: '#',
    color: '#FF0000',
    icon: <FaYoutube aria-hidden />,
  },
  {
    label: 'TikTok',
    stat: '14k follow',
    href: '#',
    color: '#111827',
    icon: <FaTiktok aria-hidden />,
  },
  { label: 'Zalo', stat: 'Zalo', href: '#', color: '#0068FF', icon: <SiZalo aria-hidden /> },
];

/** Website cung tap doan - logo lay tu trang chinh chu cua tung don vi. */
const GROUP_SITES = [
  {
    name: 'Đông Tây Land',
    note: 'A member of Dong Tay Group',
    href: 'https://dongtayland.vn',
    logo: '/images/home/logo-dong-tay-land.png',
    width: 131,
    height: 60,
  },
  {
    name: 'Le Palmier Hồ Tràm',
    note: 'Hotels & Resorts',
    href: 'https://lepalmier.vn',
    logo: '/images/home/logo-le-palmier.png',
    width: 114,
    height: 70,
  },
];


const CERTIFICATIONS: {
  label: string;
  href: string;
  src?: string;
  width?: number;
  height?: number;
}[] = [
  {
    label: 'Đã thông báo Bộ Công Thương',
    href: '#',
    src: '/images/home/Bo_Cong_Thuong.jpg',
    width: 767,
    height: 263,
  },
  {
    label: 'DMCA Protected',
    href: '#',
    src: '/images/home/DMCA.jpg',
    width: 250,
    height: 125,
  },
];

/** Thong tin dang ky doanh nghiep - lay tu giay phep, khong duoc tu doi. */
const COMPANY = {
  name: 'Công ty Cổ phần Đông Tây Land',
  license: '0312312011',
  firstRegistered: '05/06/2013',
  address: '192 Trần Não, Khu Phố 2, Phường An Khánh, Thành phố Hồ Chí Minh, Việt Nam',
  phone: '08.73087777',
  phoneHref: 'tel:+842873087777',
  email: 'info@realtyhub.com.vn',
  representative: 'Ông Nguyễn Thái Bình – Chủ Tịch Hội Đồng Quản Trị',
};

const SiteFooter = () => (
  <footer className="border-t border-gray-200 bg-white">
    {/* ── Tu khoa tim nhieu ─────────────────────────────────────────────
        Dong khung thanh mot the rieng dat tren cung, tach han khoi cac cot
        lien ket ben duoi: day la dieu huong tim kiem, khong phai chan trang. */}
    <div className="site-container pt-10">
      <section
        aria-labelledby="footer-popular"
        className="rounded-2xl border border-gray-200 bg-gray-25 px-5 py-5 md:px-7 md:py-6"
      >
        <h2
          id="footer-popular"
          className="mb-4 flex items-center gap-2.5 text-theme-sm font-bold uppercase tracking-wide text-navy-800"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-lg text-brand-500">
            <HiOutlineUserGroup aria-hidden />
          </span>
          Mọi người cùng tìm kiếm
        </h2>

        <ul className="flex flex-wrap gap-2">
          {POPULAR_SEARCHES.map((keyword) => (
            <li key={keyword}>
              <Link
                href={`/gio-hang?q=${encodeURIComponent(keyword)}`}
                className="inline-flex rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-theme-sm text-gray-600 transition hover:border-brand-300 hover:bg-brand-25 hover:text-brand-600"
              >
                {keyword}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>

    {/* ── Cac cot lien ket ──────────────────────────────────────────────
        Luoi 12 cot: 3 cho thuong hieu (du rong cho doan mo ta), 2 cho moi cot
        lien ket, 3 cho khoi tap doan. Moi cot PHAI tu khai bao span - thieu
        la roi ve 1/12 va nhan bi vo tung chu mot. */}
    <div className="site-container grid grid-cols-1 gap-x-8 gap-y-10 py-12 sm:grid-cols-2 lg:grid-cols-12">
      <div className="sm:col-span-2 lg:col-span-3">
        <Link href="/" aria-label="Trang chủ" className="mb-5 inline-block">
          <Image
            src="/images/home/realtyhub_new.svg"
            alt="RealtyHub"
            width={180}
            height={46}
            className="h-11 w-auto"
          />
        </Link>

        <p className="mb-7 max-w-sm text-theme-sm leading-relaxed text-gray-600">
          Nền tảng công nghệ dành riêng cho môi giới bất động sản, cung cấp
          thông tin dự án và công cụ hỗ trợ kinh doanh hiệu quả.
        </p>

        <p className="mb-3 text-theme-sm font-bold uppercase tracking-wide text-navy-800">
          Tải ứng dụng
        </p>
        {/* Nen chan trang la mau trang nen huy hieu phai dung ban vien sang;
            ban den goc chi hop khi nen dam. */}
        <AppStoreBadges variant="light" />
      </div>

      <FooterLinkList title="Về Realty Hub" links={ABOUT_LINKS} className="lg:col-span-2" />
      <FooterLinkList
        title="Dành cho môi giới"
        links={BROKER_LINKS}
        moreLinks={BROKER_MORE_LINKS}
        className="lg:col-span-2"
      />
      <FooterLinkList
        title="Thông tin khác"
        links={OTHER_LINKS}
        moreLinks={OTHER_MORE_LINKS}
        className="lg:col-span-2"
      />

      <div className="sm:col-span-2 lg:col-span-3">
        <FooterHeading>Website cùng tập đoàn</FooterHeading>

        {/* The logo: ghim chieu cao anh de hai logo khac ti le van thang hang,
            ten don vi chi con o `alt` va tooltip - de ca chu lan logo la doc
            hai lan cung mot thong tin. */}
        <ul className="mb-7 grid gap-3 sm:grid-cols-2">
          {GROUP_SITES.map((site) => (
            <li key={site.name}>
              <a
                href={site.href}
                target="_blank"
                rel="noreferrer noopener"
                title={`${site.name} - ${site.note}`}
                className="flex h-full items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-4 transition hover:border-brand-300 hover:shadow-card"
              >
                <Image
                  src={site.logo}
                  alt={site.name}
                  width={site.width}
                  height={site.height}
                  className="h-10 w-auto"
                />
              </a>
            </li>
          ))}
        </ul>

        {/* Ke ngang tach khoi doi tac voi khoi mang xa hoi, giong ban thiet ke */}
        <div className="mb-5 border-t border-gray-200" />

        {/* Icon vuong bo goc mang mau nhan dien cua tung nen tang, chu dat ben
            canh. Mau truyen qua bien CSS `--tone` chu khong ghep thang vao ten
            class: Tailwind quet class luc build nen `bg-${color}` ghep dong se
            khong bao gio duoc sinh ra CSS. */}
        <ul className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3">
          {SOCIAL_LINKS.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                aria-label={social.label}
                style={{ '--tone': social.color } as React.CSSProperties}
                className="group flex items-center gap-2 text-theme-sm text-gray-600 transition hover:text-(--tone)"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-(--tone) text-xs text-white transition group-hover:scale-110">
                  {social.icon}
                </span>
                {social.stat}
              </a>
            </li>
          ))}
        </ul>

        <ul className="flex flex-wrap items-center gap-3">
          {CERTIFICATIONS.map((cert) => (
            <li key={cert.label}>
              <a
                href={cert.href}
                aria-label={cert.label}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center rounded-md transition hover:opacity-80"
              >
                {cert.src ? (
                  // Ghim chieu cao (h-13 = 52px), be ngang tu chay theo ti le:
                  // hai huy hieu co ti le rat lech nhau (2.92 va 2.00) nen chi
                  // co ghim chieu cao moi cho ra mot hang thang deu.
                  <Image
                    src={cert.src}
                    alt={cert.label}
                    width={cert.width ?? 0}
                    height={cert.height ?? 0}
                    className="h-13 w-auto"
                  />
                ) : (
                  <span className="rounded-md border border-dashed border-gray-300 bg-gray-25 px-3 py-2.5 text-theme-xs font-semibold uppercase tracking-wide text-gray-400">
                    {cert.label}
                  </span>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>

    {/* ── Thong tin dang ky doanh nghiep ───────────────────────────────
        Chay thanh doan van xuoi nhu ban thiet ke, khong ke bang: day la thong
        tin bat buoc theo luat, doc lien mach de hon la nhoi vao o. */}
    <div className="border-t border-gray-200 bg-gray-25">
      <div className="site-container space-y-1.5 py-6 text-theme-xs leading-relaxed text-gray-500">
        <p>
          © 2026.{' '}
          <span className="font-semibold uppercase text-gray-700">{COMPANY.name}.</span>{' '}
          GPĐKKD: {COMPANY.license}, đăng ký lần đầu ngày {COMPANY.firstRegistered}.
        </p>
        <p>
          Địa chỉ: {COMPANY.address}. Điện thoại:{' '}
          <a href={COMPANY.phoneHref} className="transition hover:text-brand-600">
            {COMPANY.phone}
          </a>
          . Email:{' '}
          <a href={`mailto:${COMPANY.email}`} className="transition hover:text-brand-600">
            {COMPANY.email}
          </a>
        </p>
        <p>
          Người đại diện theo pháp luật: {COMPANY.representative}.{' '}
          <Link
            href="/dieu-khoan-su-dung"
            className="font-semibold text-brand-600 transition hover:text-brand-700"
          >
            Xem chính sách sử dụng
          </Link>
        </p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
