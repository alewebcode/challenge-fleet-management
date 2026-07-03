import { Vehicle } from 'src/modules/vehicles/domain/entities/vehicle.entity';
import { VehicleOrmEntity } from '../entities/vehicle.orm-entity';
import { ModelOrmEntity } from 'src/modules/models/adapters/typeorm/entities/models.orm-entity';

export class VehicleMapper {
  static toDomain(orm: VehicleOrmEntity): Vehicle {
    return new Vehicle(
      orm.id,
      orm.licensePlate,
      orm.chassis,
      orm.renavam,
      orm.year,
      orm.model.id,
      orm.createdBy,
    );
  }

  static toOrm(domain: Vehicle): VehicleOrmEntity {
    const orm = new VehicleOrmEntity();
    orm.id = domain.id;
    orm.licensePlate = domain.licensePlate;
    orm.chassis = domain.chassis;
    orm.renavam = domain.renavam;
    orm.year = domain.year;
    orm.createdBy = domain.createdBy;

    const model = new ModelOrmEntity();
    model.id = domain.modelId;
    orm.model = model;

    return orm;
  }
}
