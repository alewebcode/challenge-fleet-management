import { ConflictException, Injectable } from '@nestjs/common';
import { ModelRepositoryPort } from '../../domain/ports/model-repository.port';
import { DomainNotFoundException } from '../../../../common/exceptions/domain.exception';
import { EventPublisherPort } from '../../../../common/messaging/ports/event-publisher.port';
import { VehicleRepositoryPort } from '../../../vehicles/domain/ports/vehicle-repository.port';

@Injectable()
export class DeleteModelUseCase {
  constructor(
    private readonly modelRepository: ModelRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
    private readonly vehicleRepository: VehicleRepositoryPort,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const existing = await this.modelRepository.findById(id);
    if (!existing) {
      throw new DomainNotFoundException('Modelo não encontrado');
    }

    const vehicles = await this.vehicleRepository.findByModelId(id);
    if (vehicles.length > 0) {
      throw new ConflictException(
        `Não é possível remover o modelo pois existem ${vehicles.length} veículo(s) associado(s)`,
      );
    }

    await this.modelRepository.delete(id);

    await this.eventPublisher.publish({
      eventType: 'MODEL_DELETED',
      userId,
      resource: 'models',
      resourceId: id,
      createdAt: new Date(),
    });
  }
}
