import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Model } from '../../domain/entities/model.entity';
import { ModelRepositoryPort } from '../../domain/ports/model-repository.port';
import { CreateModelDto } from '../dto/create-model.dto';
import { DomainConflictException } from '../../../../common/exceptions/domain.exception';
import { EventPublisherPort } from '../../../../common/messaging/ports/event-publisher.port';

@Injectable()
export class CreateModelUseCase {
  constructor(
    private readonly modelRepository: ModelRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(dto: CreateModelDto, createdBy: string): Promise<void> {
    const existingModel = await this.modelRepository.findByName(dto.name);

    if (existingModel) {
      throw new DomainConflictException('Modelo já existe');
    }
    const model = new Model(
      randomUUID(),
      dto.name,
      dto.brandId ?? null,
      createdBy,
    );
    await this.modelRepository.create(model);

    await this.eventPublisher.publish({
      eventType: 'MODEL_CREATED',
      userId: createdBy,
      resource: 'models',
      resourceId: model.id,
      createdAt: new Date(),
    });
  }
}
