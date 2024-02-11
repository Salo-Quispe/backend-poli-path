import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../app/user/user.module';
import { BuildingsModule } from '../app/buildings/buildings.module';
import { FacultyModule } from '../app/faculty/faculty.module';
import { ImageService } from './images/images.service';
import { LaboratoryModule } from '../app/laboratory/laboratory.module';
import { OfficeModule } from '../app/office/office.module';
import { PointOfInterestModule } from '../app/point-of-interest/point-of-interest.module';
import * as fs from 'fs';
import * as path from 'path';

@Module({
  controllers: [FilesController],
  providers: [FilesService, ImageService],
  imports: [
    ConfigModule,
    AuthModule,
    UserModule,
    BuildingsModule,
    FacultyModule,
    LaboratoryModule,
    OfficeModule,
    PointOfInterestModule,
  ],
})
export class FilesModule {
  printStaticFiles() {
    const staticDir = path.join(__dirname, 'static');

    fs.readdir(staticDir, (err, files) => {
      if (err) {
        console.error(`Error reading directory: ${err}`);
        return;
      }

      files.forEach((file) => {
        console.log(file);
      });
    });
  }

  constructor() {
    this.printStaticFiles();
  }
}
