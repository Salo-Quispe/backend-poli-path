import { Module } from '@nestjs/common';
import { OfficeService } from './office.service';
import { OfficeController } from './office.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Office } from './entities/office.entity';
import { BuildingsModule } from '../buildings/buildings.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  controllers: [OfficeController],
  providers: [OfficeService],
  imports: [TypeOrmModule.forFeature([Office]), BuildingsModule, AuthModule],
  exports: [OfficeService, TypeOrmModule],
})
export class OfficeModule {}
