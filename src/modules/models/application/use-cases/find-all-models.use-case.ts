import { Injectable } from '@nestjs/common';
import { Model } from '../../domain/entities/model.entity';
import { ModelRepositoryPort } from '../../domain/ports/model-repository.port';
import { EventPublisherPort } from '../../../../common/messaging/ports/event-publisher.port';

@Injectable()
export class FindAllModelsUseCase {
  constructor(
    private readonly modelRepository: ModelRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(userId: string): Promise<Model[]> {
    const models = await this.modelRepository.findAll();
    await this.eventPublisher.publish({
      eventType: 'MODEL_ALL_FETCHED',
      userId,
      resource: 'models',
      resourceId: 'all',
      createdAt: new Date(),
    });
    return models;
  }
}
