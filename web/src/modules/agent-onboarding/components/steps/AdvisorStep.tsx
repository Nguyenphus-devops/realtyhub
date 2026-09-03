'use client';

import { useEffect, useState } from 'react';
import { FiCheck, FiSearch } from 'react-icons/fi';
import StepPanel from '../StepPanel';
import { AgentOnboardingService } from '../../services/agent-onboarding.service';
import type { Advisor } from '../../models/agent-onboarding.model';

/**
 * Buoc 2 - nguoi co van.
 *
 * NOTE: buoc nay tren trang goc bi khoa cho den khi hoan tat buoc 1, nen noi
 * dung o day dung theo mo ta cua buoc chu chua doi chieu duoc voi ban that.
 */
const AdvisorStep = ({ onDone }: { onDone: () => void }) => {
  const [keyword, setKeyword] = useState('');
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  // Tach "chua tai xong" khoi "tai xong nhung rong", neu khong danh sach se
  // loe len dong "khong tim thay" ngay truoc khi ket qua ve.
  const [loaded, setLoaded] = useState(false);
  const [advisorId, setAdvisorId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Cho go xong roi moi tim, tranh ban mot loat request theo tung phim.
    const timer = setTimeout(() => {
      AgentOnboardingService.advisors(keyword).then((data) => {
        if (cancelled) return;
        setAdvisors(data);
        setLoaded(true);
      });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [keyword]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    const result = await AgentOnboardingService.submitAdvisor({ advisorId });
    setSubmitting(false);
    if (result.success) onDone();
    else setError(result.message);
  };

  return (
    <StepPanel
      titleAccent="Người"
      titleRest=" cố vấn"
      hint="Chọn người cố vấn đã giới thiệu bạn để được đồng hành và hỗ trợ trong suốt quá trình hợp tác"
      submitLabel="Xác nhận người cố vấn"
      canSubmit={Boolean(advisorId)}
      submitting={submitting}
      onSubmit={handleSubmit}
      error={error}
    >
      <label className="relative block">
        <FiSearch
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ob-disabled-ink)]"
          aria-hidden
        />
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="Tìm theo tên hoặc số điện thoại người cố vấn"
          className="h-10 w-full rounded-lg border border-[var(--ob-border)] pl-9 pr-3 text-theme-sm text-[var(--ob-ink)] outline-none placeholder:text-[var(--ob-disabled-ink)] focus:border-[var(--ob-blue)]"
        />
      </label>

      <ul className="flex flex-col gap-2">
        {advisors.map((advisor) => {
          const selected = advisorId === advisor.id;
          return (
            <li key={advisor.id}>
              <button
                type="button"
                onClick={() => setAdvisorId(advisor.id)}
                aria-pressed={selected}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                  selected
                    ? 'border-[var(--ob-blue)] bg-[var(--ob-blue-soft)]'
                    : 'border-[var(--ob-border-soft)] bg-white hover:bg-[var(--ob-surface)]'
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ob-blue-soft)] text-theme-sm font-semibold text-[var(--ob-blue)]">
                  {advisor.name.charAt(0)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-theme-sm font-medium text-[var(--ob-ink)]">
                    {advisor.name}
                  </span>
                  <span className="block truncate text-theme-xs text-[var(--ob-muted)]">
                    {advisor.company} · {advisor.phone}
                  </span>
                </span>
                {selected && <FiCheck className="h-4 w-4 shrink-0 text-[var(--ob-blue)]" aria-hidden />}
              </button>
            </li>
          );
        })}

        {loaded && advisors.length === 0 && (
          <li className="rounded-xl border border-dashed border-[var(--ob-border)] px-4 py-6 text-center text-theme-sm text-[var(--ob-muted)]">
            Không tìm thấy người cố vấn phù hợp.
          </li>
        )}
      </ul>
    </StepPanel>
  );
};

export default AdvisorStep;
