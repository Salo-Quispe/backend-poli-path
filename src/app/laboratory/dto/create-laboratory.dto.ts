import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateLaboratoryDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  description: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  buildingId: string;
}
