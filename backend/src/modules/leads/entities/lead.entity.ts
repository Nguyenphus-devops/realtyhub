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

@Entity('leads')
export class Lead extends EntityHelper {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  @Index()
  name!: string;

  @Column()
  @Index()
  phone!: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  note?: string;

  @Column({ type: 'string', default: LeadPromoType.None })
  promoType!: LeadPromoType;

  @Column({ type: 'string', default: LeadSource.Website })
  source!: LeadSource;

  @Column({ type: 'string', default: LeadStatus.New })
  status!: LeadStatus;

  @Column({ nullable: true })
  staffNote?: string;

  @Column({ nullable: true })
  contactAt?: Date;

  @Column({ nullable: true })
  convertedAt?: Date;

  @Column({ nullable: true })
  lostReason?: string;

  @Column({ type: Date })
  createdAt: Date = new Date();

  @Column({ type: Date })
  updatedAt: Date = new Date();

  @Column({ nullable: true })
  sourceDetail?: string;


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
