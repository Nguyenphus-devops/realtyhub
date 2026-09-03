import type { ImgHTMLAttributes } from 'react';

/**
 * Avatar dung chung cho toan app.
 *
 * Quy tac fallback:
 *   1. Co `src` -> <img> (dung the img thuong de tranh 404 crash server
 *      component; Next/Image se force optimize nhung can file that moi
 *      render dung - mat UX neu chua seed avatar).
 *   2. Khong co `src` -> initials gradient (6 mau, hash theo char dau
 *      cua name -> moi user mot to co dinh).
 *
 * Component khong tao state/effect, server-render duoc nguyen ven.
 */

const GRADIENTS = [
  'linear-gradient(135deg, #3a90f2 0%, #0a4785 100%)',
  'linear-gradient(135deg, #17417d 0%, #0b2143 100%)',
  'linear-gradient(135deg, #f79009 0%, #b54708 100%)',
  'linear-gradient(135deg, #12b76a 0%, #027a48 100%)',
  'linear-gradient(135deg, #ee46bc 0%, #9e165f 100%)',
  'linear-gradient(135deg, #7a5af8 0%, #4a1fb8 100%)',
];

const getGradient = (name: string): string => {
  // charCodeAt(0) co the tra 0 neu chuoi rong -> fallback index 0.
  const seed = (name.charCodeAt(0) || 0) % GRADIENTS.length;
  return GRADIENTS[seed];
};

const getInitials = (name: string): string => {
  // Tach thanh cac tu theo khoang trang, lay 1-2 chu cai dau viet hoa.
  // VD: "Nguyen Gia Khang" -> "NK", "khang" -> "K".
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.charAt(0).toUpperCase();
  return `${parts[0]!.charAt(0)}${parts[parts.length - 1]!.charAt(0)}`.toUpperCase();
};

export type UserAvatarProps = {
  /** Ten user - dung de tinh initials + hash gradient. */
  name: string;
  /** URL avatar (tuyet doi hoac duong dan tu public/). Neu undefined -> fallback initials. */
  src?: string;
  /** Pixel size (mac dinh 40). Component luon vuong. */
  size?: number;
  /** Class them ngoai (vi du ring, border). */
  className?: string;
  /** Alt cho <img>. Mac dinh la `name`. */
  alt?: string;
  /** Override imgProps (loading, referrerPolicy...). */
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'className'>;
};

const UserAvatar = ({
  name,
  src,
  size = 40,
  className = '',
  alt,
  imgProps,
}: UserAvatarProps) => {
  const dim = `${size}px`;
  const fontSize = Math.max(14, Math.round(size * 0.4));

  // Chi render <img> neu src la URL that (khac undefined, null, chuoi rong,
  // chuoi whitespace). Neu src co nhung file bi 404, browser van se show
  // broken image icon - vi vay caller nen set avatar undefined neu khong
  // chac chan file ton tai.
  const hasValidSrc = typeof src === 'string' && src.trim().length > 0;

  if (hasValidSrc) {
    return (
      <img
        src={src}
        alt={alt ?? name}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        {...imgProps}
        className={`block shrink-0 rounded-full object-cover ${className}`}
        style={{ width: dim, height: dim, ...(imgProps?.style ?? {}) }}
      />
    );
  }

  return (
    <span
      role="img"
      aria-label={alt ?? name}
      className={`flex shrink-0 items-center justify-center rounded-full font-extrabold text-white ${className}`}
      style={{
        width: dim,
        height: dim,
        background: getGradient(name),
        fontSize,
        letterSpacing: '0.02em',
      }}
    >
      {getInitials(name)}
    </span>
  );
};

export default UserAvatar;