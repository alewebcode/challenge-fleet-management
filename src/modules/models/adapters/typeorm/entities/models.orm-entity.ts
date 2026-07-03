import { BrandOrmEntity } from '../../../../brands/adapters/typeorm/entities/brands.orm-entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('models')
export class ModelOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'nvarchar', length: 255 })
  name: string;

  @ManyToOne(() => BrandOrmEntity, { nullable: false, eager: false })
  @JoinColumn({ name: 'brand_id' })
  brand: BrandOrmEntity;

  @CreateDateColumn({ type: 'datetime2', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime2', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'uniqueidentifier', name: 'created_by' })
  createdBy: string;
}
