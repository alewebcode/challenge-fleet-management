import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/users/adapters/jwt/jwt-auth.guard';
import { UpdateModelDto } from 'src/modules/models/application/dto/update-model.dto';
import { UpdateModelUseCase } from 'src/modules/models/application/use-cases/update-model.use-case';

@Controller('models')
export class UpdateController {
  constructor(private readonly updateModelUseCase: UpdateModelUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateModelDto) {
    return this.updateModelUseCase.execute(id, dto);
  }
}
