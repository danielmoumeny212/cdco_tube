const express = require('express');
const multer = require('multer');

const router = express.Router();

const filecontroller = require('./filecontroller');
const uploadFile = require('./fileupload');
const storage = multer.memoryStorage();
const uploads = multer({ storage})

// router.post('/upload',  uploadFile.single("file"), (req, res) => {
//     res.status(200).json("File has been uploaded successfully")
//   });
router.post("/image", uploads.single("file"), filecontroller.image)
router.post('/upload', filecontroller.upload);
router.get("/files", filecontroller.getListFiles);
router.get("/files/:name", filecontroller.download);
 

module.exports = router;