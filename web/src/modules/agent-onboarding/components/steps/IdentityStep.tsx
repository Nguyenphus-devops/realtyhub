'use client';

import { useState } from 'react';
import StepPanel from '../StepPanel';
import { TextField, UploadBox } from '../FormField';
import { AgentOnboardingService } from '../../services/agent-onboarding.service';

/**
 * Buoc 3 - xac thuc dinh danh dien tu (eKYC).
 *
 * NOTE: buoc nay tren trang goc bi khoa, noi dung dung theo mo ta cua buoc.
 */
const IdentityStep = ({ onDone }: { onDone: () => void }) => {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [frontImageName, setFrontImageName] = useState('');
  const [backImageName, setBackImageName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    const result = await AgentOnboardingService.submitIdentity({
      fullName,
      idNumber,
      frontImageName,
      backImageName,
    });
    setSubmitting(false);
    if (result.success) onDone();
    else setError(result.message);
  };

  return (
    <StepPanel
      titleAccent="Xác thực"
      titleRest=" định danh điện tử"
      hint="Xác thực định danh giúp hồ sơ của bạn được duyệt nhanh hơn và đủ điều kiện nhận hoa hồng"
      submitLabel="Gửi hồ sơ định danh"
      canSubmit={Boolean(fullName && idNumber && frontImageName && backImageName)}
      submitting={submitting}
      onSubmit={handleSubmit}
      error={error}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Họ và tên trên CCCD"
          value={fullName}
          onChange={setFullName}
          placeholder="Nguyễn Văn A"
        />
        <TextField
          label="Số CCCD"
          value={idNumber}
          onChange={setIdNumber}
          placeholder="0010xxxxxxxx"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <UploadBox label="Mặt trước CCCD" fileName={frontImageName} onPick={setFrontImageName} />
        <UploadBox label="Mặt sau CCCD" fileName={backImageName} onPick={setBackImageName} />
      </div>
    </StepPanel>
  );
};

export default IdentityStep;
