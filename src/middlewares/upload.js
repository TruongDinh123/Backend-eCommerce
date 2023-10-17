"use strict";

const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
});

const uploadMiddleware = multer({ storage: storage });

module.exports = {
  uploadMiddleware
};
