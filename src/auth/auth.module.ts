import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../app/user/user.module';
import { AuthService } from './auth.service';
import { MailModule } from '../mail/mail.module';

@Module({
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
  imports: [
    ConfigModule,
    UserModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule, UserModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET_KEY'),
          signOptions: { expiresIn: '2h' },
        };
      },
    }),
    MailModule,
  ],
  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
