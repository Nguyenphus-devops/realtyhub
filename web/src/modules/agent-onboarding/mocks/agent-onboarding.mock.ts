import type {
  Advisor,
  OnboardingStep,
  WorkAreaOptions,
} from '../models/agent-onboarding.model';

/**
 * Du lieu tam cho luong onboarding. Chi
 * `services/agent-onboarding.service.ts` duoc import file nay.
 */

export const MOCK_STEPS: OnboardingStep[] = [
  { id: 'khu-vuc', label: 'Khu vực hoạt động', badge: 1 },
  { id: 'nguoi-co-van', label: 'Người cố vấn', badge: 2 },
  { id: 'dinh-danh', label: 'Xác thực định danh điện tử', badge: 3 },
  { id: 'chung-chi', label: 'Chứng chỉ hành nghề môi giới', badge: 4 },
  { id: 'doi-tac', label: 'Trở thành đối tác chính thức của Saleplust', badge: null },
];

export const MOCK_WORK_AREA_OPTIONS: WorkAreaOptions = {
  propertyTypes: [
    { id: 'can-ho-chung-cu', label: 'Căn hộ chung cư' },
    { id: 'nha-biet-thu', label: 'Nhà biệt thự' },
  ],
  areas: [
    { id: 'ocean-park-1', label: 'Vinhomes Ocean Park 1' },
    { id: 'smart-city', label: 'Vinhomes Smart City' },
  ],
};

export const MOCK_ADVISORS: Advisor[] = [
  {
    id: 'adv-01',
    name: 'Nguyễn Thu Hà',
    company: 'Sàn giao dịch BĐS Đông Tây',
    phone: '0901 234 567',
  },
  {
    id: 'adv-02',
    name: 'Trần Minh Quân',
    company: 'Saleplust Miền Bắc',
    phone: '0912 345 678',
  },
  {
    id: 'adv-03',
    name: 'Lê Hoàng Nam',
    company: 'Đại lý F1 Ocean Park',
    phone: '0987 654 321',
  },
];
