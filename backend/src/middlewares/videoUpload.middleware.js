import multer from "multer";

import { upload } from "./multer.middleware.js";

//=============================================================================================================//

const videoFileFilter = (req, file, cb) => {

    const imageExtensions = [

        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ];

    const videoExtensions = [

        ".mp4",
        ".mov",
        ".avi",
        ".mkv",
        ".webm"
    ];

//=============================================================================================================//

    const extension = file.originalname.substring(file.originalname.lastIndexOf(".")).toLowerCase();

//=============================================================================================================//

    if (file.fieldname === "thumbnail") {

        if (imageExtensions.includes(extension)) {
            return cb(null,true);
        }

        return cb(new Error("Thumbnail must be an image"),false);
    }

//=============================================================================================================//

    if (file.fieldname === "videoFile") {

        if (videoExtensions.includes(extension)) {
            return cb(null,true);
        }

        return cb(new Error("Video file must be a video"),false);
    }

//=============================================================================================================//

    return cb(new Error("Invalid file field"),false);
};

//=============================================================================================================//

const videoUploadMiddleware = multer({

    storage: upload.storage,

    limits: {
        fileSize : 500 * 1024 * 1024,
    },

    fileFilter : videoFileFilter
});

//=============================================================================================================//

export const videoUpload = videoUploadMiddleware.fields([

        {

            name: "thumbnail",
            maxCount: 1,
        },

        {

            name: "videoFile",
            maxCount: 1,
        }
    ]);