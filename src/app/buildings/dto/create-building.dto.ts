import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateBuildingDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsPositive()
  @IsNumber()
  no: number;

  @IsNumber()
  longitude: number;

  @IsNumber()
  latitude: number;

  @IsString()
  @IsOptional()
  @MinLength(3)
  description?: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  address?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  imageUrls?: string[];
}
