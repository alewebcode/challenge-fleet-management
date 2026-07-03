import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/users/adapters/jwt/jwt-auth.guard';
import {
  CurrentUser,
  type AuthenticatedUser,
} from 'src/modules/users/adapters/decorators/current-user.decorator';
import { FindBrandByIdUseCase } from 'src/modules/brands/application/use-cases/find-brand-by-id.use-case';

@Controller('brands')
export class FindByIdController {
  constructor(private readonly findBrandByIdUseCase: FindBrandByIdUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.findBrandByIdUseCase.execute(id, user.userId);
  }
}
