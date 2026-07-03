import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Brand } from '../../domain/entities/brand.entity';
import { BrandRepositoryPort } from '../../domain/ports/brand-repository.port';
import { CreateBrandDto } from '../dto/create-brand.dto';
import { DomainConflictException } from '../../../../common/exceptions/domain.exception';
import { EventPublisherPort } from '../../../../common/messaging/ports/event-publisher.port';

@Injectable()
export class CreateBrandUseCase {
  constructor(
    private readonly brandRepository: BrandRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(dto: CreateBrandDto, createdBy: string): Promise<void> {
    const existing = await this.brandRepository.findByName(dto.name);

    if (existing) {
      throw new DomainConflictException('Marca já existe');
    }

    const brand = new Brand(randomUUID(), dto.name, createdBy);

    await this.brandRepository.create(brand);

    await this.eventPublisher.publish({
      eventType: 'BRAND_CREATED',
      userId: createdBy,
      resource: 'brands',
      resourceId: brand.id,
      createdAt: new Date(),
    });
  }
}
