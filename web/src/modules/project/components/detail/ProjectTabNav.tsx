'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  FiBookOpen,
  FiCalendar,
  FiCamera,
  FiFileText,
  FiGlobe,
  FiMapPin,
  FiPhone,
} from 'react-icons/fi';
import {
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineHomeModern,
  HiOutlineNewspaper,
  HiOutlineSquares2X2,
} from 'react-icons/hi2';
import {
  PROJECT_DETAIL_TABS,
  type ProjectConsultant,
  type ProjectDetailTabKey,
} from '../../models/project-detail.model';

/** Icon nam o day chu khong o model: model la hop dong du lieu, khong chua JSX */
const TAB_ICONS: Record<ProjectDetailTabKey, ReactNode> = {
  'tong-quan': <FiGlobe aria-hidden />,
  'vi-tri': <FiMapPin aria-hidden />,
  'phan-khu': <HiOutlineSquares2X2 aria-hidden />,
  'mat-bang-quy-can': <FiBookOpen aria-hidden />,
  'quy-can': <HiOutlineHomeModern aria-hidden />,
  'anh-360': <FiCamera aria-hidden />,
  'dao-tao': <HiOutlineAcademicCap aria-hidden />,
  'chinh-sach-ban-hang': <FiFileText aria-hidden />,
  'tien-do': <FiCalendar aria-hidden />,
  'tai-lieu': <HiOutlineBookOpen aria-hidden />,
  'tin-tuc': <HiOutlineNewspaper aria-hidden />,
};

const telHref = (phone: string) => `tel:${phone.replace(/\s/g, '')}`;

type ProjectTabNavProps = {
  current: ProjectDetailTabKey;
  onChange: (tab: ProjectDetailTabKey) => void;
  consultants: ProjectConsultant[];
};

const ProjectTabNav = ({ current, onChange, consultants }: ProjectTabNavProps) => {
  const listRef = useRef<HTMLUListElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Man hinh hep chi thay 3-4 tab mot luc. Doi tab qua URL (nut Back, link chia
  // se) ma khong keo thanh nay thi tab dang xem nam ngoai tam nhin.
  useEffect(() => {
    const list = listRef.current;
    const active = activeRef.current;
    if (!list || !active) return;

    const offset = active.offsetLeft - list.clientWidth / 2 + active.clientWidth / 2;
    list.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
  }, [current]);

  // Bam ra ngoai hoac Escape thi dong bang so dien thoai
  useEffect(() => {
    if (!isContactOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!contactRef.current?.contains(event.target as Node)) setIsContactOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsContactOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isContactOpen]);

  return (
    // top-16 = dung chieu cao SiteHeader dang dinh o tren, de hai thanh xep sat
    // nhau thay vi de lo mot dai noi dung troi qua giua.
    <nav
      aria-label="Nội dung dự án"
      className="sticky top-16 z-30 border-b border-gray-200 bg-white/90 backdrop-blur-lg"
    >
      <div className="site-container flex items-center gap-3">
        {/* Duoi lg: cuon ngang, vi 11 tab khong the vua man hinh dien thoai.
            Tu lg: `flex-wrap` - danh sach chi chiem phan rong con lai sau nut
            Lien he, va neu van khong du thi tab xuong hang chu khong bi cat.
            Nho vay khong bao gio co tab nao bi nut de len nhu truoc. */}
        <ul
          ref={listRef}
          className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto py-2.5 lg:flex-wrap lg:overflow-x-visible"
        >
          {PROJECT_DETAIL_TABS.map((tab) => {
            const isActive = tab.key === current;

            return (
              <li key={tab.key} className="shrink-0">
                <button
                  ref={isActive ? activeRef : undefined}
                  type="button"
                  onClick={() => onChange(tab.key)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2.5 text-[15px] transition duration-200 ${
                    isActive
                      ? 'brand-gradient font-semibold text-white shadow-[0_4px_14px_-4px_rgba(15,111,209,0.7)]'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-brand-600'
                  }`}
                >
                  {/* Icon chi hien duoi lg. Tu lg tro len phai nhuong ~240px cho
                      11 nhan tab o co chu 16px - nhan da du ro nghia, bo icon la
                      cach re nhat de tat ca tab cung nam mot hang. */}
                  <span
                    className={`lg:hidden ${isActive ? 'text-white' : 'text-gray-400'}`}
                  >
                    {TAB_ICONS[tab.key]}
                  </span>
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Nut lien he gan lien thanh tab: nut goi theo nguoi dung o moi tab ma
            khong chiem mot cot rieng suot chieu dai trang. */}
        {consultants.length > 0 && (
          <div ref={contactRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsContactOpen((open) => !open)}
              aria-expanded={isContactOpen}
              aria-haspopup="true"
              aria-label="Liên hệ tư vấn"
              className="flex items-center gap-2 rounded-full bg-jade-600 px-4 py-2.5 text-[15px] font-bold text-white shadow-[0_4px_14px_-4px_rgba(18,134,111,0.8)] transition duration-200 hover:scale-105 hover:bg-jade-500 active:scale-95"
            >
              <FiPhone aria-hidden />
              {/* Duoi sm chi con icon cho do chat; aria-label o tren lo cho ca
                  hai truong hop nen trinh doc man hinh luon doc du y nghia. */}
              <span className="hidden sm:inline">Liên hệ</span>
            </button>

            {isContactOpen && (
              <div
                role="menu"
                className="animate-chat-in absolute right-0 top-full z-10 mt-2 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-panel"
              >
                <p className="border-b border-gray-100 bg-gray-25 px-4 py-2.5 text-theme-sm font-bold uppercase tracking-wide text-navy-800">
                  Chuyên viên tư vấn
                </p>
                <ul className="divide-y divide-gray-100">
                  {consultants.map((consultant) => (
                    <li key={consultant.publicId}>
                      <a
                        href={telHref(consultant.phone)}
                        role="menuitem"
                        className="block px-4 py-3 transition hover:bg-brand-25"
                      >
                        <span className="block text-theme-sm font-semibold uppercase tracking-wide text-accent-600">
                          {consultant.role}
                        </span>
                        <span className="mt-0.5 block text-base text-gray-600">
                          {consultant.name}
                        </span>
                        <span className="mt-1 flex items-center gap-1.5 text-base font-bold text-jade-600">
                          <FiPhone aria-hidden />
                          {consultant.phone}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default ProjectTabNav;
