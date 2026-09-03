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

export enum BlogStatus {
  Draft = 'draft',
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

@Entity('blogs')
export class Blog extends EntityHelper {
  @ObjectIdColumn()
  _id!: ObjectId;

  @Column()
  userId!: string;

  @Column()
  @Index()
  slug!: string;

  @Column()
  title!: string;

  @Column()
  excerpt!: string;

  @Column()
  blogData!: string;

  @Column({ nullable: true })
  thumbnail?: string;

  @Column({ nullable: true })
  category?: any;

  @Column({ nullable: true })
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    ogImage?: string;
  };

  @Column({ nullable: true })
  faqs?: {
    question: string;
    answer: string;
  }[];

  @Column({ nullable: true })
  author?: {
    avatar?: string;
    name?: string;
    position?: string;
    description?: string;
  };

  @Column({ default: false })
  showBMI!: boolean;

  @Column({ default: false })
  showTDEE!: boolean;

  @Column({ default: false })
  showBMR!: boolean;

  @Column({ default: false })
  showRMR!: boolean;

  @Column({ default: false })
  showProtein!: boolean;

  @Column({ default: false })
  showBodyFat!: boolean;

  @Column({ default: [] })
  relatedSlugs!: string[];

  @Column({ type: 'string', default: BlogStatus.Draft })
  status!: BlogStatus;

  @Column({ default: false })
  isHidden!: boolean;

  @Column({ default: false })
  isFeatured!: boolean;

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
