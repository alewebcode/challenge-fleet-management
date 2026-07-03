import { Injectable } from '@nestjs/common';
import { Brand } from '../../domain/entities/brand.entity';
import { BrandRepositoryPort } from '../../domain/ports/brand-repository.port';
import { EventPublisherPort } from '../../../../common/messaging/ports/event-publisher.port';

@Injectable()
export class FindAllBrandsUseCase {
  constructor(
    private readonly brandRepository: BrandRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(userId: string): Promise<Brand[]> {
    const brands = await this.brandRepository.findAll();
    await this.eventPublisher.publish({
      eventType: 'BRAND_ALL_FETCHED',
      userId,
      resource: 'brands',
      resourceId: 'all',
      createdAt: new Date(),
    });
    return brands;
  }
}
