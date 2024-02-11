import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreatePointOfInterestDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  description: string;

  @IsString()
  @IsUUID()
  buildingId: string;
}
