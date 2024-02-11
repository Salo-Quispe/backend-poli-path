import { Module } from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { FacultyController } from './faculty.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faculty } from './entities/faculty.entity';
import { BuildingsModule } from '../buildings/buildings.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  controllers: [FacultyController],
  providers: [FacultyService],
  imports: [TypeOrmModule.forFeature([Faculty]), BuildingsModule, AuthModule],
  exports: [FacultyService, TypeOrmModule],
})
export class FacultyModule {}
