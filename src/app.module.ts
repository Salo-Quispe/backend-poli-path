import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { Module } from '@nestjs/common';
import { BuildingsModule } from './app/buildings/buildings.module';
import { FacultyModule } from './app/faculty/faculty.module';
import { LaboratoryModule } from './app/laboratory/laboratory.module';
import { OfficeModule } from './app/office/office.module';
import { PointOfInterestModule } from './app/point-of-interest/point-of-interest.module';
import { UserModule } from './app/user/user.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { FilesModule } from './files/files.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    CommonModule,
    BuildingsModule,
    FacultyModule,
    LaboratoryModule,
    OfficeModule,
    PointOfInterestModule,
    UserModule,
    AuthModule,
    MailModule,
    FilesModule,
    SearchModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {
  constructor() {
    console.log('AppModule created');
    console.log('process.env.DB_HOST', process.env.DB_HOST);
    console.log('process.env.DB_PORT', process.env.DB_PORT);
    console.log('process.env.DB_NAME', process.env.DB_NAME);
    console.log('process.env.DB_USERNAME', process.env.DB_USERNAME);
    console.log('process.env.DB_PASSWORD', process.env.DB_PASSWORD);
    console.log('process.env.JWT_SECRET_KEY', process.env.JWT_SECRET_KEY);
    console.log('process.env.MAIL_HOST', process.env.MAIL_HOST);
    console.log('process.env.MAIL_PORT', process.env.MAIL_PORT);
    console.log('process.env.GMAIL_USER', process.env.GMAIL_USER);
    console.log('process.env.GMAIL_PASS', process.env.GMAIL_PASS);
  }
}
