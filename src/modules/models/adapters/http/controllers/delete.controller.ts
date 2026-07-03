import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/users/adapters/jwt/jwt-auth.guard';
import { DeleteModelUseCase } from 'src/modules/models/application/use-cases/delete-model.use-case';
import {
  CurrentUser,
  type AuthenticatedUser,
} from 'src/modules/users/adapters/decorators/current-user.decorator';

@Controller('models')
export class DeleteController {
  constructor(private readonly deleteModelUseCase: DeleteModelUseCase) {}

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.deleteModelUseCase.execute(id, user.userId);
  }
}
