'use client';

import type { UtilityAction } from '../models/utility.model';
import { TONE_CLASSES } from './tones';
import type { UtilityTone } from '../models/utility.model';

type UtilityButtonProps = {
  action: UtilityAction;
  tone: UtilityTone;
  /** Search keyword de highlight border khi match */
  highlight?: boolean;
  onClick: (action: UtilityAction) => void;
};

/**
 * Mot nut tinh nang nho ben trong 1 khoi.
 *
 * UI theo yeu cau:
 *   - Card trang, rounded-xl, shadow nhe, border
 *   - Icon flat (h-8 w-8) cung tone voi khoi
 *   - Label text-theme-xs font-semibold text-gray-800
 *   - Hover: lift -translate-y-0.5, border tone, icon bg + text trang
 *
 * Accessibility:
 *   - role=button (native button)
 *   - aria-label gom label + description de screen reader biet tinh nang
 */
const UtilityButton = ({ action, tone, highlight, onClick }: UtilityButtonProps) => {
  const toneCls = TONE_CLASSES[tone];

  return (
    <button
      type="button"
      onClick={() => onClick(action)}
      aria-label={`${action.label}: ${action.description}`}
      title={action.description}
      className={`group relative flex flex-col items-center gap-2 rounded-xl border bg-white px-3 py-4 text-center shadow-theme-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-theme-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${toneCls.border} ${toneCls.buttonHoverBg} ${toneCls.buttonHoverText} ${highlight ? `${toneCls.highlightRing} ring-2` : ''}`}
    >
      <span
        className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-xl transition-colors ${toneCls.buttonBg} ${toneCls.buttonIcon} group-hover:bg-white/20 group-hover:text-white`}
      >
        <action.icon aria-hidden />
      </span>
      <span className={`text-theme-xs font-semibold leading-tight ${toneCls.buttonText} group-hover:text-white`}>
        {action.label}
      </span>
    </button>
  );
};

export default UtilityButton;