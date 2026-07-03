import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/users/adapters/jwt/jwt-auth.guard';
import { DeleteBrandUseCase } from 'src/modules/brands/application/use-cases/delete-brand.use-case';
import {
  CurrentUser,
  type AuthenticatedUser,
} from 'src/modules/users/adapters/decorators/current-user.decorator';

@Controller('brands')
export class DeleteController {
  constructor(private readonly deleteBrandUseCase: DeleteBrandUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.deleteBrandUseCase.execute(id, user.userId);
  }
}
