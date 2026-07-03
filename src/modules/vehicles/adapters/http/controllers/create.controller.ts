import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/users/adapters/jwt/jwt-auth.guard';
import { CurrentUser } from 'src/modules/users/adapters/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/modules/users/adapters/decorators/current-user.decorator';
import { CreateVehicleDto } from 'src/modules/vehicles/application/dto/create-vehicle.dto';
import { CreateVehicleUseCase } from 'src/modules/vehicles/application/use-cases/create-vehicle.use-case';

@Controller('vehicles')
export class CreateController {
  constructor(private readonly createVehicleUseCase: CreateVehicleUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(
    @Body() dto: CreateVehicleDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.createVehicleUseCase.execute(dto, user.userId);
  }
}
