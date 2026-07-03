import { PassportModule } from '@nestjs/passport';
import { AuthController } from './adapters/http/auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { JwtStrategy } from './adapters/jwt/jwt.strategy';
import { JwtAuthGuard } from './adapters/jwt/jwt-auth.guard';
import { UserRepositoryPort } from './domain/ports/user-repository.port';
import { UserRepository } from './adapters/typeorm/repositories/user.repository';
import { TokenGeneratorPort } from './domain/ports/token-generator.port';
import { JwtGenerateToken } from './adapters/jwt/jwt-generate-token';
import { PasswordHasherPort } from './domain/ports/password-hasher.port';
import { PasswordHasher } from './adapters/bcrypt/password-hasher';
import { UserOrmEntity } from './adapters/typeorm/entities/user.orm-entity';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    JwtStrategy,
    JwtAuthGuard,
    { provide: UserRepositoryPort, useClass: UserRepository },
    { provide: TokenGeneratorPort, useClass: JwtGenerateToken },
    { provide: PasswordHasherPort, useClass: PasswordHasher },
  ],
  exports: [JwtAuthGuard],
})
export class UsersModule {}
