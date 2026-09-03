import {
  Column,
  Entity,
  ObjectIdColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { EntityHelper } from 'src/common/utils/entity-helper';
import { ObjectId } from 'mongodb';

@Entity('images')
export class Image extends EntityHelper {
  @ObjectIdColumn()
  public _id: ObjectId;

  @Column()
  public slug: string;

  @Column({ default: '' })
  public originalName: string;

  @Column()
  public imageUrl: string;

  @Column({ default: '' })
  public alt: string;

  @Column({ default: false })
  isDeleted!: boolean;

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
