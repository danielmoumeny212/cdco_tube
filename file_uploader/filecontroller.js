const uploadFile = require("./fileupload");
const fileconfig = require('./fileconfig');
const fs = require('fs');
const path = require('path');
const sharp  = require('sharp');


const THUMBNAILS_PATH = "./uploads/thumbnails";
const SERVER_FILE_URL = process.env.SERVER_FILE_URL;

// Fonction pour créer le répertoire si inexistant
const createDirectoryIfNotExists = (directoryPath) => {
  if (!fs.existsSync(directoryPath)) {
    console.log("Creating directory:", directoryPath);
    fs.mkdirSync(directoryPath);
  }
};

exports.image = async (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  createDirectoryIfNotExists(THUMBNAILS_PATH);
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  const fileExtension = path.extname(req.file.originalname);
  const filename = `${req.file.fieldname}-${uniqueSuffix}${fileExtension}`;
  const thumbnailPath = `${THUMBNAILS_PATH}/${filename}`;
  
  await sharp(req.file.buffer)
    .resize({ width: 400, height: 250 })
    .toFile(thumbnailPath);

  const imageUrl = `/thumbnails/${filename}`;
  console.log(`${process.env.SERVER_FILE_URL}${imageUrl}`)

  
  res.status(200).send({
    message: `The following file was uploaded successfully: ${req.file.originalname}`,
    secure_url: `${process.env.SERVER_FILE_URL}/${imageUrl}`,
  });
};

exports.upload = async (req, res) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  
  try {
    console.log("Uploading file ... ");
    await uploadFile(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Upload a file please!" });
    }

    const imageUrl = `${req.destinationFolder}/${req.file.filename}`;
  
    res.status(200).send({
      message: `The following file was uploaded successfully: ${req.file.originalname}`,
      secure_url: `${process.env.SERVER_FILE_URL}/${imageUrl}`,
    });
  } catch (err) {  
    res.status(500).send({
      message: `Unable to upload the file: ${req.file}. ${err}`,
     secure_url: `${process.env.SERVER_FILE_URL}/${imageUrl}`,
    });
  }
};

exports.getListFiles = async (req, res) => {
  const directoryPath = __basedir + "\\" + fileconfig.filelocation;

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return res.status(500).send({
        message: "There was an issue in scanning the files!",
      });
    }

    console.log("Total files available are - " + files);
    
    const fileInfos = files.map((file) => ({
      name: file,
      url: `${__basedir}\\${file}`,
    }));

    res.status(200).send(fileInfos);
  });
};

exports.download = async (req, res) => {
  const fileName = req.params.name;
  const directoryPath = fileconfig.filelocation;
  const filePath = `${directoryPath}\\${fileName}`;

  res.download(filePath, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: `There was an issue in downloading the file. ${err}`,
      });
    }
  });
};

 
