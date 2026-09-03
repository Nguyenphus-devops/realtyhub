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

export type TrainerGender = 'male' | 'female' | 'other';

@Entity('trainers')
@Index('idx_trainers_service_type', ['serviceType'])
export class Trainer extends EntityHelper {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  publicId: string;

  @Column()
  name: string;

  @Column({ type: 'date' })
  birthDate: Date;

  @Column()
  gender: TrainerGender;

  @Column({ default: '' })
  address: string;

  @Column({ type: 'longtext', nullable: true, default: null })
  photoUrl: string | null;

  @Column()
  serviceType: string;

  @Column({ default: '' })
  phone: string;

  @Column({ type: 'int', default: 0 })
  experience: number;

  @Column({ type: 'float', default: 5.0 })
  rating: number;

  @Column({ type: 'simple-array', nullable: true })
  specialties: string[];

  @Column({ type: 'simple-array', nullable: true })
  certificates: string[];

  @Column({ type: 'text', default: '' })
  bio: string;

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
