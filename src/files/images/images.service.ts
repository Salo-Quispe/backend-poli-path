import { BadRequestException, Injectable } from '@nestjs/common';
import { unlink } from 'fs';
import { promisify } from 'util';
import { join } from 'path';
import { Building } from '../../app/buildings/entities/building.entity';
import { ConfigService } from '@nestjs/config';
import { User } from '../../app/user/entities/user.entity';
import { UserService } from '../../app/user/user.service';

const unlinkAsync = promisify(unlink);

@Injectable()
export class ImageService {
  private readonly APP_URL: string;
  private readonly APP_API_PREFIX: string;
  private readonly APP_API_VERSION: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UserService,
  ) {
    this.APP_URL = this.configService.get('APP_URL');
    this.APP_API_PREFIX = this.configService.get('APP_API_PREFIX');
    this.APP_API_VERSION = this.configService.get('APP_API_VERSION');
  }

  private buildSecureUrls(
    files: Express.Multer.File[],
    entityName: string,
    id: string,
  ): {
    secureUrls: string[];
    filenames: string[];
    urlsWithoutHost: string[];
  } {
    const secureUrls = [];
    const filenames = [];
    const urlsWithoutHost = [];

    for (const file of files) {
      const secureUrl = `${this.APP_URL}/${this.APP_API_PREFIX}/${this.APP_API_VERSION}/files/${entityName}/${id}/${file.filename}`;
      filenames.push(file.filename);
      secureUrls.push(secureUrl);
      urlsWithoutHost.push(
        `${this.APP_API_PREFIX}/${this.APP_API_VERSION}/files/${entityName}/${id}/${file.filename}`,
      );
    }

    return { secureUrls, filenames, urlsWithoutHost };
  }

  async uploadImages(
    entityService: any,
    id: string,
    files: Express.Multer.File[],
    type: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const entity = await entityService.findOne(id);
    const imageNames = [...entity.imageNames];
    const imageUrls = [...entity.imageUrls];
    const path = join(__dirname, `../../../static/${type}/${id}`);

    for (const imageName of imageNames) {
      try {
        await unlinkAsync(join(path, imageName));
        entity.imageNames.splice(entity.imageNames.indexOf(imageName), 1);
        const imageUrl = imageUrls.find((url) => url.includes(imageName));
        entity.imageUrls.splice(entity.imageUrls.indexOf(imageUrl), 1);
        console.log(`Se eliminó la imagen ${imageName}`);
        console.log(`Se eliminó la url ${imageUrl}`);
      } catch (error) {
        throw new BadRequestException('Error deleting the image', error);
      }
    }

    if (entity instanceof Building) {
      delete entity.faculties;
      delete entity.laboratories;
      delete entity.offices;
      delete entity.pointOfInterests;
    }

    await entityService.update(id, entity);

    const { secureUrls, filenames, urlsWithoutHost } = this.buildSecureUrls(
      files,
      type,
      id,
    );

    await this.saveNameImage(entityService, id, filenames, urlsWithoutHost);

    return {
      secureUrls,
      filenames,
      ok: true,
      status: 200,
      message: 'Lista de imágenes guardadas con éxito',
    };
  }

  private async saveNameImage(
    entityService: any,
    id: string,
    imageNames: string[],
    secureUrls: string[],
  ) {
    try {
      const entity = await entityService.findOne(id);

      if (entity instanceof Building) {
        delete entity.faculties;
        delete entity.laboratories;
        delete entity.offices;
        delete entity.pointOfInterests;
      }

      entity.imageUrls = [...entity.imageUrls, ...secureUrls];
      entity.imageNames = [...entity.imageNames, ...imageNames];

      await entityService.update(id, entity);
    } catch (error) {
      console.error(`Error al guardar la imagen: ${error}`);
      throw new BadRequestException('Error al guardar la imagen', error);
    }
  }

  async saveNameProfileImage(filename: string, user: User, secureUrl: string) {
    if (user.nameProfileImage !== '') {
      try {
        await this.deletePreviousProfileImage(user.nameProfileImage);
      } catch (error) {
        console.error(`Error al eliminar la imagen: ${error}`);
        throw new BadRequestException(
          'Error al eliminar la imagen anterior',
          error,
        );
      }
    }
    try {
      user.nameProfileImage = filename;
      user.imageUrl = secureUrl;
      delete user.favoriteBuildings;
      await this.usersService.update(user.id, user);
    } catch (error) {
      console.error(`Error al guardar la imagen: ${error}`);
      throw new BadRequestException('Error al guardar la imagen', error);
    }
  }

  private async deletePreviousProfileImage(imageName: string) {
    const path = join(__dirname, '../../../static/profile-images', imageName);
    try {
      await unlinkAsync(path);
    } catch (error) {
      throw new BadRequestException('Error deleting the image', error);
    }
  }

  async uploadProfileImage(user: User, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const secureUrl = `${this.APP_URL}/${this.APP_API_PREFIX}/${this.APP_API_VERSION}/files/profile-images/${file.filename}`;

    await this.saveNameProfileImage(file.filename, user, secureUrl);

    return {
      secureUrl,
      filename: file.filename,
      ok: true,
      status: 200,
      message: 'Imagen guardada con éxito',
    };
  }
}
