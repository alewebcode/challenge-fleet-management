import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle } from 'src/modules/vehicles/domain/entities/vehicle.entity';
import { VehicleRepositoryPort } from 'src/modules/vehicles/domain/ports/vehicle-repository.port';
import { VehicleOrmEntity } from '../entities/vehicle.orm-entity';
import { VehicleMapper } from '../mappers/vehicle.mapper';

export class VehicleRepository implements VehicleRepositoryPort {
  constructor(
    @InjectRepository(VehicleOrmEntity)
    private readonly vehicleRepository: Repository<VehicleOrmEntity>,
  ) {}

  async create(vehicle: Vehicle): Promise<void> {
    await this.vehicleRepository.save(VehicleMapper.toOrm(vehicle));
  }

  async findById(id: string): Promise<Vehicle | null> {
    const orm = await this.vehicleRepository.findOne({
      where: { id },
      relations: ['model'],
    });
    return orm ? VehicleMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<Vehicle[]> {
    const orms = await this.vehicleRepository.find({ relations: ['model'] });
    return orms.map((orm) => VehicleMapper.toDomain(orm));
  }

  async update(vehicle: Vehicle): Promise<void> {
    await this.vehicleRepository.save(VehicleMapper.toOrm(vehicle));
  }

  async delete(id: string): Promise<void> {
    await this.vehicleRepository.delete({ id });
  }

  async findByLicensePlate(plate: string): Promise<Vehicle | null> {
    const orm = await this.vehicleRepository.findOne({
      where: { licensePlate: plate },
      relations: ['model'],
    });
    return orm ? VehicleMapper.toDomain(orm) : null;
  }

  async findByChassis(chassis: string): Promise<Vehicle | null> {
    const orm = await this.vehicleRepository.findOne({
      where: { chassis },
      relations: ['model'],
    });
    return orm ? VehicleMapper.toDomain(orm) : null;
  }

  async findByRenavam(renavam: string): Promise<Vehicle | null> {
    const orm = await this.vehicleRepository.findOne({
      where: { renavam },
      relations: ['model'],
    });
    return orm ? VehicleMapper.toDomain(orm) : null;
  }
  async findByModelId(modelId: string): Promise<Vehicle[]> {
    const orms = await this.vehicleRepository.find({
      where: { model: { id: modelId } },
      relations: ['model'],
    });
    return orms.map((orm) => VehicleMapper.toDomain(orm));
  }
}
