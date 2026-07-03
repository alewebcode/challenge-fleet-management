import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { VehicleRepositoryPort } from '../../domain/ports/vehicle-repository.port';
import { DomainNotFoundException } from '../../../../common/exceptions/domain.exception';
import { EventPublisherPort } from '../../../../common/messaging/ports/event-publisher.port';

@Injectable()
export class DeleteVehicleUseCase {
  constructor(
    private readonly vehicleRepository: VehicleRepositoryPort,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const existing = await this.vehicleRepository.findById(id);
    if (!existing) {
      throw new DomainNotFoundException('Veículo não encontrado');
    }
    await this.vehicleRepository.delete(id);
    await this.cacheManager.del('vehicles:all');
    await this.cacheManager.del(`vehicles:${id}`);

    await this.eventPublisher.publish({
      eventType: 'VEHICLE_DELETED',
      userId,
      resource: 'vehicles',
      resourceId: existing.id,
      createdAt: new Date(),
    });
  }
}
