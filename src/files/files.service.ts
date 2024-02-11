import { Injectable, BadRequestException } from '@nestjs/common';
import { join } from 'path';
import { fileExistsSync } from 'tsconfig-paths/lib/filesystem';
import { BuildingsService } from '../app/buildings/buildings.service';
import { FacultyService } from '../app/faculty/faculty.service';
import { LaboratoryService } from '../app/laboratory/laboratory.service';
import { OfficeService } from '../app/office/office.service';
import { PointOfInterestService } from '../app/point-of-interest/point-of-interest.service';

@Injectable()
export class FilesService {
  constructor(
    readonly buildingsService: BuildingsService,
    readonly facultiesService: FacultyService,
    readonly laboratoriesService: LaboratoryService,
    readonly officesService: OfficeService,
    readonly pointsOfInterestService: PointOfInterestService,
  ) {}

  private getStaticImage(type: string, imageName: string) {
    const path = join(__dirname, `../../static/${type}`, imageName);
    if (!fileExistsSync(path)) {
      throw new BadRequestException('Imagen no encontrada', imageName);
    }
    return path;
  }

  private getStaticImageWithId(type: string, id: string, imageName: string) {
    const path = join(__dirname, `../../static/${type}/${id}`, imageName);
    if (!fileExistsSync(path)) {
      throw new BadRequestException('Imagen no encontrada', imageName);
    }
    return path;
  }

  getStaticProfileImage(imageName: string) {
    return this.getStaticImage('profile-images', imageName);
  }

  getStaticBuildingImage(id: string, imageName: string) {
    return this.getStaticImageWithId('buildings', id, imageName);
  }

  getStaticFacultyImage(id: string, imageName: string) {
    return this.getStaticImageWithId('faculties', id, imageName);
  }

  getStaticLaboratoryImage(id: string, imageName: string) {
    return this.getStaticImageWithId('laboratories', id, imageName);
  }

  getStaticOfficeImage(id: string, imageName: string) {
    return this.getStaticImageWithId('offices', id, imageName);
  }

  getStaticPointOfInterestImage(id: string, imageName: string) {
    return this.getStaticImageWithId('points-of-interest', id, imageName);
  }
}
