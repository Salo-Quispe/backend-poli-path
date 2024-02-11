import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ValidRoles } from '../../auth/interfaces/valid-roles.interface';
import { Auth } from '../../auth/decorators/auth.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Auth(ValidRoles.admin)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @Auth(ValidRoles.admin)
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Get('email/:email')
  @Auth(ValidRoles.admin)
  findOneByEmail(@Param('email') email: string) {
    return this.userService.findOneByEmail(email);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin, ValidRoles.user)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('roles/:id')
  @Auth(ValidRoles.admin)
  updateRoles(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('roles') roles: ValidRoles[],
  ) {
    return this.userService.updateRoles(id, roles);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }

  @Post('buildings/:buildingId/favorite')
  @Auth(ValidRoles.user)
  addFavoriteBuilding(
    @GetUser('id') userId: string,
    @Param('buildingId', ParseUUIDPipe) buildingId: string,
  ) {
    return this.userService.addFavoriteBuilding(userId, buildingId);
  }

  @Delete('buildings/:buildingId/favorite')
  @Auth(ValidRoles.user)
  removeFavoriteBuilding(
    @GetUser('id') userId: string,
    @Param('buildingId', ParseUUIDPipe) buildingId: string,
  ) {
    return this.userService.removeFavoriteBuilding(userId, buildingId);
  }

  @Get('buildings/favorite')
  @Auth(ValidRoles.user)
  getFavoriteBuildings(@GetUser('id') userId: string) {
    return this.userService.getFavoriteBuildings(userId);
  }
}
