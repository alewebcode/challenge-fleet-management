import { IsInt, IsNotEmpty, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateVehicleDto {
  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @IsString()
  @IsNotEmpty()
  chassis: string;

  @IsString()
  @IsNotEmpty()
  renavam: string;

  @IsInt()
  @Min(1886)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsUUID()
  @IsNotEmpty()
  modelId: string;
}
