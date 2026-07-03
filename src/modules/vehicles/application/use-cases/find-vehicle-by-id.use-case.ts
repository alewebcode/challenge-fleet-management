import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { VehicleRepositoryPort } from '../../domain/ports/vehicle-repository.port';
import { DomainNotFoundException } from '../../../../common/exceptions/domain.exception';
import { EventPublisherPort } from '../../../../common/messaging/ports/event-publisher.port';

@Injectable()
export class FindVehicleByIdUseCase {
  constructor(
    private readonly vehicleRepository: VehicleRepositoryPort,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(id: string, userId: string): Promise<Vehicle> {
    const key = `vehicles:${id}`;

    const cached = await this.cacheManager.get<Vehicle>(key);
    if (cached) {
      await this.eventPublisher.publish({
        eventType: 'VEHICLE_FETCHED',
        userId,
        resource: 'vehicles',
        resourceId: id,
        createdAt: new Date(),
      });
      return cached;
    }

    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new DomainNotFoundException('Veículo não encontrado');
    }

    await this.cacheManager.set(key, vehicle);
    await this.eventPublisher.publish({
      eventType: 'VEHICLE_FETCHED',
      userId,
      resource: 'vehicles',
      resourceId: id,
      createdAt: new Date(),
    });
    return vehicle;
  }
}
