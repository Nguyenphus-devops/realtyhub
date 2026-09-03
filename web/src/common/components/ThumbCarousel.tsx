'use client';

import { useEffect, useState } from 'react';
import PlaceholderThumb from './PlaceholderThumb';

/** Bao lau doi mot anh khi khong ai dong den */
const AUTOPLAY_MS = 3000;

type ThumbCarouselProps = {
  /** Hat giong cho anh thay the khi chua co anh that */
  seed: string;
  images: string[];
  alt: string;
  /** Tam dung tu chuyen - the dang duoc ro chuot chang han */
  paused?: boolean;
  className?: string;
};

/**
 * Bang anh tu chuyen canh cho the du an.
 *
 * Chay het luot anh cua du an, 3 giay mot tam. KHONG co cham dieu huong: mot
 * du an that co the co hang chuc anh, luc do day cham vua chat vua vo nghia -
 * cu de anh chay het la du. Ro chuot len the thi tam dung (prop `paused`) de
 * con kip nhin.
 *
 * Cac anh xep chong len nhau va chuyen bang do mo chu khong truot ngang: the
 * nam trong luoi, truot ngang se de lo mep anh ben canh luc dang chay.
 */
const ThumbCarousel = ({
  seed,
  images,
  alt,
  paused = false,
  className = '',
}: ThumbCarouselProps) => {
  const [index, setIndex] = useState(0);

  // Danh sach rong van phai ve mot khung, de PlaceholderThumb lo phan anh thay the
  const slides = images.length > 0 ? images : [''];
  const canPlay = slides.length > 1 && !paused;

  // Dung ban cap nhat theo ham thay vi doc `index`: de `index` vao mang phu
  // thuoc se lam dong ho bi dat lai sau MOI lan doi anh, khong con dung 3 giay.
  const count = slides.length;

  useEffect(() => {
    if (!canPlay) return;

    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % count),
      AUTOPLAY_MS,
    );
    return () => window.clearInterval(timer);
  }, [canPlay, count]);

  // Bo loc doi thi so anh doi theo - dung de con tro chi ra ngoai danh sach
  if (index >= slides.length) setIndex(0);

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {slides.map((src, slideIndex) => (
        <div
          key={`${src}-${slideIndex}`}
          aria-hidden={slideIndex !== index}
          className={`absolute inset-0 transition-opacity duration-700 ${
            slideIndex === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <PlaceholderThumb
            seed={`${seed}-${slideIndex}`}
            src={src || undefined}
            alt={slideIndex === index ? alt : ''}
          />
        </div>
      ))}

    </div>
  );
};

export default ThumbCarousel;
