import { User } from '../entities/user.entity';

export abstract class UserRepositoryPort {
  abstract findByNickname(nickname: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
}
