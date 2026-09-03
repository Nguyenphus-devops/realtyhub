import {
  Column,
  Entity,
  ObjectIdColumn,
  PrimaryColumn,
  BeforeInsert,
  BeforeUpdate,
  Index,
} from 'typeorm';
import { ObjectId } from 'mongodb';
import { randomUUID } from 'crypto';
import { EntityHelper } from 'src/common/utils/entity-helper';

export interface RolePermission {
  resourceType: string; // PermissionResource enum value
  action: string; // PermissionAction enum value
  resourceTarget: string; // PermissionResourceTarget enum value or specific ID
  effect: string; // PermissionEffect enum value (ALLOW/DENY)
}

@Entity()
export class Role extends EntityHelper {
  @ObjectIdColumn()
  _id!: ObjectId;

  @PrimaryColumn({ type: String })
  id!: string;

  @Index()
  @Column({ type: String, unique: true })
  name!: string;

  @Column({ type: String, nullable: true })
  description!: string | null;

  @Column({ type: 'json', default: [] })
  permissions!: RolePermission[];

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  isSystem!: boolean; // System roles cannot be deleted

  @Column({ type: Date })
  createdAt!: Date;

  @Column({ type: Date })
  updatedAt!: Date;

  @BeforeInsert()
  setId() {
    if (!this.id) {
      this.id = randomUUID();
    }
  }

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
