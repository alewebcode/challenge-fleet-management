import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { VehicleRepositoryPort } from '../../domain/ports/vehicle-repository.port';
import { EventPublisherPort } from '../../../../common/messaging/ports/event-publisher.port';

const VEHICLES_ALL_KEY = 'vehicles:all';

@Injectable()
export class FindAllVehiclesUseCase {
  constructor(
    private readonly vehicleRepository: VehicleRepositoryPort,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(userId: string): Promise<Vehicle[]> {
    const cached = await this.cacheManager.get<Vehicle[]>(VEHICLES_ALL_KEY);
    if (cached) {
      await this.eventPublisher.publish({
        eventType: 'VEHICLE_ALL_FETCHED',
        userId,
        resource: 'vehicles',
        resourceId: 'all',
        createdAt: new Date(),
      });
      return cached;
    }

    const vehicles = await this.vehicleRepository.findAll();
    await this.cacheManager.set(VEHICLES_ALL_KEY, vehicles);
    await this.eventPublisher.publish({
      eventType: 'VEHICLE_ALL_FETCHED',
      userId,
      resource: 'vehicles',
      resourceId: 'all',
      createdAt: new Date(),
    });
    return vehicles;
  }
}
