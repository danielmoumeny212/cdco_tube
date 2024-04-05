const multer = require('multer');
const path = require('path');
const util = require('util');
const fs = require('fs');

const baseUploadsFolder = 'uploads/';

// Vérifie l'existence du répertoire principal "uploads"
if (!fs.existsSync(baseUploadsFolder)) {
  fs.mkdirSync(baseUploadsFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { destination} = req.body
    // Récupére le nom du dossier de destination depuis le corps de la requête
    const destinationFolder = destination ? `${baseUploadsFolder}${req.body.destination}` : baseUploadsFolder;
     req["destinationFolder"] = destination ;
    // Vérifie si le répertoire de destination existe, sinon le créer
    if (!fs.existsSync(destinationFolder)) {
      fs.mkdirSync(destinationFolder, { recursive: true });
    }
    console.log("Creating disk storage in", destinationFolder);
    cb(null, destinationFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}${fileExtension}`;
    req["filename"] = filename;
    cb(null, filename);
  }
});

const uploadFile = multer({ storage: storage }).single("file");
const uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;
