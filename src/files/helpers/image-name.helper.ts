import { v4 as uuidGenerator } from 'uuid';
import { UUID } from 'typeorm/driver/mongodb/bson.typings';

export const imageName = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, fileName: string, uuid: UUID | null) => void,
) => {
  if (!file) return callback(new Error('No file provided'), '', null);

  const fileExtension = file.mimetype.split('/')[1];
  const uuid = uuidGenerator();

  const fileName = `${uuid}.${fileExtension}`;

  callback(null, fileName, uuid);
};
