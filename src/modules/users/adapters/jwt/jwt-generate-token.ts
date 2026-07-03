import { JwtService } from '@nestjs/jwt';
import { TokenGeneratorPort } from '../../domain/ports/token-generator.port';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtGenerateToken implements TokenGeneratorPort {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(payload: {
    sub: string;
    nickname: string;
  }): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
