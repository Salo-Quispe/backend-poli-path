import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FacultyService } from './faculty.service';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { ValidRoles } from '../../auth/interfaces/valid-roles.interface';

@Controller('faculties')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createFacultyDto: CreateFacultyDto) {
    return this.facultyService.create(createFacultyDto);
  }

  @Get()
  @Auth(ValidRoles.user, ValidRoles.admin)
  findAll() {
    return this.facultyService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.user, ValidRoles.admin)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.facultyService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateFacultyDto: UpdateFacultyDto,
  ) {
    return this.facultyService.update(id, updateFacultyDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.facultyService.remove(id);
  }

  @Post('suggestions')
  @Auth(ValidRoles.user, ValidRoles.admin)
  getSuggestions(@Body('search') search: string) {
    return this.facultyService.getSuggestions(search);
  }
}
