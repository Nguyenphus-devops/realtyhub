import type { SVGProps } from 'react';

/**
 * Duong dan tai ung dung.
 *
 * CHUA CO ung dung that - thay hai duong dan nay bang link cua hang khi phat
 * hanh. De o day de doi mot cho la xong.
 */
const APP_LINKS = {
  android: '#',
  ios: '#',
};

/**
 * Icon Google Play chinh chu: bon manh, moi manh mot dai mau rieng. Ve bang
 * gradient chu khong phai mau phang - do la cach hang ve, to phang se nhin ra
 * ngay la hang nhai.
 */
const GooglePlayIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 512 512" role="img" aria-hidden focusable="false" {...props}>
    <defs>
      <linearGradient id="gp-body" x1="31%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00a0ff" />
        <stop offset="100%" stopColor="#00e3ff" />
      </linearGradient>
      <linearGradient id="gp-top" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00e676" />
        <stop offset="100%" stopColor="#00c853" />
      </linearGradient>
      <linearGradient id="gp-tip" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffe000" />
        <stop offset="100%" stopColor="#ff9c00" />
      </linearGradient>
      <linearGradient id="gp-bottom" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff3a44" />
        <stop offset="100%" stopColor="#c31162" />
      </linearGradient>
    </defs>

    {/* Song luoi trai - phan than tam giac */}
    <path
      fill="url(#gp-body)"
      d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.4c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z"
    />
    {/* Nua tren */}
    <path fill="url(#gp-top)" d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" />
    {/* Mui nhon ben phai */}
    <path
      fill="url(#gp-tip)"
      d="M472.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8z"
    />
    {/* Nua duoi */}
    <path fill="url(#gp-bottom)" d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
  </svg>
);

const AppleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 384 512" role="img" aria-hidden focusable="false" {...props}>
    <path
      fill="currentColor"
      d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
    />
  </svg>
);


type Variant = 'dark' | 'light';

const VARIANT_CLASSES: Record<Variant, string> = {
  dark: 'bg-black text-white ring-1 ring-white/20 hover:ring-white/45',
  light: 'bg-white text-gray-900 ring-1 ring-gray-300 hover:ring-gray-400 hover:shadow-card',
};

type BadgeProps = {
  href: string;
  /** Dong nho phia tren - giu nguyen tieng Anh theo quy cach cua hang */
  caption: string;
  /** Ten cua hang, dong chu lon */
  store: string;
  variant: Variant;
  children: React.ReactNode;
};

const Badge = ({ href, caption, store, variant, children }: BadgeProps) => (
  <a
    href={href}
    aria-label={`${caption} ${store}`}
    className={`flex h-12 min-w-40 items-center gap-2.5 rounded-lg px-3.5 transition ${VARIANT_CLASSES[variant]}`}
  >
    {children}
    <span className="flex flex-col items-start leading-none">
      <span className="text-[9px] tracking-tight">{caption}</span>
      <span className="mt-0.5 text-lg font-semibold leading-tight tracking-tight">
        {store}
      </span>
    </span>
  </a>
);

/**
 * Huy hieu tai ung dung, dung theo dung quy cach cua Google va Apple: icon
 * chinh chu va cum chu tieng Anh co dinh ("GET IT ON" / "Download on the").
 * Hai chu do la mot phan cua huy hieu - dich sang tieng Viet la sai quy cach,
 * nen o day co tinh khong dich.
 */
const AppStoreBadges = ({ variant = 'dark' }: { variant?: Variant }) => (
  <div className="flex flex-wrap items-center gap-3">
    <Badge href={APP_LINKS.ios} caption="Download on the" store="App Store" variant={variant}>
      <AppleIcon className="h-7 w-7 shrink-0" />
    </Badge>

    <Badge href={APP_LINKS.android} caption="GET IT ON" store="Google Play" variant={variant}>
      <GooglePlayIcon className="h-6 w-6 shrink-0" />
    </Badge>
  </div>
);

export default AppStoreBadges;
