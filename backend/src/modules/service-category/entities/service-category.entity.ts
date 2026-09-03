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

@Entity('service_categories')
@Index('idx_service_categories_slug', ['slug'], { unique: true })
export class ServiceCategory extends EntityHelper {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  publicId: string;

  @Column()
  name: string;

  @Column()
  slug: string;

  @Column({ default: 'individual' })
  type: string;

  @Column({ default: true })
  isActive: boolean;

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