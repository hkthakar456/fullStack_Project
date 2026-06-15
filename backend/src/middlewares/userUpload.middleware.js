import multer from "multer";

import { upload } from "./multer.middleware.js";

//=============================================================================================================//

const imageFileFilter = (req, file, cb) => {

    const allowedExtensions = [

        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ];

    const extension = file.originalname.substring(file.originalname.lastIndexOf(".")).toLowerCase();

//=============================================================================================================//

    if (allowedExtensions.includes(extension)) {
        return cb(null, true);
    }

//=============================================================================================================//

    return cb(new Error("Only image files are allowed"), false);
};

//=============================================================================================================//

const imageUpload = multer({

    storage: upload.storage,

    limits: {

        fileSize : 10 * 1024 * 1024,
    },

    fileFilter:
        imageFileFilter
});

//=============================================================================================================//

export const userUpload = imageUpload.fields([

        {

            name: "avatar",
            maxCount: 1,
        },

        {

            name: "coverImage",
            maxCount: 1,
        }
    ]);