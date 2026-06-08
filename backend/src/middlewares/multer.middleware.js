import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  //steps to configure multer storage

  //1. Destination: Where to save the file
  //2. Filename: What to call the file


  // 1. Destination: Where to save the file
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },

  // 2. Filename: What to call the file
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // e.g., avatar-1234567890.png
  }


});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB file size limit
    },
    fileFilter: function (req, file, cb) {

        const allowedMimeTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp"
        ];

        if (allowedMimeTypes.includes(file.mimetype))
        {
            cb(null, true);
        } 
        else 
        {
            cb(new Error("Only image files are allowed"), false);
        }
    } // Allow only image files for avatar and cover image uploads
});

export {upload};