import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateOfficeDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsPositive()
  @IsNumber()
  codeOrNo: string;

  @IsString()
  @IsOptional()
  teacherName: string;

  @IsString()
  @IsOptional()
  schedule: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  description: string;

  @IsString()
  @IsUUID()
  buildingId: string;
}
