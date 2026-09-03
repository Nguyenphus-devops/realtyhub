'use client';

import { useEffect, useState } from 'react';
import { FiArrowUp } from 'react-icons/fi';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!isVisible) return null;

  return (
    // bottom-36 chu khong phai bottom-6: stack tinh tu duoi len gom
    //   - bottom-0: thanh tabs (mobile, cao 56px)
    //   - bottom-20: nut chatbot (mobile, cao 56px, z-40)
    //   - bottom-36: nut BackToTop (z-30, cao 44px)
    // Tren desktop khong co tabs va chatbot o bottom-6 -> bottom-24
    // (~96px) de tranh chatbot nhung van gan goc phai.
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Lên đầu trang"
      className="fixed bottom-36 right-6 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-brand-500 text-white shadow-card-hover transition hover:bg-brand-600 sm:bottom-24"
    >
      <FiArrowUp aria-hidden />
    </button>
  );
};

export default BackToTop;
