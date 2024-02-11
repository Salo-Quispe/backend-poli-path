export const imageFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: (error: Error | null, acceptFile: boolean) => void,
) => {
  if (!file) return callback(new Error('Imagen no proporcionada'), false);

  const fileExtension = file.mimetype.split('/')[1];

  const validExtensions = ['jpg', 'png', 'jpeg'];

  if (!validExtensions.includes(fileExtension))
    return callback(new Error('Tipo de archivo inválido'), false);

  callback(null, true);
};
