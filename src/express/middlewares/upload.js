'use strict';

const multer = require(`multer`);
const path = require(`path`);
const {nanoid} = require(`nanoid`);

const UPLOAD_DIR = `../upload/img/`;
const FILE_TYPES = [`image/png`, `image/jpg`, `image/jpeg`];
const uploadDirAbsolute = path.resolve(__dirname, UPLOAD_DIR);

const storage = multer.diskStorage({
  destination: uploadDirAbsolute,
  filename: (req, file, cb) => {
    const uniqueName = nanoid(10);
    const extension = file.originalname.split(`.`).pop();
    cb(null, `${uniqueName}.${extension}`);
  }
});

const fileFilter = (req, file, cb) =>
  cb(null, FILE_TYPES.includes(file.mimetype));

const upload = multer({storage, fileFilter});

module.exports = upload;
