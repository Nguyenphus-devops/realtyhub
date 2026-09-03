export type ContactProcessingStatus =
  | 'pending'
  | 'acknowledged'
  | 'confirmed'
  | 'closed';

export type ContactRequestType = 'general' | 'table' | 'consultation';

export type AdminContact = {
  id: string;
  _id: string;
  referenceNumber: string;
  status: ContactProcessingStatus;
  requestType: ContactRequestType;
  fullName: string;
  phoneNumber: string;
  customerEmail: string;
  content?: string;
  preferredDate?: string;
  preferredTime?: string;
  guests?: number;
  eventType?: string;
  specialRequests?: string;
  notes?: string;
  sendNotificationToAdmin: boolean;
  sendConfirmationToCustomer: boolean;
  internalNote?: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateAdminContactPayload = {
  status?: ContactProcessingStatus;
  internalNote?: string;
};
