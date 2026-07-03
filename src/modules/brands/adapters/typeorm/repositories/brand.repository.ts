import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from 'src/modules/brands/domain/entities/brand.entity';
import { BrandRepositoryPort } from 'src/modules/brands/domain/ports/brand-repository.port';
import { BrandOrmEntity } from '../entities/brands.orm-entity';
import { BrandMapper } from '../mappers/brand.mapper';

export class BrandRepository implements BrandRepositoryPort {
  constructor(
    @InjectRepository(BrandOrmEntity)
    private readonly brandRepository: Repository<BrandOrmEntity>,
  ) {}

  async create(brand: Brand): Promise<void> {
    await this.brandRepository.save(BrandMapper.toOrm(brand));
  }

  async findById(id: string): Promise<Brand | null> {
    const orm = await this.brandRepository.findOne({
      where: { id },
    });
    return orm ? BrandMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<Brand[]> {
    const orms = await this.brandRepository.find();
    return orms.map((orm) => BrandMapper.toDomain(orm));
  }

  async update(brand: Brand): Promise<void> {
    await this.brandRepository.save(BrandMapper.toOrm(brand));
  }

  async delete(id: string): Promise<void> {
    await this.brandRepository.delete({ id });
  }

  async findByName(name: string): Promise<Brand | null> {
    const orm = await this.brandRepository.findOne({
      where: { name },
    });
    return orm ? BrandMapper.toDomain(orm) : null;
  }
}
