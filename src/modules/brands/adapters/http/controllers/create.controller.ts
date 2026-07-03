import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/users/adapters/jwt/jwt-auth.guard';
import { CurrentUser } from 'src/modules/users/adapters/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/modules/users/adapters/decorators/current-user.decorator';
import { CreateBrandDto } from 'src/modules/brands/application/dto/create-brand.dto';
import { CreateBrandUseCase } from 'src/modules/brands/application/use-cases/create-brand.use-case';

@Controller('brands')
export class CreateController {
  constructor(private readonly createBrandUseCase: CreateBrandUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Body() dto: CreateBrandDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.createBrandUseCase.execute(dto, user.userId);
  }
}
