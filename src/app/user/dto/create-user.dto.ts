import {
  IsDateString,
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsOrganizationEmail } from '../../../common/decorators/email.decorator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name;

  @IsString()
  @MinLength(3)
  lastname;

  @IsString()
  @MinLength(3)
  @IsEmail()
  @IsOrganizationEmail({
    message:
      'El correo debe ser institucional de la Escuela Politécnica Nacional',
  })
  email;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  registerDate;

  roles?: string[];
}
