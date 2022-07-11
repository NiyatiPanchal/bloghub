// import multer from "multer";
// import { GridFsStorage } from "multer-gridfs-storage";

// const storage = new GridFsStorage({
//   url: " mongodb+srv://user:999996@bloghub.rqplb4n.mongodb.net/?retryWrites=true&w=majority",
//   options: { useNewUrlParser: true },
//   file: (request, file) => {
//     const match = ["image/png", "image/jpg"];

//     if (match.indexOf(file.memeType) === -1)
//       return `${Date.now()}-blog-${file.originalname}`;

//     return {
//       bucketName: "photos",
//       filename: `${Date.now()}-blog-${file.originalname}`,
//     };
//   },
// });

// export default multer({ storage });

const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");

const storage = new GridFsStorage({
  url: "mongodb+srv://user:999996@bloghub.rqplb4n.mongodb.net/?retryWrites=true&w=majority",
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
