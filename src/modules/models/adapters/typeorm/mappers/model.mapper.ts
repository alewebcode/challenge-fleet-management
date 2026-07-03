import { Model } from 'src/modules/models/domain/entities/model.entity';
import { ModelOrmEntity } from '../entities/models.orm-entity';
import { BrandOrmEntity } from 'src/modules/brands/adapters/typeorm/entities/brands.orm-entity';

export class ModelMapper {
  static toDomain(orm: ModelOrmEntity): Model {
    return new Model(orm.id, orm.name, orm.brand?.id ?? null, orm.createdBy);
  }

  static toOrm(domain: Model): ModelOrmEntity {
    const orm = new ModelOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.createdBy = domain.createdBy;

    if (domain.brandId) {
      const brand = new BrandOrmEntity();
      brand.id = domain.brandId;
      orm.brand = brand;
    } else {
      orm.brand = null as unknown as BrandOrmEntity;
    }
    return orm;
  }
}
