/**
 * Cac manh giao dien lap lai nhieu lan tren trang chi tiet du an.
 *
 * QUAN TRONG: ten export va chu ky prop cua 7 manh duoi day la GIAO KEO voi ca
 * 11 tab. Doi hinh thuc thoai mai, nhung doi ten hay doi prop la vo het cac tab.
 *
 * Ngon ngu thi giac (ban thiet ke moi):
 *  - Noi dung nam trong the trang co vien mo va bong nhe, thay cho mang mau dac.
 *  - Nhan manh bang GACH MAU ben trai + chu navy, thay cho kieu can giua cu:
 *    mat doc quet theo mot le doc duy nhat nen nhanh hon.
 *  - Mang mau toi chi danh cho panel ke chuyen (JadePanel), va la dai chuyen mau
 *    navy -> jade cho co chieu sau thay vi mot mau xanh phang.
 */
import type { ReactNode } from 'react';
import { FiPlay } from 'react-icons/fi';
import PlaceholderThumb from '@/common/components/PlaceholderThumb';

/**
 * Tieu de muc.
 *
 * Mac dinh can giua kem mot gach mau ngan ben duoi - kieu nay hop voi cac muc
 * ma noi dung ben duoi cung can giua (luoi san pham, luoi tien ich, bang anh).
 *
 * `align="left"` danh cho muc co doan van dai chay theo le trai, luc do tieu de
 * can giua se lam gay le doc cua ca khoi.
 */
export const SectionHeading = ({
  title,
  subtitle,
  align = 'center',
}: {
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
}) => {
  if (align === 'left') {
    return (
      <div className="mb-6 flex items-start gap-3">
        <span aria-hidden className="brand-gradient mt-1 h-9 w-1 shrink-0 rounded-full" />
        <div className="min-w-0">
          <h2 className="text-2xl font-bold tracking-tight text-navy-800 sm:text-3xl">
            {title}
          </h2>
          {subtitle && <p className="mt-1.5 text-base text-gray-500">{subtitle}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 text-center">
      <h2 className="text-2xl font-bold tracking-tight text-navy-800 sm:text-3xl">
        {title}
      </h2>
      <span
        aria-hidden
        className="brand-gradient mx-auto mt-3 block h-1 w-16 rounded-full"
      />
      {subtitle && <p className="mt-3 text-base text-gray-500">{subtitle}</p>}
    </div>
  );
};

/**
 * Panel toi mau cho cac khoi ke chuyen (gioi thieu, thong so, ket bai).
 *
 * Van giu ten JadePanel vi 11 tab dang goi, nhung nen gio la dai chuyen mau
 * navy -> jade kem mot vong vien sang ben trong cho bot phang.
 */
export const JadePanel = ({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) => (
  <section
    className={`relative overflow-hidden rounded-2xl bg-linear-to-br from-navy-800 via-navy-700 to-jade-700 p-6 shadow-panel ring-1 ring-white/10 sm:p-8 ${className}`}
  >
    {/* Quang sang goc tren phai cho mang mau co chieu sau */}
    <span
      aria-hidden
      className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-jade-400/20 blur-3xl"
    />
    <div className="relative">{children}</div>
  </section>
);

/** Tieu de vang ben trong panel toi mau */
export const PanelTitle = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-4 flex items-center gap-2.5 text-lg font-bold text-gold-300">
    <span aria-hidden className="h-5 w-1 shrink-0 rounded-full bg-gold-400" />
    {children}
  </h2>
);

/**
 * Khung anh bo goc giu ti le co dinh.
 * `src` rong -> PlaceholderThumb ve nen gradient co nhan, khong gia lam anh that.
 */
export const MediaFrame = ({
  seed,
  src,
  alt,
  label,
  ratio = 'aspect-16/9',
  fit = 'cover',
  className = '',
}: {
  seed: string;
  src?: string;
  alt: string;
  label?: string;
  ratio?: string;
  /** `contain` cho ban ve mat bang - xem chu thich trong PlaceholderThumb */
  fit?: 'cover' | 'contain';
  className?: string;
}) => (
  <div
    className={`relative ${ratio} w-full overflow-hidden rounded-xl bg-gray-100 ${className}`}
  >
    <PlaceholderThumb seed={seed} src={src || undefined} alt={alt} label={label} fit={fit} />
  </div>
);

/** Lop phu nut play cho cac o video */
export const PlayOverlay = ({ label }: { label: string }) => (
  <span className="absolute inset-0 flex items-center justify-center">
    <span
      aria-hidden
      className="absolute h-16 w-16 rounded-full bg-white/25 blur-md transition group-hover:bg-white/40"
    />
    <span
      className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-jade-700 shadow-card-hover transition duration-300 group-hover:scale-110 group-hover:bg-white"
      aria-hidden
    >
      <FiPlay className="ml-0.5 text-xl" />
    </span>
    <span className="sr-only">{label}</span>
  </span>
);

/** Cham chi so trang cho cac bang chuyen */
export const CarouselDots = ({
  count,
  current,
  onSelect,
  label,
}: {
  count: number;
  current: number;
  onSelect: (index: number) => void;
  label: string;
}) => {
  if (count <= 1) return null;

  return (
    <div
      className="mt-6 flex items-center justify-center gap-2"
      role="tablist"
      aria-label={label}
    >
      {Array.from({ length: count }).map((_, index) => (
        <button
          key={index}
          type="button"
          role="tab"
          aria-selected={index === current}
          aria-label={`Trang ${index + 1}`}
          onClick={() => onSelect(index)}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === current ? 'brand-gradient w-8' : 'w-2 bg-gray-300 hover:bg-gray-400'
          }`}
        />
      ))}
    </div>
  );
};

/** Trang thai rong dung chung cho cac tab chua co du lieu */
export const TabEmptyState = ({ message }: { message: string }) => (
  <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-14 text-center">
    <p className="text-theme-sm text-gray-500">{message}</p>
  </div>
);
