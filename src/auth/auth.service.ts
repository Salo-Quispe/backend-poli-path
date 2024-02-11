import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../app/user/dto/create-user.dto';
import { UserService } from '../app/user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { ValidRoles } from './interfaces/valid-roles.interface';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from '../app/user/entities/user.entity';
import {
  isCorrectPassword,
  isOrganizationEmail,
} from '../common/validators/polipath-validators';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  private getJWTToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private generateJWTTokenForRecoverPassword(payload: JwtPayload) {
    return this.jwtService.sign(payload, {
      expiresIn: '1h',
    });
  }

  private verifyToken(token: string) {
    try {
      return this.jwtService.verify(token) as JwtPayload;
    } catch (error) {
      this.handleTokenError(error);
    }
  }

  private validateUserAndToken(user: User, token: string) {
    if (user.recoverPasswordToken !== token) {
      throw new BadRequestException('Token inválido');
    }
  }

  private handleTokenError(error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new BadRequestException('Token expirado');
    }
    if (
      error.name === 'JsonWebTokenError' &&
      ['jwt malformed', 'invalid signature', 'invalid token'].includes(
        error.message,
      )
    ) {
      throw new BadRequestException('Token inválido');
    }

    throw error;
  }

  private async createUserAndSendEmail(
    userDto: CreateUserDto,
    roles: ValidRoles[],
  ) {
    let user: User;

    try {
      const { password, ...userData } = userDto;

      user = await this.userService.create({
        ...userData,
        password: await bcrypt.hash(password, 10),
        roles: roles,
      });

      const token = this.getJWTToken({ id: user.id });

      await this.mailService.sendEmailConfirmation(user, token);

      return {
        ok: true,
        message:
          'Usuario creado correctamente, revisa tu correo para activarlo',
        status: 201,
      };
    } catch (error) {
      if (user) {
        await this.userService.remove(user.id);
      }
      throw error;
    }
  }

  async register(createUserDto: CreateUserDto) {
    return this.createUserAndSendEmail(createUserDto, [ValidRoles.user]);
  }

  async adminRegister(createUserDto: CreateUserDto) {
    return this.createUserAndSendEmail(createUserDto, [
      ValidRoles.admin,
      ValidRoles.user,
    ]);
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userService.findOneByEmailToLogin(email);

    if (!user) {
      throw new BadRequestException('Email o contraseña incorrectos');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Usuario no activo');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Usuario no verificado, revisa tu correo',
      );
    }

    delete user.password;

    return {
      ...user,
      token: this.getJWTToken({ id: user.id }),
    };
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { id, oldPassword, newPassword } = changePasswordDto;
    const user = await this.userService.findOneWithPassword(id);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      throw new BadRequestException('Contraseña incorrecta');
    }

    if (bcrypt.compareSync(newPassword, user.password)) {
      throw new BadRequestException(
        'La nueva contraseña debe ser diferente a la anterior',
      );
    }

    try {
      user.password = await bcrypt.hash(newPassword, 10);
      delete user.favoriteBuildings;
      await this.userService.update(id, user);

      return {
        message: 'Contraseña actualizada correctamente',
        ok: true,
        status: 200,
      };
    } catch (error) {
      throw error;
    }
  }

  async sendEmailForRecoverPassword(email: string) {
    if (!isOrganizationEmail(email)) {
      throw new BadRequestException(
        'El email no es válido, deber ser un correo institucional de la Escuela Politécnica Nacional',
      );
    }

    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const token = this.generateJWTTokenForRecoverPassword({ id: user.id });

    try {
      await this.mailService.sendEmailForRecoverPassword(user, token);
      user.recoverPasswordToken = token;
      delete user.favoriteBuildings;
      await this.userService.update(user.id, user);
      return {
        message: 'Email enviado correctamente',
        ok: true,
        status: 200,
      };
    } catch (error) {
      throw new BadRequestException('No se pudo enviar el correo');
    }
  }

  async checkTokenForRecoverPassword(token: string) {
    const decodedToken = this.verifyToken(token);
    const user = await this.userService.findOne(decodedToken.id);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    this.validateUserAndToken(user, token);

    return {
      message: 'Token válido',
      ok: true,
      status: 200,
    };
  }

  async checkTokenForConfirmEmail(token: string) {
    const decodedToken = this.verifyToken(token);
    const user = await this.userService.findOne(decodedToken.id);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (user.isVerified) {
      return {
        message: 'Email ya confirmado',
        ok: true,
        status: 200,
      };
    }

    user.isVerified = true;
    delete user.favoriteBuildings;
    await this.userService.update(user.id, user);

    return {
      message: 'Email confirmado correctamente',
      ok: true,
      status: 200,
    };
  }

  checkAuthStatus(user: User) {
    delete user.roles;
    delete user.isVerified;
    delete user.recoverPasswordToken;
    delete user.registerDate;
    return {
      ...user,
      token: this.getJWTToken({ id: user.id }),
    };
  }

  async recoverPassword(password: string, user: User) {
    if (!isCorrectPassword(password)) {
      throw new BadRequestException(
        'La contraseña no cumple con los requisitos mínimos de seguridad debe tener al menos una letra mayúscula, una minúscula y un número y debe tener entre 6 y 50 caracteres',
      );
    }

    const updatedUser = await this.userService.findOne(user.id);
    if (!updatedUser) {
      throw new BadRequestException('Usuario no encontrado');
    }

    updatedUser.password = await bcrypt.hash(password, 10);
    updatedUser.recoverPasswordToken = null;
    delete updatedUser.favoriteBuildings;
    await this.userService.update(user.id, updatedUser);

    return {
      message: 'Contraseña actualizada correctamente',
      ok: true,
      status: 200,
    };
  }
}
