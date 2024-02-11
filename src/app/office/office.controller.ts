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
import { OfficeService } from './office.service';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';
import { Auth } from '../../auth/decorators/auth.decorator';
import { ValidRoles } from '../../auth/interfaces/valid-roles.interface';

@Controller('offices')
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createOfficeDto: CreateOfficeDto) {
    return this.officeService.create(createOfficeDto);
  }

  @Get()
  @Auth(ValidRoles.user, ValidRoles.admin)
  findAll() {
    return this.officeService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.user, ValidRoles.admin)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.officeService.findOne(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(@Param('id') id: string, @Body() updateOfficeDto: UpdateOfficeDto) {
    return this.officeService.update(id, updateOfficeDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.officeService.remove(id);
  }

  @Post('suggestions')
  @Auth(ValidRoles.user, ValidRoles.admin)
  getSuggestions(@Body('search') search: string) {
    return this.officeService.getSuggestions(search);
  }
}
