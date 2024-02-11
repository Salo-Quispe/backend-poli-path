import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Faculty } from './entities/faculty.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BuildingsService } from '../buildings/buildings.service';

@Injectable()
export class FacultyService {
  constructor(
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
    private readonly buildingsService: BuildingsService,
  ) {}

  private async findBuilding(buildingId: string) {
    const building = await this.buildingsService.findOne(buildingId);
    if (!building) {
      throw new BadRequestException(`Building with id ${buildingId} not found`);
    }
    return building;
  }

  async create(createFacultyDto: CreateFacultyDto) {
    const building = await this.findBuilding(createFacultyDto.buildingId);
    try {
      const newFaculty = this.facultyRepository.create({
        building,
        ...createFacultyDto,
      });
      await this.facultyRepository.save(newFaculty);
      return newFaculty;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll() {
    return await this.facultyRepository.find();
  }

  async findOne(id: string) {
    const faculty = await this.facultyRepository
      .createQueryBuilder('faculty')
      .leftJoin('faculty.building', 'building')
      .addSelect(['faculty.*', 'building.id', 'building.name'])
      .where('faculty.id = :id', { id })
      .getOne();

    if (!faculty) {
      throw new BadRequestException(`Faculty with id ${id} not found`);
    }

    return faculty;
  }

  async update(id: string, updateFacultyDto: UpdateFacultyDto) {
    const { buildingId, ...updateDto } = updateFacultyDto;
    if (buildingId) {
      const building = await this.findBuilding(buildingId);
      await this.facultyRepository.update(id, {
        ...updateDto,
        building,
      });
      return await this.findOne(id);
    }
    await this.facultyRepository.update(id, updateDto);
    return await this.findOne(id);
  }

  async remove(id: string) {
    const faculty = await this.findOne(id);
    await this.facultyRepository.remove(faculty);
    return {
      ok: true,
      message: 'Faculty deleted successfully',
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
    const faculties = await this.facultyRepository
      .createQueryBuilder('faculty')
      .where('faculty.name LIKE :search', { search: `%${search}%` })
      .getMany();
    return faculties.map((faculty) => faculty.name);
  }
}
