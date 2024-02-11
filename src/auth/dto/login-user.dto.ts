import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IsOrganizationEmail } from '../../common/decorators/email.decorator';

export class LoginUserDto {
  @IsString()
  @IsEmail()
  @IsOrganizationEmail({
    message:
      'El correo debe ser institucional de la Escuela Politécnica Nacional',
  })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe tener una letra mayúscula, una minúscula y un número',
  })
  password: string;
}
