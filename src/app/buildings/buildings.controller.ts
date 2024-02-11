import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';
import { UpdateBuildingDto } from './dto/update-building.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { ValidRoles } from '../../auth/interfaces/valid-roles.interface';

@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createBuildingDto: CreateBuildingDto) {
    return this.buildingsService.create(createBuildingDto);
  }

  @Get()
  @Auth(ValidRoles.user, ValidRoles.admin)
  findAll() {
    return this.buildingsService.findAll();
  }

  @Get('/guests')
  findAllBuildingsForGuests() {
    return this.buildingsService.findAllBuildingsForGuests();
  }

  @Get(':id')
  @Auth(ValidRoles.admin, ValidRoles.user)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.buildingsService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBuildingDto: UpdateBuildingDto,
  ) {
    return this.buildingsService.update(id, updateBuildingDto);
  }

  @Patch(':id/visits')
  @Auth(ValidRoles.user)
  updateVisits(@Param('id', ParseUUIDPipe) id: string) {
    return this.buildingsService.updateVisits(id);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.buildingsService.remove(id);
  }
}
