import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  ObjectIdColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { randomUUID } from 'crypto';
import { EntityHelper } from 'src/common/utils/entity-helper';

export const INFO_WEBSITE_SINGLETON_KEY = 'default';

@Entity('info_website')
export class InfoWebsite extends EntityHelper {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  publicId: string;

  @Index('idx_info_website_singleton_key', { unique: true })
  @Column()
  singletonKey: string;

  @Column({ default: '' })
  siteTitle: string;

  @Column({ default: '' })
  metaDescription: string;

  @Column({ default: '' })
  faviconUrl: string;

  @Column({ default: '' })
  logoUrl: string;

  @Column({ default: '' })
  ogImageUrl: string;

  @Column({ default: '' })
  companyName: string;

  @Column({ default: '' })
  companySlogan: string;

  @Column({ default: '' })
  taxCode: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  hotline: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  address: string;

  @Column({ default: '' })
  addressLine2: string;

  @Column({ default: '' })
  googleMapEmbedUrl: string;

  @Column({ default: '' })
  googleMapLink: string;

  @Column({ default: '' })
  workingHours: string;

  @Column({ default: '' })
  facebookUrl: string;

  @Column({ default: '' })
  youtubeUrl: string;

  @Column({ default: '' })
  instagramUrl: string;

  @Column({ default: '' })
  zaloUrl: string;

  @Column({ default: '' })
  tiktokUrl: string;

  @Column({ default: '' })
  linkedinUrl: string;

  @Column({ default: '' })
  twitterUrl: string;

  @Column({ default: '' })
  messengerUrl: string;

  @Column({ default: '' })
  copyrightText: string;

  @Column({ default: '' })
  extraNote: string;

  @Column({ type: Date })
  createdAt: Date;

  @Column({ type: Date })
  updatedAt: Date;

  @BeforeInsert()
  setInsertDefaults(): void {
    if (!this.publicId) {
      this.publicId = randomUUID();
    }
    if (!this.singletonKey) {
      this.singletonKey = INFO_WEBSITE_SINGLETON_KEY;
    }
    const now = new Date();
    if (!this.createdAt) {
      this.createdAt = now;
    }
    this.updatedAt = now;
  }

  @BeforeUpdate()
  touchUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}
