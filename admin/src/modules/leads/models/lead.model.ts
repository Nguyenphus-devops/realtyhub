import { LeadStatus, LeadPromoType, LeadSource } from '../entities/lead.entity';

export interface AdminLead {
  _id: string;
  id: string;
  name: string;
  phone: string;
  email?: string;
  note?: string;
  promoType: LeadPromoType;
  source: LeadSource;
  status: LeadStatus;
  staffNote?: string;
  contactAt?: string;
  convertedAt?: string;
  lostReason?: string;
  sourceDetail?: string;
  createdAt: string;
  updatedAt: string;
}

export type UpdateAdminLeadPayload = {
  status?: LeadStatus;
  staffNote?: string;
  contactAt?: string;
  convertedAt?: string;
  lostReason?: string;
};
