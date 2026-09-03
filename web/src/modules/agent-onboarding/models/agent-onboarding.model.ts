/**
 * Hop dong du lieu cho luong "Tro thanh moi gioi" (agent onboarding).
 *
 * Luong gom 5 buoc chay tuan tu: xong buoc truoc moi mo khoa buoc sau. Buoc
 * cuoi khong phai form ma la man hinh cong nhan doi tac chinh thuc, nen no
 * duoc danh dau bang ngoi sao thay vi so thu tu.
 */

export type OnboardingStepId =
  | 'khu-vuc'
  | 'nguoi-co-van'
  | 'dinh-danh'
  | 'chung-chi'
  | 'doi-tac';

/** `locked` = chua toi luot, `current` = dang lam, `done` = da nop xong. */
export type OnboardingStepStatus = 'locked' | 'current' | 'done';

export interface OnboardingStep {
  id: OnboardingStepId;
  label: string;
  /** So hien trong vong tron. `null` = ve ngoi sao (buoc ket thuc). */
  badge: number | null;
}

/** Mot lua chon dang "chip" - dung chung cho loai hinh BDS va khu vuc. */
export interface OnboardingOption {
  id: string;
  label: string;
}

// ── Buoc 1: khu vuc hoat dong ────────────────────────────────────────────────

export interface WorkAreaOptions {
  propertyTypes: OnboardingOption[];
  areas: OnboardingOption[];
}

export interface WorkAreaPayload {
  /** Chon nhieu loai hinh the manh. */
  propertyTypeIds: string[];
  /** Chi duoc 01 khu vuc. */
  areaId: string;
}

// ── Buoc 2: nguoi co van ─────────────────────────────────────────────────────

export interface Advisor {
  id: string;
  name: string;
  /** Cong ty / san giao dich dang cong tac. */
  company: string;
  phone: string;
  avatarUrl?: string;
}

export interface AdvisorPayload {
  advisorId: string;
}

// ── Buoc 3: xac thuc dinh danh dien tu (eKYC) ────────────────────────────────

export interface IdentityPayload {
  fullName: string;
  idNumber: string;
  /** Ten file da chon - mock chua upload that. */
  frontImageName: string;
  backImageName: string;
}

// ── Buoc 4: chung chi hanh nghe ──────────────────────────────────────────────

export interface CertificatePayload {
  certificateNumber: string;
  issuedPlace: string;
  issuedDate: string;
  fileName: string;
}

/** Ket qua chung cho moi lan nop mot buoc. */
export interface StepSubmitResult {
  success: boolean;
  message: string;
}
