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

@Entity('feedbacks')
@Index('idx_feedbacks_service_type', ['serviceType'])
export class Feedback extends EntityHelper {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  publicId: string;

  @Column()
  name: string;

  @Column()
  avatar: string;

  @Column({ type: 'float', default: 5.0 })
  rating: number;

  @Column({ type: 'text', default: '' })
  comment: string;

  @Column()
  serviceType: string;

  @Column({ type: 'longtext', nullable: true, default: null })
  beforeImage: string | null;

  @Column({ type: 'longtext', nullable: true, default: null })
  afterImage: string | null;

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
