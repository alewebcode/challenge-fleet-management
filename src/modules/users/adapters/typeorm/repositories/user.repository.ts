import { InjectRepository } from '@nestjs/typeorm';
import { UserOrmEntity } from '../entities/user.orm-entity';
import { Repository } from 'typeorm';
import { UserRepositoryPort } from 'src/modules/users/domain/ports/user-repository.port';
import { User } from 'src/modules/users/domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

export class UserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly userRepository: Repository<UserOrmEntity>,
  ) {}

  async findByNickname(nickname: string): Promise<User | null> {
    const orm = await this.userRepository.findOneBy({ nickname });
    return orm ? UserMapper.toDomain(orm) : null;
  }
  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.userRepository.findOneBy({ email });
    return orm ? UserMapper.toDomain(orm) : null;
  }
}
