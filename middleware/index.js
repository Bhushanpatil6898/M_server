import multer from "multer";
import path from "path";
import fs from "fs";


export const uploadCompanyLogo = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      let destinationPath = path.join("uploads");
      if (!fs.existsSync(destinationPath)) {
        fs.mkdirSync(destinationPath, { recursive: true }, (err) => {
          console.log(err);
        });
      }
      cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
      let newFileName = Date.now() + "_" + file.originalname;
      cb(null, newFileName);
    },
  }),
}).single("logo");

