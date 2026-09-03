import {
  MOCK_ADVISORS,
  MOCK_STEPS,
  MOCK_WORK_AREA_OPTIONS,
} from '../mocks/agent-onboarding.mock';
import type {
  Advisor,
  AdvisorPayload,
  CertificatePayload,
  IdentityPayload,
  OnboardingStep,
  StepSubmitResult,
  WorkAreaOptions,
  WorkAreaPayload,
} from '../models/agent-onboarding.model';

/** Gia lap do tre mang de UI co trang thai cho ma test. */
const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Diem duy nhat trong module biet du lieu den tu mock. Khi backend co endpoint
 * `/agent-onboarding`, chi file nay doi sang axios - hook va component giu nguyen.
 */
export const AgentOnboardingService = {
  async steps(): Promise<OnboardingStep[]> {
    await delay(80);
    return MOCK_STEPS;
  },

  async workAreaOptions(): Promise<WorkAreaOptions> {
    await delay();
    return MOCK_WORK_AREA_OPTIONS;
  },

  async submitWorkArea(payload: WorkAreaPayload): Promise<StepSubmitResult> {
    await delay(600);
    if (payload.propertyTypeIds.length === 0 || !payload.areaId) {
      return { success: false, message: 'Vui lòng chọn loại hình và khu vực hoạt động.' };
    }
    return { success: true, message: 'Đã đăng ký khu vực hoạt động.' };
  },

  /** `query` de tim theo ten hoac so dien thoai nguoi co van. */
  async advisors(query = ''): Promise<Advisor[]> {
    await delay();
    const keyword = query.trim().toLowerCase();
    if (!keyword) return MOCK_ADVISORS;
    return MOCK_ADVISORS.filter(
      (advisor) =>
        advisor.name.toLowerCase().includes(keyword) ||
        advisor.phone.replace(/\s/g, '').includes(keyword.replace(/\s/g, '')),
    );
  },

  async submitAdvisor(payload: AdvisorPayload): Promise<StepSubmitResult> {
    await delay(600);
    if (!payload.advisorId) {
      return { success: false, message: 'Vui lòng chọn người cố vấn.' };
    }
    return { success: true, message: 'Đã ghi nhận người cố vấn.' };
  },

  async submitIdentity(payload: IdentityPayload): Promise<StepSubmitResult> {
    await delay(700);
    if (!payload.fullName || !payload.idNumber) {
      return { success: false, message: 'Vui lòng nhập đủ họ tên và số CCCD.' };
    }
    if (!payload.frontImageName || !payload.backImageName) {
      return { success: false, message: 'Vui lòng tải lên ảnh mặt trước và mặt sau CCCD.' };
    }
    return { success: true, message: 'Đã gửi hồ sơ định danh, đang chờ duyệt.' };
  },

  async submitCertificate(payload: CertificatePayload): Promise<StepSubmitResult> {
    await delay(700);
    if (!payload.certificateNumber || !payload.fileName) {
      return { success: false, message: 'Vui lòng nhập số chứng chỉ và tải lên bản scan.' };
    }
    return { success: true, message: 'Đã gửi chứng chỉ hành nghề, đang chờ duyệt.' };
  },
};
