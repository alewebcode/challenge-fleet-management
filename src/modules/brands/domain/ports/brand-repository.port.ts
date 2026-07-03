import { Brand } from '../entities/brand.entity';

export abstract class BrandRepositoryPort {
  abstract findById(id: string): Promise<Brand | null>;
  abstract findAll(): Promise<Brand[]>;
  abstract create(brand: Brand): Promise<void>;
  abstract update(brand: Brand): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findByName(name: string): Promise<Brand | null>;
}
