'use client';

import { useMemo } from 'react';

import type { UtilityAction, UtilitySection } from '../models/utility.model';
import { TONE_CLASSES } from './tones';
import UtilityButton from './UtilityButton';

type UtilitySectionCardProps = {
  section: UtilitySection;
  /** Search keyword - dung de filter actions va highlight match */
  searchKeyword: string;
  onActionClick: (action: UtilityAction) => void;
};

/**
 * 1 khoi chu de lon - card co header (icon + title + subtitle) + grid cac nut.
 *
 * Header co section icon bg với tone color nhe, title bold, subtitle nho.
 *
 * Grid: 2 cot mobile, 3 cot tablet, 4 cot desktop. Neu search keyword ton tai
 * chi render cac actions match.
 */
const UtilitySectionCard = ({ section, searchKeyword, onActionClick }: UtilitySectionCardProps) => {
  const toneCls = TONE_CLASSES[section.tone];

  // Filter + tinh match count
  const { visibleActions, matchCount } = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) {
      return { visibleActions: section.actions, matchCount: section.actions.length };
    }
    const matched = section.actions.filter((a) => {
      if (a.label.toLowerCase().includes(keyword)) return true;
      if (a.description.toLowerCase().includes(keyword)) return true;
      if (a.keywords?.some((k) => k.toLowerCase().includes(keyword))) return true;
      return false;
    });
    return { visibleActions: matched, matchCount: matched.length };
  }, [section.actions, searchKeyword]);

  // Neu search keyword ton tai va khong co action match -> an ca section
  if (searchKeyword && matchCount === 0) return null;

  const isMatched = (a: UtilityAction) => {
    const keyword = searchKeyword.trim().toLowerCase();
    if (!keyword) return false;
    return (
      a.label.toLowerCase().includes(keyword) ||
      a.description.toLowerCase().includes(keyword) ||
      a.keywords?.some((k) => k.toLowerCase().includes(keyword))
    );
  };

  return (
    <section
      aria-labelledby={`section-${section.publicId}`}
      className={`overflow-hidden rounded-2xl border ${toneCls.border} bg-white shadow-theme-xs`}
    >
      {/* Header */}
      <header
        className={`flex items-start gap-3 px-5 py-4 md:gap-4 md:px-6 md:py-5 ${toneCls.sectionBg}`}
      >
        <span
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-theme-xs md:h-12 md:w-12 ${toneCls.sectionIcon}`}
        >
          <section.sectionIcon aria-hidden className="h-5 w-5 md:h-6 md:w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h2
            id={`section-${section.publicId}`}
            className={`text-base font-bold leading-tight md:text-lg ${toneCls.sectionText}`}
          >
            {section.title}
            {searchKeyword && (
              <span className="ml-2 text-theme-xs font-medium opacity-75">
                ({matchCount} kết quả)
              </span>
            )}
          </h2>
          <p className="mt-1 text-theme-xs text-gray-600 md:text-theme-sm">
            {section.subtitle}
          </p>
        </div>
      </header>

      {/* Grid cac nut */}
      <div className="p-4 md:p-6">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:gap-3 lg:grid-cols-4">
          {visibleActions.map((action) => (
            <UtilityButton
              key={action.publicId}
              action={action}
              tone={section.tone}
              highlight={isMatched(action)}
              onClick={onActionClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default UtilitySectionCard;