import express from "express";

import {
  uploadVideo,
  getAllVideos,
  getVideoById,
  deleteVideo,
  updateVideo,
  togglePublishStatus,
  getMyVideos,
  updateVideoFile,
  updateThumbnail,
  getWatchHistory
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { videoUpload } from "../middlewares/videoUpload.middleware.js";

const router = express.Router();

//=============================================================================================================//

// Routes for Video Management

// 1. Upload Video
// 2. Get All Videos
// 3. Get Single Video By ID
// 4. Delete Video

//=============================================================================================================//

// 1. Upload Video

router.route("/upload-video").post(

    // Verify authenticated user

    verifyJWT,

    // Upload thumbnail and video file

    videoUpload.fields([
        {
            name: "thumbnail",
            maxCount: 1,
        },
        {
            name: "videoFile",
            maxCount: 1,
        },
    ]),
    uploadVideo
);

//=============================================================================================================//

// 2. Get All Videos

router.route("/all-videos").get(getAllVideos);

//=============================================================================================================//

// 3. Get Single Video By ID

router.route("/video/:videoId").get(getVideoById);

//=============================================================================================================//

// 4. Delete Video

router.route("/video/:videoId").delete(verifyJWT, deleteVideo);

//=============================================================================================================//

// 5. Update Video

router.route("/video/:videoId").put(verifyJWT, updateVideo);

//=============================================================================================================//

// 6. Toggle Publish/Unpublish Video

router.route("/video/:videoId/toggle-publish").patch(verifyJWT, togglePublishStatus);

//=============================================================================================================//

// 7. Get My Videos

router.route("/my-videos").get(verifyJWT, getMyVideos);

//=============================================================================================================//

// 8. Update Video File

router.route("/video/:videoId/update-video-file").put(
    verifyJWT,
    videoUpload.single("videoFile"),
    updateVideoFile
);

//=============================================================================================================//

// 9. Update Thumbnail

router.route("/video/:videoId/update-thumbnail").put(
    verifyJWT,
    videoUpload.single("thumbnail"),
    updateThumbnail
);

//=============================================================================================================//

// 10. Get Watch History

router.route("/watch-history").get(verifyJWT, getWatchHistory);

export default router;