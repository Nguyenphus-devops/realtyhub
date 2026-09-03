'use client';

import { useState } from 'react';
import StepPanel from '../StepPanel';
import { TextField, UploadBox } from '../FormField';
import { AgentOnboardingService } from '../../services/agent-onboarding.service';

/**
 * Buoc 4 - chung chi hanh nghe moi gioi.
 *
 * NOTE: buoc nay tren trang goc bi khoa, noi dung dung theo mo ta cua buoc.
 */
const CertificateStep = ({ onDone }: { onDone: () => void }) => {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [issuedPlace, setIssuedPlace] = useState('');
  const [issuedDate, setIssuedDate] = useState('');
  const [fileName, setFileName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    const result = await AgentOnboardingService.submitCertificate({
      certificateNumber,
      issuedPlace,
      issuedDate,
      fileName,
    });
    setSubmitting(false);
    if (result.success) onDone();
    else setError(result.message);
  };

  return (
    <StepPanel
      titleAccent="Chứng chỉ"
      titleRest=" hành nghề môi giới"
      hint="Chứng chỉ hành nghề là điều kiện bắt buộc để ký hợp đồng hợp tác và nhận hoa hồng theo quy định"
      submitLabel="Gửi chứng chỉ hành nghề"
      canSubmit={Boolean(certificateNumber && fileName)}
      submitting={submitting}
      onSubmit={handleSubmit}
      error={error}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Số chứng chỉ"
          value={certificateNumber}
          onChange={setCertificateNumber}
          placeholder="CC-2024-xxxxx"
        />
        <TextField
          label="Nơi cấp"
          value={issuedPlace}
          onChange={setIssuedPlace}
          placeholder="Sở Xây dựng Hà Nội"
        />
        <TextField label="Ngày cấp" value={issuedDate} onChange={setIssuedDate} type="date" />
      </div>

      <UploadBox label="Bản scan chứng chỉ" fileName={fileName} onPick={setFileName} />
    </StepPanel>
  );
};

export default CertificateStep;
