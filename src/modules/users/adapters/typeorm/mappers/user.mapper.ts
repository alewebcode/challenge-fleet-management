import { User } from 'src/modules/users/domain/entities/user.entity';
import { UserOrmEntity } from '../entities/user.orm-entity';

export class UserMapper {
  static toDomain(orm: UserOrmEntity): User {
    return new User(orm.id, orm.nickname, orm.name, orm.email, orm.password);
  }
  static toOrm(domain: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = domain.id;
    orm.nickname = domain.nickname;
    orm.name = domain.name;
    orm.email = domain.email;
    orm.password = domain.password;
    return orm;
  }
}
