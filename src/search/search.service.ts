import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Building } from '../app/buildings/entities/building.entity';
import { Faculty } from '../app/faculty/entities/faculty.entity';
import { Office } from '../app/office/entities/office.entity';
import { Laboratory } from '../app/laboratory/entities/laboratory.entity';
import { PointOfInterest } from '../app/point-of-interest/entities/point-of-interest.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
    @InjectRepository(Laboratory)
    private readonly laboratoryRepository: Repository<Laboratory>,
    @InjectRepository(PointOfInterest)
    private readonly pointOfInterestRepository: Repository<PointOfInterest>,
  ) {}

  private async searchEntity<T>(
    repository: Repository<T>,
    search: string,
  ): Promise<T[]> {
    try {
      let query = repository.createQueryBuilder('entity');

      if (repository.metadata.targetName !== 'Building') {
        query = query.leftJoinAndSelect('entity.building', 'building');
      }

      return await query
        .where(`LOWER(entity.name) LIKE LOWER(:search)`, {
          search: `%${search}%`,
        })
        .getMany();
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async searchAllEntities(search: string) {
    try {
      const [
        buildingResults,
        facultyResults,
        officeResults,
        laboratoryResults,
        pointOfInterestResults,
      ] = await Promise.all([
        this.searchEntity(this.buildingRepository, search),
        this.searchEntity(this.facultyRepository, search),
        this.searchEntity(this.officeRepository, search),
        this.searchEntity(this.laboratoryRepository, search),
        this.searchEntity(this.pointOfInterestRepository, search),
      ]);

      return {
        buildings: this.mapToEntityData(buildingResults, 'Edificio'),
        faculties: this.mapToEntityData(facultyResults, 'Facultad'),
        offices: this.mapToEntityData(officeResults, 'Oficina'),
        laboratories: this.mapToEntityData(laboratoryResults, 'Laboratorio'),
        pointsOfInterest: this.mapToEntityData(
          pointOfInterestResults,
          'Punto de interés',
        ),
      };
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  private mapToEntityData(entities: any[], entityName: string) {
    return entities.map((entity) => ({
      id: entity.id,
      buildingId: entity.building ? entity.building.id : null,
      name: entity.name,
      description: entity.description,
      type: entityName,
      location: {
        latitude: entity.building ? entity.building.latitude : entity.latitude,
        longitude: entity.building
          ? entity.building.longitude
          : entity.longitude,
      },
    }));
  }
}
