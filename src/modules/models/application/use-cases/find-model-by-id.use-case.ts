import { Injectable } from '@nestjs/common';
import { Model } from '../../domain/entities/model.entity';
import { ModelRepositoryPort } from '../../domain/ports/model-repository.port';
import { DomainNotFoundException } from '../../../../common/exceptions/domain.exception';
import { EventPublisherPort } from '../../../../common/messaging/ports/event-publisher.port';

@Injectable()
export class FindModelByIdUseCase {
  constructor(
    private readonly modelRepository: ModelRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(id: string, userId: string): Promise<Model> {
    const model = await this.modelRepository.findById(id);
    if (!model) {
      throw new DomainNotFoundException('Modelo não encontrado');
    }
    await this.eventPublisher.publish({
      eventType: 'MODEL_FETCHED',
      userId,
      resource: 'models',
      resourceId: id,
      createdAt: new Date(),
    });
    return model;
  }
}
