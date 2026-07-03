import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/users/adapters/jwt/jwt-auth.guard';
import {
  CurrentUser,
  type AuthenticatedUser,
} from 'src/modules/users/adapters/decorators/current-user.decorator';
import { FindVehicleByIdUseCase } from 'src/modules/vehicles/application/use-cases/find-vehicle-by-id.use-case';

@Controller('vehicles')
export class FindByIdController {
  constructor(
    private readonly findVehicleByIdUseCase: FindVehicleByIdUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.findVehicleByIdUseCase.execute(id, user.userId);
  }
}
