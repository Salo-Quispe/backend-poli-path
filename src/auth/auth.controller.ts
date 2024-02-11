import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
  Render,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../app/user/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { User } from '../app/user/entities/user.entity';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { ValidRoles } from './interfaces/valid-roles.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('admin-register')
  @Auth(ValidRoles.admin)
  adminRegister(@Body() createUserDto: CreateUserDto) {
    return this.authService.adminRegister(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Patch('change-password')
  @HttpCode(200)
  @Auth(ValidRoles.user, ValidRoles.admin)
  changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }

  @Post('recover-password')
  @Auth(ValidRoles.user, ValidRoles.admin)
  @HttpCode(200)
  recoverPassword(@Body('password') password: string, @GetUser() user: User) {
    return this.authService.recoverPassword(password, user);
  }

  @Get('confirm-token')
  @Render('recover-password')
  confirmToken(@Query('token') token: string) {
    return this.authService.checkTokenForRecoverPassword(token);
  }

  @Get('confirm-email/:token')
  @Render('confirm-email')
  confirmEmail(@Param('token') token: string) {
    console.log('Renderizando confirm-email');
    return this.authService.checkTokenForConfirmEmail(token);
  }

  @Get('recover-password/:email')
  sendEmailForRecoverPassword(@Param('email') email: string) {
    return this.authService.sendEmailForRecoverPassword(email);
  }

  @Get('check-auth-status')
  @Auth(ValidRoles.user, ValidRoles.admin)
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('success-recover-password')
  @Render('success-recover-password')
  successRecoverPassword() {
    return {};
  }
}
