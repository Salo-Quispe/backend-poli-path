import { Module } from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { BuildingsController } from './buildings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Building } from './entities/building.entity';
import { AuthModule } from '../../auth/auth.module';

@Module({
  controllers: [BuildingsController],
  providers: [BuildingsService],
  imports: [TypeOrmModule.forFeature([Building]), AuthModule],
  exports: [BuildingsService, TypeOrmModule],
})
export class BuildingsModule {}
