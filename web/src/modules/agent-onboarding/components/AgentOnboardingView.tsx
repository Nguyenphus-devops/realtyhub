'use client';

import OnboardingStepRail from './OnboardingStepRail';
import AdvisorStep from './steps/AdvisorStep';
import CertificateStep from './steps/CertificateStep';
import IdentityStep from './steps/IdentityStep';
import PartnerStep from './steps/PartnerStep';
import WorkAreaStep from './steps/WorkAreaStep';
import { useAgentOnboarding } from '../hooks/useAgentOnboarding';

/**
 * Man hinh "Tro thanh moi gioi": mot the trang chia doi - cot buoc ben trai,
 * noi dung buoc dang lam ben phai. Tren mobile cot buoc xep tren noi dung.
 */
const AgentOnboardingView = () => {
  const { steps, activeId, statusOf, completeStep, goToStep } = useAgentOnboarding();

  const renderStep = () => {
    switch (activeId) {
      case 'khu-vuc':
        return <WorkAreaStep onDone={() => completeStep('khu-vuc')} />;
      case 'nguoi-co-van':
        return <AdvisorStep onDone={() => completeStep('nguoi-co-van')} />;
      case 'dinh-danh':
        return <IdentityStep onDone={() => completeStep('dinh-danh')} />;
      case 'chung-chi':
        return <CertificateStep onDone={() => completeStep('chung-chi')} />;
      case 'doi-tac':
        return <PartnerStep />;
    }
  };

  return (
    // `agent-onboarding` mo bang mau OneHub (dinh nghia trong globals.css) va
    // chi co hieu luc ben trong the nay.
    <div className="agent-onboarding bg-[var(--ob-surface)] py-8">
      <div className="mx-auto w-full max-w-[1045px] px-4">
        <div className="flex min-h-[690px] flex-col overflow-hidden rounded-xl border border-[var(--ob-border-soft)] bg-white lg:flex-row">
          <OnboardingStepRail steps={steps} statusOf={statusOf} onSelect={goToStep} />
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default AgentOnboardingView;
