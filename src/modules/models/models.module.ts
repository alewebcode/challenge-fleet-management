import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateController } from './adapters/http/controllers/create.controller';
import { UpdateController } from './adapters/http/controllers/update.controller';
import { DeleteController } from './adapters/http/controllers/delete.controller';
import { FindByIdController } from './adapters/http/controllers/find-by-id.controller';
import { FindAllController } from './adapters/http/controllers/find-all.controller';
import { ModelOrmEntity } from './adapters/typeorm/entities/models.orm-entity';
import { CreateModelUseCase } from './application/use-cases/create-model.use-case';
import { UpdateModelUseCase } from './application/use-cases/update-model.use-case';
import { DeleteModelUseCase } from './application/use-cases/delete-model.use-case';
import { FindModelByIdUseCase } from './application/use-cases/find-model-by-id.use-case';
import { FindAllModelsUseCase } from './application/use-cases/find-all-models.use-case';
import { ModelRepositoryPort } from './domain/ports/model-repository.port';
import { ModelRepository } from './adapters/typeorm/repositories/model.repository';
import { Module } from '@nestjs/common';
import { MessagingModule } from 'src/common/messaging/messaging.module';
import { VehicleOrmEntity } from '../vehicles/adapters/typeorm/entities/vehicle.orm-entity';
import { VehicleRepositoryPort } from '../vehicles/domain/ports/vehicle-repository.port';
import { VehicleRepository } from '../vehicles/adapters/typeorm/repositories/vehicle.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModelOrmEntity, VehicleOrmEntity]),
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
    CreateModelUseCase,
    UpdateModelUseCase,
    DeleteModelUseCase,
    FindModelByIdUseCase,
    FindAllModelsUseCase,

    { provide: ModelRepositoryPort, useClass: ModelRepository },
    { provide: VehicleRepositoryPort, useClass: VehicleRepository },
  ],
  exports: [CreateModelUseCase],
})
export class ModelsModule {}
