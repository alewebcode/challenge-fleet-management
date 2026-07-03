import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/users/adapters/jwt/jwt-auth.guard';
import { UpdateVehicleDto } from 'src/modules/vehicles/application/dto/update-vehicle.dto';
import { UpdateVehicleUseCase } from 'src/modules/vehicles/application/use-cases/update-vehicle.use-case';

@Controller('vehicles')
export class UpdateController {
  constructor(private readonly updateVehicleUseCase: UpdateVehicleUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateVehicleDto) {
    return this.updateVehicleUseCase.execute(id, dto);
  }
}
