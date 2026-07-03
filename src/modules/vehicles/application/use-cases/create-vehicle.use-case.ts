import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';
import { Vehicle } from '../../domain/entities/vehicle.entity';
import { VehicleRepositoryPort } from '../../domain/ports/vehicle-repository.port';
import { CreateVehicleDto } from '../dto/create-vehicle.dto';
import { DomainConflictException } from '../../../../common/exceptions/domain.exception';
import { EventPublisherPort } from '../../../../common/messaging/ports/event-publisher.port';

@Injectable()
export class CreateVehicleUseCase {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly vehicleRepository: VehicleRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(dto: CreateVehicleDto, createdBy: string): Promise<void> {
    if (await this.vehicleRepository.findByLicensePlate(dto.licensePlate)) {
      throw new DomainConflictException('Veículo com essa placa já existe');
    }

    if (await this.vehicleRepository.findByChassis(dto.chassis)) {
      throw new DomainConflictException('Veículo com esse chassi já existe');
    }

    if (await this.vehicleRepository.findByRenavam(dto.renavam)) {
      throw new DomainConflictException('Veículo com esse RENAVAM já existe');
    }

    const vehicle = new Vehicle(
      randomUUID(),
      dto.licensePlate,
      dto.chassis,
      dto.renavam,
      dto.year,
      dto.modelId,
      createdBy,
    );

    await this.vehicleRepository.create(vehicle);
    await this.cacheManager.del('vehicles:all');

    await this.eventPublisher.publish({
      eventType: 'VEHICLE_CREATED',
      userId: createdBy,
      resource: 'vehicles',
      resourceId: vehicle.id,
      createdAt: new Date(),
    });
  }
}
