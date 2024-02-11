import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { BuildingsModule } from '../app/buildings/buildings.module';
import { AuthModule } from '../auth/auth.module';
import { FacultyModule } from '../app/faculty/faculty.module';
import { OfficeModule } from '../app/office/office.module';
import { LaboratoryModule } from '../app/laboratory/laboratory.module';
import { PointOfInterestModule } from '../app/point-of-interest/point-of-interest.module';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [
    AuthModule,
    BuildingsModule,
    FacultyModule,
    OfficeModule,
    LaboratoryModule,
    FacultyModule,
    PointOfInterestModule,
  ],
})
export class SearchModule {}
