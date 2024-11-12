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

export const uploadprofile = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const { name } = req.body; 
      console.log(req.body);
      // Extract name or any other identifier from the body
      const destinationPath = path.join("mahaluxmi_hardware", name || "default"); // Default folder if name is not provided

      // Create directory if it doesn't exist
      fs.mkdir(destinationPath, { recursive: true }, (err) => {
        if (err) {
          console.error("Error creating directory:", err);
          return cb(err);
        }
        cb(null, destinationPath);
      });
    },
    filename: (req, file, cb) => {
      // Create a unique filename using timestamp and original name
      const newFileName = `${Date.now()}_${file.originalname}`;
      cb(null, newFileName);
    }
  })
}).single("image"); 

export const uploadPDF = (pdfBuffer, filename) => {
  const pdfPath = path.join(__dirname, '../mahaluxmi_hardware/', filename);
  
  fs.writeFileSync(pdfPath, pdfBuffer);
  return `/mahaluxmi_hardware/${filename}`;  // Return the relative path to the file
};