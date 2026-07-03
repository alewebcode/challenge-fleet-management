import { Injectable } from '@nestjs/common';
import { Brand } from '../../domain/entities/brand.entity';
import { BrandRepositoryPort } from '../../domain/ports/brand-repository.port';
import { UpdateBrandDto } from '../dto/update-brand.dto';
import {
  DomainConflictException,
  DomainNotFoundException,
} from '../../../../common/exceptions/domain.exception';
import { EventPublisherPort } from '../../../../common/messaging/ports/event-publisher.port';

@Injectable()
export class UpdateBrandUseCase {
  constructor(
    private readonly brandRepository: BrandRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(id: string, dto: UpdateBrandDto): Promise<void> {
    const existing = await this.brandRepository.findById(id);
    if (!existing) {
      throw new DomainNotFoundException('Marca não encontrada');
    }

    if (dto.name) {
      const existingBrand = await this.brandRepository.findByName(dto.name);

      if (existingBrand && existingBrand.id !== id) {
        throw new DomainConflictException('Marca já existe');
      }
    }

    const updated = new Brand(
      existing.id,
      dto.name ?? existing.name,
      existing.createdBy,
    );

    await this.brandRepository.update(updated);

    await this.eventPublisher.publish({
      eventType: 'BRAND_UPDATED',
      userId: existing.createdBy,
      resource: 'brands',
      resourceId: id,
      createdAt: new Date(),
    });
  }
}
