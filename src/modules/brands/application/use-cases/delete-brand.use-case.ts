import { ConflictException, Injectable } from '@nestjs/common';
import { BrandRepositoryPort } from '../../domain/ports/brand-repository.port';
import { DomainNotFoundException } from '../../../../common/exceptions/domain.exception';
import { EventPublisherPort } from '../../../../common/messaging/ports/event-publisher.port';
import { ModelRepositoryPort } from '../../../models/domain/ports/model-repository.port';

@Injectable()
export class DeleteBrandUseCase {
  constructor(
    private readonly brandRepository: BrandRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
    private readonly modelRepository: ModelRepositoryPort,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const existing = await this.brandRepository.findById(id);
    if (!existing) {
      throw new DomainNotFoundException('Marca não encontrada');
    }

    const brands = await this.modelRepository.findByBrandId(id);
    if (brands.length > 0) {
      throw new ConflictException(
        `Não é possível remover a marca pois existem ${brands.length} modelo(s) associado(s)`,
      );
    }
    await this.brandRepository.delete(id);

    await this.eventPublisher.publish({
      eventType: 'BRAND_DELETED',
      userId,
      resource: 'brands',
      resourceId: id,
      createdAt: new Date(),
    });
  }
}
