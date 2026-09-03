'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';

import FooterHeading from './FooterHeading';

export type FooterLink = { label: string; href: string };

type FooterLinkListProps = {
  title: string;
  /** Cac muc luon hien */
  links: FooterLink[];
  /** Cac muc nam sau nut "Xem them" - de trong thi khong render nut */
  moreLinks?: FooterLink[];
  className?: string;
};

const LinkRow = ({ link }: { link: FooterLink }) => (
  <li>
    <Link
      href={link.href}
      className="group flex items-start gap-1.5 text-theme-sm text-gray-600 transition hover:text-brand-600"
    >
      <FiChevronRight
        aria-hidden
        className="mt-1 shrink-0 text-brand-400 transition group-hover:translate-x-0.5"
      />
      <span>{link.label}</span>
    </Link>
  </li>
);


const FooterLinkList = ({
  title,
  links,
  moreLinks = [],
  className = '',
}: FooterLinkListProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasMore = moreLinks.length > 0;

  return (
    <div className={className}>
      <FooterHeading>{title}</FooterHeading>

      <ul className="space-y-3">
        {links.map((link) => (
          <LinkRow key={link.href} link={link} />
        ))}
        {isOpen && moreLinks.map((link) => <LinkRow key={link.href} link={link} />)}
      </ul>

      {hasMore && (
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          className="mt-4 inline-flex items-center gap-1.5 text-theme-sm text-gray-600 transition hover:text-brand-600"
        >
          {isOpen ? 'Thu gọn' : 'Xem thêm'}
          <FiChevronDown
            aria-hidden
            className={`transition ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
      )}
    </div>
  );
};

export default FooterLinkList;
