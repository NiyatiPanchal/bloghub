const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
require("dotenv").config();

const mongoURI = `${process.env.MONGO_URI}`;

const storage = new GridFsStorage({
  url: "mongoURI",
  options: { useNewUrlParser: true },
  file: (req, file) => {
    const match = ["image/png", "image/jpg"];

    if (match.indexOf(file.memeType) === -1) {
      return `${Date.now()}-blog-${file.originalname}`;
    }

    return {
      bucketName: "photos",
      filename: `${Date.now()}-blog-${file.originalname}`,
    };
  },
});

const upload = multer({ storage });

module.exports = upload;
