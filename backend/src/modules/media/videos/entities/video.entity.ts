import {
  Column,
  Entity,
  ObjectIdColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { EntityHelper } from 'src/common/utils/entity-helper';
import { ObjectId } from 'mongodb';

@Entity('videos')
export class Video extends EntityHelper {
  @ObjectIdColumn()
  public _id: ObjectId;

  @Column()
  public slug: string;

  @Column({ default: '' })
  public originalName: string;

  @Column()
  public videoUrl: string;

  @Column({ default: '' })
  public alt: string;

  @Column({ default: false })
  isDeleted!: boolean;

  @Column({ nullable: true })
  public uploadId?: string;

  @Column({ default: 0 })
  public uploadProgress: number;

  @Column({ default: 'pending' })
  public uploadStatus: 'pending' | 'uploading' | 'completed' | 'failed';

  @Column({ nullable: true })
  public fileSize?: number;

  @Column({ nullable: true })
  public uploadedBytes?: number;

  @Column({ type: Date })
  public createdAt: Date;

  @Column({ type: Date })
  public updatedAt: Date;

  @BeforeInsert()
  public setCreatedAt(): void {
    if (!this.createdAt) {
      this.createdAt = new Date();
    }
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  public setUpdatedAt(): void {
    this.updatedAt = new Date();
  }
}
