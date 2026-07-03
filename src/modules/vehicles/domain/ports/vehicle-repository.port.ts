import { Vehicle } from '../entities/vehicle.entity';

export abstract class VehicleRepositoryPort {
  abstract findById(id: string): Promise<Vehicle | null>;
  abstract findAll(): Promise<Vehicle[]>;
  abstract create(vehicle: Vehicle): Promise<void>;
  abstract update(vehicle: Vehicle): Promise<void>;
  abstract delete(id: string): Promise<void>;
  abstract findByLicensePlate(plate: string): Promise<Vehicle | null>;
  abstract findByChassis(chassis: string): Promise<Vehicle | null>;
  abstract findByRenavam(renavam: string): Promise<Vehicle | null>;
  abstract findByModelId(modelId: string): Promise<Vehicle[]>;
}
