import { Injectable } from '@nestjs/common';
import { Brand } from '../../domain/entities/brand.entity';
import { BrandRepositoryPort } from '../../domain/ports/brand-repository.port';
import { DomainNotFoundException } from '../../../../common/exceptions/domain.exception';
import { EventPublisherPort } from '../../../../common/messaging/ports/event-publisher.port';

@Injectable()
export class FindBrandByIdUseCase {
  constructor(
    private readonly brandRepository: BrandRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(id: string, userId: string): Promise<Brand> {
    const brand = await this.brandRepository.findById(id);
    if (!brand) {
      throw new DomainNotFoundException('Marca não encontrada');
    }
    await this.eventPublisher.publish({
      eventType: 'BRAND_FETCHED',
      userId,
      resource: 'brands',
      resourceId: id,
      createdAt: new Date(),
    });
    return brand;
  }
}
