import { IsInt, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  licensePlate?: string;

  @IsOptional()
  @IsString()
  chassis?: string;

  @IsOptional()
  @IsString()
  renavam?: string;

  @IsOptional()
  @IsInt()
  @Min(1886)
  @Max(new Date().getFullYear() + 1)
  year?: number;

  @IsOptional()
  @IsUUID()
  modelId?: string;
}
