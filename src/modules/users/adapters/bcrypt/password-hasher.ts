import { PasswordHasherPort } from '../../domain/ports/password-hasher.port';
import * as bcrypt from 'bcrypt';

export class PasswordHasher implements PasswordHasherPort {
  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
