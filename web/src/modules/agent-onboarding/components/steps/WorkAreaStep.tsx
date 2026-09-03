'use client';

import { useEffect, useState } from 'react';
import ChoiceChip from '../ChoiceChip';
import StepPanel from '../StepPanel';
import { AgentOnboardingService } from '../../services/agent-onboarding.service';
import type { WorkAreaOptions } from '../../models/agent-onboarding.model';

/**
 * Buoc 1 - khu vuc hoat dong.
 * Loai hinh BDS chon duoc nhieu, khu vuc chi duoc 01 (dung nhu ban goc).
 */
const WorkAreaStep = ({ onDone }: { onDone: () => void }) => {
  const [options, setOptions] = useState<WorkAreaOptions | null>(null);
  const [propertyTypeIds, setPropertyTypeIds] = useState<string[]>([]);
  const [areaId, setAreaId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    AgentOnboardingService.workAreaOptions().then((data) => {
      if (!cancelled) setOptions(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const togglePropertyType = (id: string) =>
    setPropertyTypeIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    const result = await AgentOnboardingService.submitWorkArea({ propertyTypeIds, areaId });
    setSubmitting(false);
    if (result.success) onDone();
    else setError(result.message);
  };

  return (
    <StepPanel
      titleAccent="Khu vực"
      titleRest=" hoạt động"
      hint="Chọn khu vực hoạt động để được hỗ trợ nhanh chóng và đảm bảo giao dịch an toàn, minh bạch"
      submitLabel="Đăng ký khu vực hoạt động"
      canSubmit={propertyTypeIds.length > 0 && Boolean(areaId)}
      submitting={submitting}
      onSubmit={handleSubmit}
      error={error}
    >
      <div>
        <p className="mb-3 text-theme-sm font-medium text-[var(--ob-ink)]">
          Chọn các loại hình BĐS thế mạnh của bạn
        </p>
        <div className="flex flex-wrap gap-2">
          {options?.propertyTypes.map((option) => (
            <ChoiceChip
              key={option.id}
              label={option.label}
              selected={propertyTypeIds.includes(option.id)}
              onToggle={() => togglePropertyType(option.id)}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-theme-sm font-medium text-[var(--ob-ink)]">
          Chọn 01 khu vực bạn mong muốn hoạt động
        </p>
        <div className="flex flex-wrap gap-2">
          {options?.areas.map((option) => (
            <ChoiceChip
              key={option.id}
              label={option.label}
              selected={areaId === option.id}
              // Chon lai chinh no thi bo chon - de sua khi bam nham.
              onToggle={() => setAreaId((prev) => (prev === option.id ? '' : option.id))}
            />
          ))}
        </div>
      </div>
    </StepPanel>
  );
};

export default WorkAreaStep;
