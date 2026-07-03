import { Injectable } from '@nestjs/common';
import { Model } from '../../domain/entities/model.entity';
import { ModelRepositoryPort } from '../../domain/ports/model-repository.port';
import { UpdateModelDto } from '../dto/update-model.dto';
import {
  DomainConflictException,
  DomainNotFoundException,
} from '../../../../common/exceptions/domain.exception';
import { EventPublisherPort } from '../../../../common/messaging/ports/event-publisher.port';

@Injectable()
export class UpdateModelUseCase {
  constructor(
    private readonly modelRepository: ModelRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(id: string, dto: UpdateModelDto): Promise<void> {
    const existing = await this.modelRepository.findById(id);
    if (!existing) {
      throw new DomainNotFoundException('Modelo não encontrado');
    }

    if (dto.name) {
      const existingModel = await this.modelRepository.findByName(dto.name);

      if (existingModel && existingModel.id !== id) {
        throw new DomainConflictException('Modelo já existe');
      }
    }

    const updated = new Model(
      existing.id,
      dto.name ?? existing.name,
      dto.brandId !== undefined ? dto.brandId : existing.brandId,
      existing.createdBy,
    );

    await this.modelRepository.update(updated);

    await this.eventPublisher.publish({
      eventType: 'MODEL_UPDATED',
      userId: existing.createdBy,
      resource: 'models',
      resourceId: id,
      createdAt: new Date(),
    });
  }
}
