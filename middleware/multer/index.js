import multer from "multer";
import path from 'path'
import fs from 'fs'

export const uploadImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      try {
         const { name } = req.body;


        const destinationPath = path.join(
          "mahaluxmi_hardware",
         
          // "profile"
        );
        fs.mkdir(destinationPath, { recursive: true }, (err) => {
          if (err) {
            console.error("Error creating directory:", err);
            return cb(err);
          }
          cb(null, destinationPath);
        });
      } catch (error) {
        console.error("Error in destination callback:", error);
        cb(error);
      }
    },
    filename: (req, file, cb) => {
      try {
        const newFileName = Date.now() + "_" + file.originalname;
        cb(null, newFileName);
      } catch (error) {
        cb(error);
      }
    }
  })
}).single("image");

