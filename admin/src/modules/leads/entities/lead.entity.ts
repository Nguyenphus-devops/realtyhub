export enum LeadStatus {
  New = 'new',
  Contacted = 'contacted',
  Qualified = 'qualified',
  Converted = 'converted',
  Lost = 'lost',
}

export enum LeadPromoType {
  FreeTrial = 'free_trial',
  Discount = 'discount',
  Consultation = 'consultation',
  None = 'none',
}

export enum LeadSource {
  Website = 'website',
  Facebook = 'facebook',
  Google = 'google',
  Hotline = 'hotline',
  WalkIn = 'walk_in',
  Referral = 'referral',
  Other = 'other',
}

export const LEAD_STATUS_LABEL_VI: Record<string, string> = {
  [LeadStatus.New]: 'Mới',
  [LeadStatus.Contacted]: 'Đã liên hệ',
  [LeadStatus.Qualified]: 'Đủ điều kiện',
  [LeadStatus.Converted]: 'Đã chuyển đổi',
  [LeadStatus.Lost]: 'Mất',
};

export const LEAD_PROMO_TYPE_LABEL_VI: Record<string, string> = {
  [LeadPromoType.FreeTrial]: 'Dùng thử miễn phí',
  [LeadPromoType.Discount]: 'Giảm giá',
  [LeadPromoType.Consultation]: 'Tư vấn',
  [LeadPromoType.None]: 'Không',
};

export const LEAD_SOURCE_LABEL_VI: Record<string, string> = {
  [LeadSource.Website]: 'Website',
  [LeadSource.Facebook]: 'Facebook',
  [LeadSource.Google]: 'Google',
  [LeadSource.Hotline]: 'Hotline',
  [LeadSource.WalkIn]: 'Đến trực tiếp',
  [LeadSource.Referral]: 'Giới thiệu',
  [LeadSource.Other]: 'Khác',
};
