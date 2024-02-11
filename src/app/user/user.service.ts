import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ValidRoles } from '../../auth/interfaces/valid-roles.interface';
import { BuildingsService } from '../buildings/buildings.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly buildingsService: BuildingsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      delete user.password;

      return user;
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: string) {
    const user: User = await this.userRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    return user;
  }

  async findOneWithPassword(id: string) {
    const query = this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.id = :id', { id });

    return await query.getOne();
  }

  async findOneByEmailToLogin(email: string) {
    email = email.toLowerCase();
    const user: User = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException(`Email no registrado`);
    }
    return await this.userRepository.findOne({
      where: { email },
      select: {
        name: true,
        lastname: true,
        email: true,
        password: true,
        id: true,
        isActive: true,
        roles: true,
        isVerified: true,
        nameProfileImage: true,
        imageUrl: true,
      },
    });
  }

  async findOneByEmail(email: string) {
    email = email.toLowerCase();
    const user: User = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestException(`Usuario con el ${email} no encontrado`);
    }
    return await this.userRepository.findOneBy({ email });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }
    delete user.favoriteBuildings;
    await this.userRepository.update(id, updateUserDto);
    const updatedUser = await this.userRepository.findOneBy({ id });

    if (!updatedUser) {
      throw new InternalServerErrorException(
        `Unable to fetch updated user with id ${id}`,
      );
    }

    delete updatedUser.password;
    delete updatedUser.recoverPasswordToken;
    delete updatedUser.isVerified;
    delete updatedUser.registerDate;

    return updatedUser;
  }

  async updateRoles(id: string, roles: ValidRoles[]) {
    if (!roles.length) {
      throw new BadRequestException('Roles must not be empty');
    }

    if (!Array.isArray(roles)) {
      throw new BadRequestException('Roles must be an array');
    }

    const isValid = roles.every((role) => role in ValidRoles);

    if (!isValid) {
      throw new BadRequestException('Invalid roles');
    }
    const user = await this.findOne(id);

    if (!user) {
      throw new BadRequestException(`User with id ${id} not found`);
    }

    await this.userRepository.update(id, { roles });
    const updatedUser = await this.userRepository.findOneBy({ id });

    if (!updatedUser) {
      throw new InternalServerErrorException(
        `Unable to fetch updated user with id ${id}`,
      );
    }

    delete updatedUser.password;
    delete updatedUser.recoverPasswordToken;
    delete updatedUser.isVerified;
    delete updatedUser.registerDate;

    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  private handleDBErrors(e: any): never {
    if (e.code === '23505') {
      throw new BadRequestException({
        message: 'El correo ya se encuentra registrado',
      });
    }
    console.log(e);
    throw new InternalServerErrorException('Something went wrong');
  }

  async addFavoriteBuilding(id: string, buildingId: string) {
    const isFavorite = await this.verifyIfBuildingIsFavorite(id, buildingId);

    if (isFavorite) {
      throw new BadRequestException('El edificio ya se encuentra en favoritos');
    }

    const user = await this.findOne(id);
    const building = await this.buildingsService.findOne(buildingId);
    user.favoriteBuildings.push(building);
    await this.userRepository.save(user);
    return {
      ok: true,
      message: 'Edificio agregado a favoritos',
      status: 200,
    };
  }

  async removeFavoriteBuilding(id: string, buildingId: string) {
    const isFavorite = await this.verifyIfBuildingIsFavorite(id, buildingId);

    if (!isFavorite) {
      throw new BadRequestException('El edificio no se encuentra en favoritos');
    }

    const user = await this.findOne(id);
    const building = await this.buildingsService.findOne(buildingId);
    user.favoriteBuildings = user.favoriteBuildings.filter(
      (b) => b.id !== building.id,
    );
    await this.userRepository.save(user);
    return {
      ok: true,
      message: 'Edificio eliminado de favoritos',
      status: 200,
    };
  }

  async getFavoriteBuildings(id: string) {
    const user = await this.findOne(id);
    return user.favoriteBuildings;
  }

  private async verifyIfBuildingIsFavorite(id: string, buildingId: string) {
    const user = await this.findOne(id);
    const building = await this.buildingsService.findOne(buildingId);
    return user.favoriteBuildings.some((b) => b.id === building.id);
  }

  @Cron('0 */2 * * *')
  private async deleteUnverifiedUsers() {
    const users = await this.userRepository.find({
      where: {
        isVerified: false,
      },
    });
    for (const user of users) {
      await this.userRepository.delete(user.id);
    }
    console.log('Unverified users deleted');
  }
}
