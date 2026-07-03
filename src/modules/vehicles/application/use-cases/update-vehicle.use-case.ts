import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { VehicleRepositoryPort } from '../../domain/ports/vehicle-repository.port';
import { UpdateVehicleDto } from '../dto/update-vehicle.dto';
import {
  DomainConflictException,
  DomainNotFoundException,
} from '../../../../common/exceptions/domain.exception';
import { EventPublisherPort } from '../../../../common/messaging/ports/event-publisher.port';

@Injectable()
export class UpdateVehicleUseCase {
  constructor(
    private readonly vehicleRepository: VehicleRepositoryPort,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(id: string, dto: UpdateVehicleDto): Promise<void> {
    const existing = await this.vehicleRepository.findById(id);
    if (!existing) {
      throw new DomainNotFoundException('Veículo não encontrado');
    }

    if (dto.licensePlate) {
      const existingVehicle = await this.vehicleRepository.findByLicensePlate(
        dto.licensePlate,
      );

      if (existingVehicle && existingVehicle.id !== id) {
        throw new DomainConflictException('Placa de Veículo já existe');
      }
    }

    const updated = new Vehicle(
      existing.id,
      dto.licensePlate ?? existing.licensePlate,
      dto.chassis ?? existing.chassis,
      dto.renavam ?? existing.renavam,
      dto.year ?? existing.year,
      dto.modelId ?? existing.modelId,
      existing.createdBy,
    );

    await this.vehicleRepository.update(updated);
    await this.cacheManager.del('vehicles:all');
    await this.cacheManager.del(`vehicles:${id}`);

    await this.eventPublisher.publish({
      eventType: 'VEHICLE_UPDATED',
      userId: existing.createdBy,
      resource: 'vehicles',
      resourceId: id,
      createdAt: new Date(),
    });
  }
}
