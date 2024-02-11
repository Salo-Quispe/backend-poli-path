import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePointOfInterestDto } from './dto/create-point-of-interest.dto';
import { UpdatePointOfInterestDto } from './dto/update-point-of-interest.dto';
import { PointOfInterest } from './entities/point-of-interest.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuildingsService } from '../buildings/buildings.service';

@Injectable()
export class PointOfInterestService {
  constructor(
    @InjectRepository(PointOfInterest)
    private readonly pointOfInterestRepository: Repository<PointOfInterest>,
    private readonly buildingsService: BuildingsService,
  ) {}

  private async findBuilding(buildingId: string) {
    const building = await this.buildingsService.findOne(buildingId);
    if (!building) {
      throw new BadRequestException(`Building with id ${buildingId} not found`);
    }
    return building;
  }

  async create(createPointOfInterestDto: CreatePointOfInterestDto) {
    const building = await this.findBuilding(
      createPointOfInterestDto.buildingId,
    );
    try {
      const newPointOfInterest = await this.pointOfInterestRepository.create({
        building,
        ...createPointOfInterestDto,
      });
      await this.pointOfInterestRepository.save(newPointOfInterest);
      return await this.findOne(newPointOfInterest.id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return await this.pointOfInterestRepository.find();
  }

  async findOne(id: string) {
    const pointOfInterest = await this.pointOfInterestRepository
      .createQueryBuilder('point_of_interests')
      .leftJoin('point_of_interests.building', 'building')
      .addSelect(['point_of_interests.*', 'building.id', 'building.name'])
      .where('point_of_interests.id = :id', { id })
      .getOne();

    if (!pointOfInterest) {
      throw new BadRequestException(`PointOfInterest with id ${id} not found`);
    }
    return {
      type: 'Punto de interés',
      ...pointOfInterest,
    };
  }

  async update(id: string, updatePointOfInterestDto: UpdatePointOfInterestDto) {
    const { buildingId, ...rest } = updatePointOfInterestDto;
    if (buildingId) {
      const building = await this.findBuilding(buildingId);

      await this.pointOfInterestRepository.update(id, {
        ...rest,
        building,
      });
      return await this.findOne(id);
    }
    await this.pointOfInterestRepository.update(id, rest);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const pointOfInterest = await this.findOne(id);
    await this.pointOfInterestRepository.remove(pointOfInterest);
    return {
      ok: true,
      message: `PointOfInterest with id ${id} deleted successfully`,
      status: 200,
    };
  }

  private handleExceptions(error: any) {
    if (error.code === '23505') {
      console.error(`Error DB: ${error}`);
      throw new BadRequestException('Product already exists', error.detail);
    }
    console.error(`Error: ${error}`);
    throw new InternalServerErrorException('Unexpected error', error.detail);
  }

  async getSuggestions(search: string) {
    const pointOfInterest = await this.pointOfInterestRepository
      .createQueryBuilder('point_of_interests')
      .where('point_of_interests.name LIKE :search', { search: `%${search}%` })
      .getMany();
    return pointOfInterest.map((pointOfInterest) => pointOfInterest.name);
  }
}
