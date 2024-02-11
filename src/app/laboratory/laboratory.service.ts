import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateLaboratoryDto } from './dto/create-laboratory.dto';
import { UpdateLaboratoryDto } from './dto/update-laboratory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Laboratory } from './entities/laboratory.entity';
import { Repository } from 'typeorm';
import { BuildingsService } from '../buildings/buildings.service';

@Injectable()
export class LaboratoryService {
  constructor(
    @InjectRepository(Laboratory)
    private readonly laboratoryRepository: Repository<Laboratory>,
    private readonly buildingsService: BuildingsService,
  ) {}

  private async findBuilding(buildingId: string) {
    const building = await this.buildingsService.findOne(buildingId);
    if (!building) {
      throw new BadRequestException(`Building with id ${buildingId} not found`);
    }
    return building;
  }

  async create(createLaboratoryDto: CreateLaboratoryDto) {
    const building = await this.findBuilding(createLaboratoryDto.buildingId);
    try {
      const newLaboratory = this.laboratoryRepository.create({
        building,
        ...createLaboratoryDto,
      });
      await this.laboratoryRepository.save(newLaboratory);
      return await this.findOne(newLaboratory.id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return await this.laboratoryRepository.find();
  }

  async findOne(id: string) {
    const laboratory = await this.laboratoryRepository
      .createQueryBuilder('laboratory')
      .leftJoin('laboratory.building', 'building')
      .addSelect(['laboratory.*', 'building.id', 'building.name'])
      .where('laboratory.id = :id', { id })
      .getOne();

    if (!laboratory) {
      throw new BadRequestException(`Laboratory with id ${id} not found`);
    }

    return laboratory;
  }

  async update(id: string, updateLaboratoryDto: UpdateLaboratoryDto) {
    const { buildingId, ...rest } = updateLaboratoryDto;
    if (buildingId) {
      const building = await this.findBuilding(buildingId);

      await this.laboratoryRepository.update(id, {
        ...rest,
        building,
      });
      return await this.findOne(id);
    }
    await this.laboratoryRepository.update(id, rest);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const laboratory = await this.findOne(id);
    await this.laboratoryRepository.remove(laboratory);
    return {
      ok: true,
      message: `Laboratory with id ${id} deleted`,
      status: 200,
    };
  }

  private handleExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException('Product already exists', error.detail);
    }
    throw new InternalServerErrorException('Unexpected error', error.detail);
  }

  async getSuggestions(search: string) {
    const laboratories = await this.laboratoryRepository
      .createQueryBuilder('laboratory')
      .where('laboratory.name LIKE :search', { search: `%${search}%` })
      .getMany();
    return laboratories.map((laboratory) => laboratory.name);
  }
}
