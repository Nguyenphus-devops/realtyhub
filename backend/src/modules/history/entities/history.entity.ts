import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ObjectIdColumn,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { EntityHelper } from '../../../common/utils/entity-helper';

@Entity('history_logs')
export class History extends EntityHelper {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  action!: string;

  @Column({ nullable: true })
  message?: string;

  @Column({ nullable: true })
  actorId?: string;

  @Column({ nullable: true })
  actorEmail?: string;

  @Column({ nullable: true })
  targetType?: string;

  @Column({ nullable: true })
  targetId?: string;

  @Column({ nullable: true })
  metadata?: Record<string, unknown>;

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
