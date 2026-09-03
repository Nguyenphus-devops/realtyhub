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
import { ServicePackageCategory } from '../constants/service-package-categories';

@Entity('service_packages')
@Index('idx_service_package_active_sort', ['isActive', 'sortOrder'])
@Index('idx_service_package_category_active_sort', [
  'category',
  'isActive',
  'sortOrder',
])
export class ServicePackage extends EntityHelper {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  publicId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ default: '' })
  priceLabel: string;

  @Column({ type: 'double', nullable: true, default: null })
  basePrice: number | null;

  @Column()
  imageUrl: string;

  @Column()
  category: ServicePackageCategory;

  @Column({ type: 'simple-array', default: '' })
  features: string[];

  @Column({ type: 'int', nullable: true, default: null })
  minGuests: number | null;

  @Column({ type: 'int', nullable: true, default: null })
  maxGuests: number | null;

  @Column({ default: '' })
  serviceDuration: string;

  @Column({ default: '' })
  venueScope: string;

  @Column({ default: '' })
  defaultMenu: string;

  @Column({ type: 'simple-array', nullable: true, default: null })
  classDays: string[] | null;

  @Column({ nullable: true, default: null })
  classTime: string | null;

  @Column({ nullable: true, default: null })
  instructor: string | null;

  @Column({ nullable: true, default: null })
  classroom: string | null;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: Date })
  createdAt: Date;

  @Column({ type: Date })
  updatedAt: Date;

  @BeforeInsert()
  setInsertDefaults(): void {
    if (!this.publicId) {
      this.publicId = randomUUID();
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
