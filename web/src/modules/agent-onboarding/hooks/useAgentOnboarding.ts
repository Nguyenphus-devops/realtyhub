'use client';

import { useCallback, useMemo, useState } from 'react';
import { MOCK_STEPS } from '../mocks/agent-onboarding.mock';
import type {
  OnboardingStep,
  OnboardingStepId,
  OnboardingStepStatus,
} from '../models/agent-onboarding.model';

/**
 * Tien do cua luong onboarding.
 *
 * Danh sach buoc la hang so hien thi nen lay thang tu mock cho lan ve dau
 * (tranh mot nhip loading cho cai khong bao gio doi); moi thu can goi may chu
 * deu di qua `AgentOnboardingService` trong tung buoc.
 *
 * Chi cho phep quay lai buoc da xong - buoc chua toi luot van khoa, giong ban goc.
 */
export const useAgentOnboarding = (steps: OnboardingStep[] = MOCK_STEPS) => {
  const [completed, setCompleted] = useState<OnboardingStepId[]>([]);
  const [activeId, setActiveId] = useState<OnboardingStepId>(steps[0].id);

  const statusOf = useCallback(
    (id: OnboardingStepId): OnboardingStepStatus => {
      if (id === activeId) return 'current';
      return completed.includes(id) ? 'done' : 'locked';
    },
    [activeId, completed],
  );

  /** Nop xong mot buoc: danh dau hoan thanh roi nhay sang buoc ke tiep. */
  const completeStep = useCallback(
    (id: OnboardingStepId) => {
      setCompleted((prev) => (prev.includes(id) ? prev : [...prev, id]));
      const next = steps[steps.findIndex((step) => step.id === id) + 1];
      if (next) setActiveId(next.id);
    },
    [steps],
  );

  const goToStep = useCallback(
    (id: OnboardingStepId) => {
      if (id === activeId || completed.includes(id)) setActiveId(id);
    },
    [activeId, completed],
  );

  const activeStep = useMemo(
    () => steps.find((step) => step.id === activeId) ?? steps[0],
    [activeId, steps],
  );

  return { steps, activeStep, activeId, statusOf, completeStep, goToStep };
};
