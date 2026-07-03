import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehicleOrmEntity } from './adapters/typeorm/entities/vehicle.orm-entity';
import { ModelOrmEntity } from '../models/adapters/typeorm/entities/models.orm-entity';
import { CreateController } from './adapters/http/controllers/create.controller';
import { UpdateController } from './adapters/http/controllers/update.controller';
import { DeleteController } from './adapters/http/controllers/delete.controller';
import { FindByIdController } from './adapters/http/controllers/find-by-id.controller';
import { FindAllController } from './adapters/http/controllers/find-all.controller';
import { CreateVehicleUseCase } from './application/use-cases/create-vehicle.use-case';
import { UpdateVehicleUseCase } from './application/use-cases/update-vehicle.use-case';
import { DeleteVehicleUseCase } from './application/use-cases/delete-vehicle.use-case';
import { FindVehicleByIdUseCase } from './application/use-cases/find-vehicle-by-id.use-case';
import { FindAllVehiclesUseCase } from './application/use-cases/find-all-vehicles.use-case';
import { VehicleRepositoryPort } from './domain/ports/vehicle-repository.port';
import { VehicleRepository } from './adapters/typeorm/repositories/vehicle.repository';
import { MessagingModule } from 'src/common/messaging/messaging.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([VehicleOrmEntity, ModelOrmEntity]),
    MessagingModule,
  ],
  controllers: [
    CreateController,
    UpdateController,
    DeleteController,
    FindByIdController,
    FindAllController,
  ],
  providers: [
    CreateVehicleUseCase,
    UpdateVehicleUseCase,
    DeleteVehicleUseCase,
    FindVehicleByIdUseCase,
    FindAllVehiclesUseCase,

    { provide: VehicleRepositoryPort, useClass: VehicleRepository },
  ],
})
export class VehiclesModule {}
