import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandOrmEntity } from './adapters/typeorm/entities/brands.orm-entity';
import { CreateController } from './adapters/http/controllers/create.controller';
import { UpdateController } from './adapters/http/controllers/update.controller';
import { DeleteController } from './adapters/http/controllers/delete.controller';
import { FindByIdController } from './adapters/http/controllers/find-by-id.controller';
import { FindAllController } from './adapters/http/controllers/find-all.controller';
import { CreateBrandUseCase } from './application/use-cases/create-brand.use-case';
import { UpdateBrandUseCase } from './application/use-cases/update-brand.use-case';
import { DeleteBrandUseCase } from './application/use-cases/delete-brand.use-case';
import { FindBrandByIdUseCase } from './application/use-cases/find-brand-by-id.use-case';
import { FindAllBrandsUseCase } from './application/use-cases/find-all-brands.use-case';
import { BrandRepositoryPort } from './domain/ports/brand-repository.port';
import { BrandRepository } from './adapters/typeorm/repositories/brand.repository';
import { MessagingModule } from 'src/common/messaging/messaging.module';
import { ModelRepositoryPort } from '../models/domain/ports/model-repository.port';
import { ModelRepository } from '../models/adapters/typeorm/repositories/model.repository';
import { ModelOrmEntity } from '../models/adapters/typeorm/entities/models.orm-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BrandOrmEntity, ModelOrmEntity]),
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
    CreateBrandUseCase,
    UpdateBrandUseCase,
    DeleteBrandUseCase,
    FindBrandByIdUseCase,
    FindAllBrandsUseCase,

    { provide: BrandRepositoryPort, useClass: BrandRepository },
    { provide: ModelRepositoryPort, useClass: ModelRepository },
  ],
})
export class BrandsModule {}
