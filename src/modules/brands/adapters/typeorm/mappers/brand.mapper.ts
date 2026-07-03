import { Brand } from 'src/modules/brands/domain/entities/brand.entity';
import { BrandOrmEntity } from '../entities/brands.orm-entity';
import { ModelOrmEntity } from 'src/modules/models/adapters/typeorm/entities/models.orm-entity';

export class BrandMapper {
  static toDomain(orm: BrandOrmEntity): Brand {
    return new Brand(orm.id, orm.name, orm.createdBy);
  }

  static toOrm(domain: Brand): BrandOrmEntity {
    const orm = new BrandOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.createdBy = domain.createdBy;

    return orm;
  }
}
