import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/users/adapters/jwt/jwt-auth.guard';
import { DeleteVehicleUseCase } from 'src/modules/vehicles/application/use-cases/delete-vehicle.use-case';
import {
  CurrentUser,
  type AuthenticatedUser,
} from 'src/modules/users/adapters/decorators/current-user.decorator';

@Controller('vehicles')
export class DeleteController {
  constructor(private readonly deleteVehicleUseCase: DeleteVehicleUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.deleteVehicleUseCase.execute(id, user.userId);
  }
}
