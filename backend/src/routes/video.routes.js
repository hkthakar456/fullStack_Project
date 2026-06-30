import express from "express";

console.log("VIDEO ROUTES LOADED");

import {
  uploadVideo,
  getAllVideos,
  getVideoById,
  deleteVideo,
  updateVideoDetails,
  togglePublishStatus,
  getMyVideos,
  updateVideoFile,
  updateThumbnail,
  getWatchHistory,
  updateWatchProgress,
  recommended_Videos
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
    verifyJWT,
    videoUpload,
    uploadVideo
);

//=============================================================================================================//

// 2. Get All Videos

router.route("/all-videos").get(getAllVideos);

//=============================================================================================================//

// 3. Get Single Video By ID

router.route("/video/:videoId").get(verifyJWT, getVideoById);

//=============================================================================================================//

// 4. Delete Video

router.route("/video/:videoId").delete(verifyJWT, deleteVideo);

//=============================================================================================================//

// 5. Update Video Details

router.route("/video/:videoId/updateVideoDetails").put(verifyJWT, updateVideoDetails);

//=============================================================================================================//

// 6. Toggle Publish/Unpublish Video

router.route("/video/:videoId/toggle_publish").patch(verifyJWT, togglePublishStatus);

//=============================================================================================================//

// 7. Get My Videos

router.route("/my_videos").get(verifyJWT, getMyVideos);

//=============================================================================================================//

// 8. Update Video File

router.route("/video/:videoId/update_video_file").put(
    verifyJWT,
    videoUpload,
    updateVideoFile
);

//=============================================================================================================//

// 9. Update Thumbnail

router.route("/video/:videoId/update_thumbnail").put(
    verifyJWT,
    videoUpload,
    updateThumbnail
);

//=============================================================================================================//

// 10. Get Watch History

router.route("/watch_history").get(verifyJWT, getWatchHistory);

//=============================================================================================================//

// 11. Update Watch Progress

router.route("/video/:videoId/update_watch_progress").post(verifyJWT, updateWatchProgress);


//=============================================================================================================//

// 12. Get Recommended Videos

router.route("/recommended_Videos").get(verifyJWT, recommended_Videos);




export default router;