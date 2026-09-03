import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  ObjectIdColumn,
} from 'typeorm';
import { EntityHelper } from 'src/common/utils/entity-helper';
import { ObjectId } from 'mongodb';

@Entity('categories_blog')
export class CategoriesBlog extends EntityHelper {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  @Index()
  name!: string;

  @Column()
  @Index()
  slug!: string;

  @Column({ default: 0 })
  level!: number;

  @Column({ nullable: true, default: null })
  parentSlug?: string | null;

  @Column({ default: [] })
  childrenSlugs!: string[];

  @Column({ default: false })
  isDeleted!: boolean;

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
