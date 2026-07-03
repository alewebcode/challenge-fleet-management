import { Injectable } from '@nestjs/common';
import { UserRepositoryPort } from '../../domain/ports/user-repository.port';
import { PasswordHasherPort } from '../../domain/ports/password-hasher.port';
import { TokenGeneratorPort } from '../../domain/ports/token-generator.port';
import { DomainUnauthorizedException } from '../../../../common/exceptions/domain.exception';

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
    private readonly tokenGenerator: TokenGeneratorPort,
  ) {}

  async execute(
    login: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user =
      (await this.userRepository.findByNickname(login)) ||
      (await this.userRepository.findByEmail(login));

    if (!user) {
      throw new DomainUnauthorizedException('Credenciais inválidas');
    }
    const isPasswordValid = await this.passwordHasher.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new DomainUnauthorizedException('Credenciais inválidas');
    }

    const accessToken = await this.tokenGenerator.generateToken({
      sub: user.id,
      nickname: user.nickname,
    });

    const userName = {
      userName: user.name,
      accessToken,
    };

    return { ...userName };
  }
}
