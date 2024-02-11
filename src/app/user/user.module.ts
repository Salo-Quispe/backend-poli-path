import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CommonModule } from '../../common/common.module';
import { AuthModule } from '../../auth/auth.module';
import { BuildingsModule } from '../buildings/buildings.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([User]),
    CommonModule,
    forwardRef(() => AuthModule),
    forwardRef(() => BuildingsModule),
  ],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
