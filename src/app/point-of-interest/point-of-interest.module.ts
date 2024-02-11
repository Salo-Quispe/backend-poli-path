import { Module } from '@nestjs/common';
import { PointOfInterestService } from './point-of-interest.service';
import { PointOfInterestController } from './point-of-interest.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PointOfInterest } from './entities/point-of-interest.entity';
import { BuildingsModule } from '../buildings/buildings.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  controllers: [PointOfInterestController],
  providers: [PointOfInterestService],
  imports: [
    TypeOrmModule.forFeature([PointOfInterest]),
    BuildingsModule,
    AuthModule,
  ],
  exports: [PointOfInterestService, TypeOrmModule],
})
export class PointOfInterestModule {}
