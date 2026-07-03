import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/users/adapters/jwt/jwt-auth.guard';
import {
  CurrentUser,
  type AuthenticatedUser,
} from 'src/modules/users/adapters/decorators/current-user.decorator';
import { FindAllVehiclesUseCase } from 'src/modules/vehicles/application/use-cases/find-all-vehicles.use-case';

@Controller('vehicles')
export class FindAllController {
  constructor(
    private readonly findAllVehiclesUseCase: FindAllVehiclesUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.findAllVehiclesUseCase.execute(user.userId);
  }
}
