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

export type BannerMediaType = 'video' | 'image';

@Entity('banners')
@Index('idx_banner_placement_active_sort', [
  'placement',
  'isActive',
  'sortOrder',
])
export class Banner extends EntityHelper {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ unique: true })
  publicId: string;

  @Column()
  placement: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  mediaType: BannerMediaType;

  @Column()
  src: string;

  @Column({ default: '' })
  posterUrl: string;

  @Column({ default: '' })
  thumbnailUrl: string;

  @Column({ default: '' })
  alt: string;

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
