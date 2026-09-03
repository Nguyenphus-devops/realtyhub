'use client';

import type { ReactNode } from 'react';
import { FiBookOpen, FiFileText, FiGlobe, FiMapPin } from 'react-icons/fi';
import { HiOutlineHomeModern } from 'react-icons/hi2';
import {
  PHASE_DETAIL_TABS,
  type PhaseDetailTabKey,
} from '../../models/project-detail.model';

const TAB_ICONS: Record<PhaseDetailTabKey, ReactNode> = {
  'tong-quan': <FiGlobe aria-hidden />,
  'vi-tri': <FiMapPin aria-hidden />,
  'mat-bang-quy-can': <FiBookOpen aria-hidden />,
  'quy-can': <HiOutlineHomeModern aria-hidden />,
  'chinh-sach-ban-hang': <FiFileText aria-hidden />,
};

type PhaseTabNavProps = {
  current: PhaseDetailTabKey;
  onChange: (tab: PhaseDetailTabKey) => void;
};

const PhaseTabNav = ({ current, onChange }: PhaseTabNavProps) => (
  <nav aria-label="Nội dung phân khu">
    <ul className="site-container no-scrollbar flex items-stretch justify-start gap-0 overflow-x-auto lg:justify-center">
      {PHASE_DETAIL_TABS.map((tab, index) => {
        const isActive = tab.key === current;

        return (
          <li key={tab.key} className="flex shrink-0 items-center">
            {index > 0 && <span aria-hidden className="mx-1 h-4 w-px bg-gray-200" />}

            <button
              type="button"
              onClick={() => onChange(tab.key)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-2.5 py-3 text-theme-sm transition ${
                isActive
                  ? 'border-accent-500 font-semibold text-accent-600'
                  : 'border-transparent text-gray-700 hover:text-brand-600'
              }`}
            >
              <span className={isActive ? 'text-accent-500' : 'text-gray-400'}>
                {TAB_ICONS[tab.key]}
              </span>
              {tab.label}
            </button>
          </li>
        );
      })}
    </ul>
  </nav>
);

export default PhaseTabNav;
