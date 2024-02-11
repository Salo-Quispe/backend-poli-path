import { Module } from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import { LaboratoryController } from './laboratory.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Laboratory } from './entities/laboratory.entity';
import { BuildingsModule } from '../buildings/buildings.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  controllers: [LaboratoryController],
  providers: [LaboratoryService],
  imports: [
    TypeOrmModule.forFeature([Laboratory]),
    BuildingsModule,
    AuthModule,
  ],
  exports: [LaboratoryService, TypeOrmModule],
})
export class LaboratoryModule {}
