import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/users/adapters/jwt/jwt-auth.guard';
import {
  CurrentUser,
  type AuthenticatedUser,
} from 'src/modules/users/adapters/decorators/current-user.decorator';
import { FindModelByIdUseCase } from 'src/modules/models/application/use-cases/find-model-by-id.use-case';

@Controller('models')
export class FindByIdController {
  constructor(private readonly findModelByIdUseCase: FindModelByIdUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.findModelByIdUseCase.execute(id, user.userId);
  }
}
