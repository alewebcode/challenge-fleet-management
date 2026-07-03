import { Model } from '../entities/model.entity';

export abstract class ModelRepositoryPort {
  abstract findById(id: string): Promise<Model | null>;
  abstract findAll(): Promise<Model[]>;
  abstract create(model: Model): Promise<void>;
  abstract update(model: Model): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findByName(name: string): Promise<Model | null>;
  abstract findByBrandId(brandId: string): Promise<Model[]>;
}
