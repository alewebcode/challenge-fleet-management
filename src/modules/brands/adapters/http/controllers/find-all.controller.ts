import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/users/adapters/jwt/jwt-auth.guard';

import {
  type AuthenticatedUser,
  CurrentUser,
} from 'src/modules/users/adapters/decorators/current-user.decorator';
import { FindAllBrandsUseCase } from 'src/modules/brands/application/use-cases/find-all-brands.use-case';

@Controller('brands')
export class FindAllController {
  constructor(private readonly findAllBrandsUseCase: FindAllBrandsUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.findAllBrandsUseCase.execute(user.userId);
  }
}
