/**
 * Anh bia tam thoi: sinh gradient tu chinh chuoi `seed` nen moi du an
 * luon ra cung mot mau, khong can file anh nao trong repo.
 * Khi co anh that: truyen `src` -> component render <img> thay vi gradient.
 */

const PALETTES: [string, string, string][] = [
  ['#0e3a6b', '#1c74c4', '#5bb3f0'],
  ['#0b4f4a', '#12866f', '#5fc79f'],
  ['#4a2a6b', '#7a4bb8', '#b489e8'],
  ['#6b3410', '#c2701c', '#f2b04a'],
  ['#0d3b52', '#1a7aa3', '#63c6d9'],
  ['#5a1f33', '#a63a58', '#e08196'],
];

const hashOf = (seed: string) => {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash);
};

type PlaceholderThumbProps = {
  seed: string;
  /** Chu hien giua anh - de trong neu chi can nen mau */
  label?: string;
  src?: string;
  alt?: string;
  
  fit?: 'cover' | 'contain';
  className?: string;
};

const PlaceholderThumb = ({
  seed,
  label,
  src,
  alt,
  fit = 'cover',
  className = '',
}: PlaceholderThumbProps) => {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt ?? label ?? ''}
        className={`h-full w-full ${fit === 'contain' ? 'object-contain' : 'object-cover'} ${className}`}
        loading="lazy"
      />
    );
  }

  const [from, via, to] = PALETTES[hashOf(seed) % PALETTES.length];

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundImage: `linear-gradient(135deg, ${from} 0%, ${via} 55%, ${to} 100%)` }}
      role="img"
      aria-label={alt ?? label ?? 'Ảnh dự án'}
    >
      {/* Lop van mo tao chieu sau cho nen phang */}
      <span
        aria-hidden
        className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl"
      />
      <span
        aria-hidden
        className="absolute -bottom-20 -left-12 h-52 w-52 rounded-full bg-black/20 blur-2xl"
      />

      {label && (
        <span className="relative px-5 text-center text-lg font-bold uppercase leading-tight tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)] sm:text-xl">
          {label}
        </span>
      )}
    </div>
  );
};

export default PlaceholderThumb;
