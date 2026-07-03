import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateModelDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsUUID()
  brandId?: string;
}
