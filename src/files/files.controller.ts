import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  Param,
  ParseUUIDPipe,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { imageFilter } from './helpers/image-filter.helper';
import { imageName } from './helpers/image-name.helper';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles.interface';
import { mkdirSync } from 'fs';
import { Response } from 'express';
import { ImageService } from './images/images.service';
import { FilesService } from './files.service';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../app/user/entities/user.entity';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly imagesService: ImageService,
  ) {}

  @Get('profile-images/:imageName')
  findProductImages(
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    const path = this.filesService.getStaticProfileImage(imageName);
    return res.sendFile(path);
  }

  @Get('buildings/:id/:imageName')
  findBuildingImages(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    const path = this.filesService.getStaticBuildingImage(id, imageName);
    return res.sendFile(path);
  }

  @Get('faculties/:id/:imageName')
  findFacultyImages(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    const path = this.filesService.getStaticFacultyImage(id, imageName);
    return res.sendFile(path);
  }

  @Get('laboratories/:id/:imageName')
  findLaboratoryImages(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    const path = this.filesService.getStaticLaboratoryImage(id, imageName);
    return res.sendFile(path);
  }

  @Get('offices/:id/:imageName')
  findOfficeImages(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    const path = this.filesService.getStaticOfficeImage(id, imageName);
    return res.sendFile(path);
  }

  @Get('points-of-interest/:id/:imageName')
  findPointOfInterestImages(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    const path = this.filesService.getStaticPointOfInterestImage(id, imageName);
    return res.sendFile(path);
  }

  @Post('profile-image')
  @HttpCode(200)
  @Auth(ValidRoles.user, ValidRoles.admin)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: imageFilter,
      storage: diskStorage({
        destination: './static/profile-images',
        filename: imageName,
      }),
    }),
  )
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {
    console.log('Change profile image');
    return this.imagesService.uploadProfileImage(user, file);
  }

  @Post('buildings/:id')
  @HttpCode(200)
  @Auth(ValidRoles.admin)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: imageFilter,
      storage: diskStorage({
        destination: (req, file, cb) => {
          const buildingId = req.params.id;
          const destinationPath = `./static/buildings/${buildingId}`;
          try {
            mkdirSync(destinationPath, { recursive: true });
          } catch (error) {
            console.error('Error creating directory:', error);
          }
          cb(null, destinationPath);
        },
        filename: imageName,
      }),
    }),
  )
  async uploadBuildingImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.imagesService.uploadImages(
      this.filesService.buildingsService,
      id,
      files,
      'buildings',
    );
  }

  @Post('faculties/:id')
  @HttpCode(200)
  @Auth(ValidRoles.admin)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: imageFilter,
      storage: diskStorage({
        destination: (req, file, cb) => {
          const facultyId = req.params.id;
          const destinationPath = `./static/faculties/${facultyId}`;
          try {
            mkdirSync(destinationPath, { recursive: true });
          } catch (error) {
            console.error('Error creating directory:', error);
          }
          cb(null, destinationPath);
        },
        filename: imageName,
      }),
    }),
  )
  async uploadFacultyImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.imagesService.uploadImages(
      this.filesService.facultiesService,
      id,
      files,
      'faculties',
    );
  }

  @Post('laboratories/:id')
  @HttpCode(200)
  @Auth(ValidRoles.admin)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: imageFilter,
      storage: diskStorage({
        destination: (req, file, cb) => {
          const laboratoryId = req.params.id;
          const destinationPath = `./static/laboratories/${laboratoryId}`;
          try {
            mkdirSync(destinationPath, { recursive: true });
          } catch (error) {
            console.error('Error creating directory:', error);
          }
          cb(null, destinationPath);
        },
        filename: imageName,
      }),
    }),
  )
  async uploadLaboratoryImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.imagesService.uploadImages(
      this.filesService.laboratoriesService,
      id,
      files,
      'laboratories',
    );
  }

  @Post('offices/:id')
  @HttpCode(200)
  @Auth(ValidRoles.admin)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: imageFilter,
      storage: diskStorage({
        destination: (req, file, cb) => {
          const officeId = req.params.id;
          const destinationPath = `./static/offices/${officeId}`;
          try {
            mkdirSync(destinationPath, { recursive: true });
          } catch (error) {
            console.error('Error creating directory:', error);
          }
          cb(null, destinationPath);
        },
        filename: imageName,
      }),
    }),
  )
  async uploadOfficeImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.imagesService.uploadImages(
      this.filesService.officesService,
      id,
      files,
      'offices',
    );
  }

  @Post('points-of-interest/:id')
  @HttpCode(200)
  @Auth(ValidRoles.admin)
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: imageFilter,
      storage: diskStorage({
        destination: (req, file, cb) => {
          const pointOfInterestId = req.params.id;
          const destinationPath = `./static/points-of-interest/${pointOfInterestId}`;
          try {
            mkdirSync(destinationPath, { recursive: true });
          } catch (error) {
            console.error('Error creating directory:', error);
          }
          cb(null, destinationPath);
        },
        filename: imageName,
      }),
    }),
  )
  async uploadPointOfInterestImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.imagesService.uploadImages(
      this.filesService.pointsOfInterestService,
      id,
      files,
      'points-of-interest',
    );
  }
}
