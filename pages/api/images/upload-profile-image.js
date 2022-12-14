import formidable from 'formidable';
import path from 'path';
import fs from 'fs';

export default async function handler(req, res) {
  const form = formidable({
    multiples: false,
    uploadDir: './public/images/avatars',
    keepFilenames: true,
    keepExtensions: true,
    maxFileSize: 50 * 1024 * 1024,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: 'Błąd serwera.' });
    }

    let oldPath = files.image.filepath;
    let newPath =
      './public/images/avatars/' +
      Date.now() +
      '_' +
      files.image.originalFilename;
    fs.rename(oldPath, newPath, function (err) {
      if (err) {
        return res.status(500).json({ message: 'Błąd serwera.' });
      }
    });

    return res.status(200).json({
      message: 'Przesłano zdjęcie, aby je zapisać, kliknij przycisk "zapisz"',
      imagePath: '/images/avatars/' + files.image.originalFilename,
    });
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
