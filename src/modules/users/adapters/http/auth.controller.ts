import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from '../../application/dto/login.dto';
import { LoginUseCase } from '../../application/use-cases/login.use-case';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  async login(@Body() { login, password }: LoginDto) {
    return this.loginUseCase.execute(login, password);
  }
}
