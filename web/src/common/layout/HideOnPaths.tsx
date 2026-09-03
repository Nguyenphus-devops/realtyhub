'use client';

import { usePathname } from 'next/navigation';


const HideOnPaths = ({
  paths,
  children,
}: {
  /** Khop chinh xac hoac khop tien to, vi du '/tin-nhan' bat ca '/tin-nhan/1' */
  paths: string[];
  children: React.ReactNode;
}) => {
  const pathname = usePathname();

  const isHidden = paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  return isHidden ? null : <>{children}</>;
};

export default HideOnPaths;
