import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Building } from './entities/building.entity';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building)
    private readonly buildingRepository: Repository<Building>,
  ) {}

  async create(createBuildingDto: CreateBuildingDto) {
    try {
      const newBuilding = this.buildingRepository.create(createBuildingDto);
      await this.buildingRepository.save(newBuilding);
      return newBuilding;
    } catch (error) {
      console.log(error);
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return await this.buildingRepository.find();
  }

  async findOne(id: string) {
    const building: Building = await this.buildingRepository.findOneBy({ id });
    if (!building) {
      throw new BadRequestException(`Building with id ${id} not found`);
    }
    return building;
  }

  async update(id: string, updateBuildingDto: UpdateBuildingDto) {
    const building = await this.findOne(id);
    if (!building) {
      throw new BadRequestException(`Building with id ${id} not found`);
    }
    await this.buildingRepository.update(id, updateBuildingDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const building = await this.findOne(id);
    await this.buildingRepository.remove(building);
  }

  private handleExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException('Product already exists', error.detail);
    }
    if (error.code === '23503') {
      throw new BadRequestException('Foreign key constraint', error.detail);
    }
    throw new InternalServerErrorException('Unexpected error', error.detail);
  }

  async findAllBuildingsForGuests() {
    return await this.buildingRepository
      .createQueryBuilder('building')
      .select([
        'building.id',
        'building.name',
        'building.description',
        'building.address',
        'building.latitude',
        'building.longitude',
        'building.no',
        'building.type',
        'building.imageNames',
        'building.imageUrls',
      ])
      .getMany();
  }

  async updateVisits(id: string) {
    const building = await this.findOne(id);
    building.visits += 1;
    delete building.faculties;
    delete building.laboratories;
    delete building.offices;
    delete building.pointOfInterests;
    delete building.favoriteUsers;
    await this.buildingRepository.update(id, building);
    return {
      message: 'Visitas actualizadas',
      ok: true,
      status: 200,
    };
  }
}
