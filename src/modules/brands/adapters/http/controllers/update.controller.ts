import { Body, Controller, Param, Put, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/users/adapters/jwt/jwt-auth.guard';
import { UpdateBrandDto } from 'src/modules/brands/application/dto/update-brand.dto';
import { UpdateBrandUseCase } from 'src/modules/brands/application/use-cases/update-brand.use-case';

@Controller('brands')
export class UpdateController {
  constructor(private readonly updateBrandUseCase: UpdateBrandUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBrandDto) {
    return this.updateBrandUseCase.execute(id, dto);
  }
}
