import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { ObjectId } from 'mongodb';
import { MongoRepository } from 'typeorm';
import { CreateContactPublicDto } from './dto/create-contact-public.dto';
import { UpdateContactAdminDto } from './dto/update-contact-admin.dto';
import { Contact, ContactProcessingStatus } from './entities/contact.entity';
import type { ContactPublicResponse, IContactService } from './contact';
import { HistoryService } from '../history/history.service';
import { HISTORY_ACTIONS } from '../history/history';

@Injectable()
export class ContactService implements IContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: MongoRepository<Contact>,
    private readonly historyService: HistoryService,
  ) {}

  private resolveCustomerEmail(dto: CreateContactPublicDto): string | undefined {
    const resolved = dto.customerEmail ?? dto.email;
    return resolved?.trim() || undefined;
  }

  private validateTableReservation(dto: CreateContactPublicDto): void {
    if (dto.requestType !== 'table') {
      return;
    }
    if (!dto.eventType?.trim()) {
      throw new BadRequestException(
        'Event type is required for table requests.',
      );
    }
  }

  private async generateUniqueReferenceNumber(): Promise<string> {
    for (let attempt = 0; attempt < 12; attempt += 1) {
      const suffix = randomBytes(4).toString('hex').toUpperCase();
      const referenceNumber = `HGATE-${suffix}`;
      const existing = await this.contactRepository.findOne({
        where: { referenceNumber },
      });
      if (!existing) {
        return referenceNumber;
      }
    }
    throw new BadRequestException('Could not allocate a reference number.');
  }

  private toPublicResponse(contact: Contact): ContactPublicResponse {
    const id = contact._id.toHexString();
    return {
      id,
      _id: id,
      referenceNumber: contact.referenceNumber,
      status: contact.status,
      requestType: contact.requestType,
      fullName: contact.fullName,
      phoneNumber: contact.phoneNumber,
      customerEmail: contact.customerEmail,
      content: contact.content,
      preferredDate: contact.preferredDate,
      preferredTime: contact.preferredTime,
      guests: contact.guests,
      eventType: contact.eventType,
      specialRequests: contact.specialRequests,
      notes: contact.notes,
      sendNotificationToAdmin: contact.sendNotificationToAdmin,
      sendConfirmationToCustomer: contact.sendConfirmationToCustomer,
      internalNote: contact.internalNote,
      createdAt: contact.createdAt.toISOString(),
      updatedAt: contact.updatedAt.toISOString(),
    };
  }

  public async createPublic(
    dto: CreateContactPublicDto,
  ): Promise<ContactPublicResponse> {
    this.validateTableReservation(dto);
    const customerEmail = this.resolveCustomerEmail(dto);
    const referenceNumber = await this.generateUniqueReferenceNumber();

    const contact = this.contactRepository.create({
      referenceNumber,
      requestType: dto.requestType,
      status: ContactProcessingStatus.Pending,
      fullName: dto.fullName.trim(),
      phoneNumber: dto.phoneNumber.trim(),
      customerEmail,
      content: dto.content?.trim(),
      preferredDate: dto.preferredDate?.trim(),
      preferredTime: dto.preferredTime?.trim(),
      guests: dto.guests,
      eventType: dto.eventType?.trim() || undefined,
      specialRequests: dto.specialRequests?.trim(),
      notes: dto.notes?.trim(),
      sendNotificationToAdmin: dto.sendNotificationToAdmin ?? false,
      sendConfirmationToCustomer: dto.sendConfirmationToCustomer ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.contactRepository.save(contact);
    await this.historyService.create({
      action: HISTORY_ACTIONS.CONTACT_SUBMITTED,
      message: `Gửi liên hệ ${saved.referenceNumber} (${dto.requestType})`,
      targetType: 'contact',
      targetId: saved.referenceNumber,
      metadata: {
        requestType: dto.requestType,
        status: saved.status,
        fullName: saved.fullName,
      },
    });
    return this.toPublicResponse(saved);
  }

  public async findAllForAdmin(): Promise<ContactPublicResponse[]> {
    const items = await this.contactRepository.find({
      order: { createdAt: 'DESC' },
      take: 200,
    });
    return items.map((item) => this.toPublicResponse(item));
  }

  public async findOneForAdmin(id: string): Promise<ContactPublicResponse> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid contact id.');
    }
    const contact = await this.contactRepository.findOneBy({
      _id: new ObjectId(id),
    } as { _id: ObjectId });
    if (!contact) {
      throw new NotFoundException('Contact not found.');
    }
    return this.toPublicResponse(contact);
  }

  public async updateForAdmin(
    id: string,
    dto: UpdateContactAdminDto,
    actor?: { id: string; email?: string },
  ): Promise<ContactPublicResponse> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid contact id.');
    }
    const contact = await this.contactRepository.findOneBy({
      _id: new ObjectId(id),
    } as { _id: ObjectId });
    if (!contact) {
      throw new NotFoundException('Contact not found.');
    }

    const previousStatus = contact.status;

    if (dto.status !== undefined) {
      contact.status = dto.status;
    }
    if (dto.internalNote !== undefined) {
      contact.internalNote = dto.internalNote.trim();
    }
    contact.updatedAt = new Date();
    const saved = await this.contactRepository.save(contact);

    const actorId = actor?.id?.trim();
    await this.historyService.create({
      action: HISTORY_ACTIONS.CONTACT_ADMIN_UPDATED,
      message: `Cập nhật liên hệ ${saved.referenceNumber}`,
      ...(actorId ? { actorId } : {}),
      ...(actor?.email?.trim() ? { actorEmail: actor.email.trim() } : {}),
      targetType: 'contact',
      targetId: saved.referenceNumber,
      metadata: {
        contactId: id,
        referenceNumber: saved.referenceNumber,
        previousStatus,
        status: saved.status,
        internalNoteUpdated: dto.internalNote !== undefined,
      },
    });

    return this.toPublicResponse(saved);
  }
}
