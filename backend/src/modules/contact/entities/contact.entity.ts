import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  ObjectIdColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { EntityHelper } from 'src/common/utils/entity-helper';

/** Staff workflow: received → handled → confirmed with customer → done */
export enum ContactProcessingStatus {
  Pending = 'pending',
  Acknowledged = 'acknowledged',
  Confirmed = 'confirmed',
  Closed = 'closed',
}

export type ContactRequestType = 'general' | 'table' | 'consultation';

@Entity('contacts')
export class Contact extends EntityHelper {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  @Index({ unique: true })
  referenceNumber!: string;

  @Column({ type: 'string' })
  requestType!: ContactRequestType;

  @Column({ type: 'string', default: ContactProcessingStatus.Pending })
  status!: ContactProcessingStatus;

  @Column()
  fullName!: string;

  @Column()
  phoneNumber!: string;

  @Column({ nullable: true })
  customerEmail?: string;

  @Column({ nullable: true })
  content?: string;

  @Column({ nullable: true })
  preferredDate?: string;

  @Column({ nullable: true })
  preferredTime?: string;

  @Column({ nullable: true })
  guests?: number;

  @Column({ nullable: true })
  eventType?: string;

  @Column({ nullable: true })
  specialRequests?: string;

  @Column({ nullable: true })
  notes?: string;

  @Column({ default: false })
  sendNotificationToAdmin!: boolean;

  @Column({ default: false })
  sendConfirmationToCustomer!: boolean;

  /** Internal staff note (not shown to customer) */
  @Column({ nullable: true })
  internalNote?: string;

  @Column({ type: Date })
  createdAt: Date = new Date();

  @Column({ type: Date })
  updatedAt: Date = new Date();

  @BeforeInsert()
  setCreatedAt() {
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }
}
