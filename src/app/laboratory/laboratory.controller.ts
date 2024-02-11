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
import { LaboratoryService } from './laboratory.service';
import { CreateLaboratoryDto } from './dto/create-laboratory.dto';
import { UpdateLaboratoryDto } from './dto/update-laboratory.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { ValidRoles } from '../../auth/interfaces/valid-roles.interface';

@Controller('laboratories')
export class LaboratoryController {
  constructor(private readonly laboratoryService: LaboratoryService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createLaboratoryDto: CreateLaboratoryDto) {
    return this.laboratoryService.create(createLaboratoryDto);
  }

  @Get()
  @Auth(ValidRoles.user, ValidRoles.admin)
  findAll() {
    return this.laboratoryService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.user, ValidRoles.admin)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.laboratoryService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLaboratoryDto: UpdateLaboratoryDto,
  ) {
    return this.laboratoryService.update(id, updateLaboratoryDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.laboratoryService.remove(id);
  }

  @Post('suggestions')
  @Auth(ValidRoles.user, ValidRoles.admin)
  getSuggestions(@Body('search') search: string) {
    return this.laboratoryService.getSuggestions(search);
  }
}
