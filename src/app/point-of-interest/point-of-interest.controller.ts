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
import { PointOfInterestService } from './point-of-interest.service';
import { CreatePointOfInterestDto } from './dto/create-point-of-interest.dto';
import { UpdatePointOfInterestDto } from './dto/update-point-of-interest.dto';
import { ValidRoles } from '../../auth/interfaces/valid-roles.interface';
import { Auth } from '../../auth/decorators/auth.decorator';

@Controller('point-of-interests')
export class PointOfInterestController {
  constructor(
    private readonly pointOfInterestService: PointOfInterestService,
  ) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createPointOfInterestDto: CreatePointOfInterestDto) {
    return this.pointOfInterestService.create(createPointOfInterestDto);
  }

  @Get()
  @Auth(ValidRoles.user, ValidRoles.admin)
  findAll() {
    return this.pointOfInterestService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.user, ValidRoles.admin)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pointOfInterestService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePointOfInterestDto: UpdatePointOfInterestDto,
  ) {
    return this.pointOfInterestService.update(id, updatePointOfInterestDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pointOfInterestService.remove(id);
  }

  @Post('suggestions')
  @Auth(ValidRoles.user, ValidRoles.admin)
  getSuggestions(@Body('search') search: string) {
    return this.pointOfInterestService.getSuggestions(search);
  }
}
