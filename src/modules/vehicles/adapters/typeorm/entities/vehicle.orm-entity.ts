import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ModelOrmEntity } from '../../../../models/adapters/typeorm/entities/models.orm-entity';

@Entity('vehicles')
export class VehicleOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'nvarchar', length: 20, name: 'license_plate', unique: true })
  licensePlate: string;

  @Column({ type: 'nvarchar', length: 17, unique: true })
  chassis: string;

  @Column({ type: 'nvarchar', length: 11, unique: true })
  renavam: string;

  @Column({ type: 'int' })
  year: number;

  @ManyToOne(() => ModelOrmEntity, { nullable: false, eager: false })
  @JoinColumn({ name: 'model_id' })
  model: ModelOrmEntity;

  @CreateDateColumn({ type: 'datetime2', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime2', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'uniqueidentifier', name: 'created_by' })
  createdBy: string;
}
