export abstract class PasswordHasherPort {
  abstract compare(password: string, hashedPassword: string): Promise<boolean>;
}
