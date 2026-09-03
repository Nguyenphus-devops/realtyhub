import type { CreateContactPublicDto } from './dto/create-contact-public.dto';
import type { UpdateContactAdminDto } from './dto/update-contact-admin.dto';
import type {
  ContactProcessingStatus,
  ContactRequestType,
} from './entities/contact.entity';

export type ContactPublicResponse = {
  id: string;
  _id: string;
  referenceNumber: string;
  status: ContactProcessingStatus;
  requestType: ContactRequestType;
  fullName: string;
  phoneNumber: string;
  customerEmail?: string;
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

export interface IContactService {
  createPublic(
    createContactDto: CreateContactPublicDto,
  ): Promise<ContactPublicResponse>;
  findAllForAdmin(): Promise<ContactPublicResponse[]>;
  findOneForAdmin(id: string): Promise<ContactPublicResponse>;
  updateForAdmin(
    id: string,
    updateContactDto: UpdateContactAdminDto,
    actor?: { id: string; email?: string },
  ): Promise<ContactPublicResponse>;
}
