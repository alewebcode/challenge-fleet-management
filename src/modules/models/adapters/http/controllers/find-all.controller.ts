import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/users/adapters/jwt/jwt-auth.guard';
import {
  CurrentUser,
  type AuthenticatedUser,
} from 'src/modules/users/adapters/decorators/current-user.decorator';
import { FindAllModelsUseCase } from 'src/modules/models/application/use-cases/find-all-models.use-case';

@Controller('models')
export class FindAllController {
  constructor(private readonly findAllModelsUseCase: FindAllModelsUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.findAllModelsUseCase.execute(user.userId);
  }
}
