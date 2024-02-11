import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { Office } from './entities/office.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuildingsService } from '../buildings/buildings.service';

@Injectable()
export class OfficeService {
  constructor(
    @InjectRepository(Office)
    private readonly officeRepository: Repository<Office>,
    private readonly buildingsService: BuildingsService,
  ) {}

  private async findBuilding(buildingId: string) {
    const building = await this.buildingsService.findOne(buildingId);
    if (!building) {
      throw new BadRequestException(`Building with id ${buildingId} not found`);
    }
    return building;
  }

  async create(createOfficeDto: CreateOfficeDto) {
    const building = await this.findBuilding(createOfficeDto.buildingId);
    try {
      const newOffice = this.officeRepository.create({
        building,
        ...createOfficeDto,
      });
      await this.officeRepository.save(newOffice);
      return await this.findOne(newOffice.id);
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return await this.officeRepository.find();
  }

  async findOne(id: string) {
    const office = await this.officeRepository
      .createQueryBuilder('office')
      .leftJoin('office.building', 'building')
      .addSelect(['office.*', 'building.id', 'building.name'])
      .where('office.id = :id', { id })
      .getOne();

    if (!office) {
      throw new BadRequestException(`Office with id ${id} not found`);
    }

    return office;
  }

  async update(id: string, updateOfficeDto: UpdateOfficeDto) {
    const { buildingId, ...rest } = updateOfficeDto;
    if (buildingId) {
      const building = await this.findBuilding(buildingId);

      await this.officeRepository.update(id, {
        building,
        ...rest,
      });

      return await this.findOne(id);
    }
    await this.officeRepository.update(id, rest);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const office = await this.findOne(id);
    await this.officeRepository.remove(office);
    return {
      ok: true,
      message: `Office with id ${id} deleted successfully`,
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
    const offices = await this.officeRepository
      .createQueryBuilder('office')
      .where('office.name LIKE :search', { search: `%${search}%` })
      .getMany();
    return offices.map((office) => office.name);
  }
}
