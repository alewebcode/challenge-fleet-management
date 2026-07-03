import { Model } from 'src/modules/models/domain/entities/model.entity';
import { ModelRepositoryPort } from 'src/modules/models/domain/ports/model-repository.port';
import { ModelOrmEntity } from '../entities/models.orm-entity';
import { Repository } from 'typeorm';
import { ModelMapper } from '../mappers/model.mapper';
import { InjectRepository } from '@nestjs/typeorm';

export class ModelRepository implements ModelRepositoryPort {
  constructor(
    @InjectRepository(ModelOrmEntity)
    private readonly modelRepository: Repository<ModelOrmEntity>,
  ) {}

  async create(model: Model): Promise<void> {
    await this.modelRepository.save(ModelMapper.toOrm(model));
  }

  async findById(id: string): Promise<Model | null> {
    const orm = await this.modelRepository.findOne({
      where: { id },
      relations: ['brand'],
    });
    return orm ? ModelMapper.toDomain(orm) : null;
  }

  async update(model: Model): Promise<void> {
    await this.modelRepository.update(
      { id: model.id },
      ModelMapper.toOrm(model),
    );
  }

  async delete(id: string): Promise<void> {
    await this.modelRepository.delete({ id });
  }

  async findAll(): Promise<Model[]> {
    const orms = await this.modelRepository.find({ relations: ['brand'] });
    return orms.map((orm) => ModelMapper.toDomain(orm));
  }

  async findByName(name: string): Promise<Model | null> {
    const orm = await this.modelRepository.findOne({
      where: { name },
      relations: ['brand'],
    });
    return orm ? ModelMapper.toDomain(orm) : null;
  }

  async findByBrandId(brandId: string): Promise<Model[]> {
    const orms = await this.modelRepository.find({
      where: { brand: { id: brandId } },
      relations: ['brand'],
    });
    return orms.map((orm) => ModelMapper.toDomain(orm));
  }
}
