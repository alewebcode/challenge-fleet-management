import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/users/adapters/jwt/jwt-auth.guard';
import { CurrentUser } from 'src/modules/users/adapters/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/modules/users/adapters/decorators/current-user.decorator';
import { CreateModelDto } from 'src/modules/models/application/dto/create-model.dto';
import { CreateModelUseCase } from 'src/modules/models/application/use-cases/create-model.use-case';

@Controller('models')
export class CreateController {
  constructor(private readonly createModelUseCase: CreateModelUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Body() dto: CreateModelDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.createModelUseCase.execute(dto, user.userId);
  }
}
