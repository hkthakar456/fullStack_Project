import express from "express";

import {toggleLike, getVideoLikes, getUserLikeStatus, testLikeProfile} from "../controllers/like.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

//=============================================================================================================//

// Toggle Like

router.route("/video/:videoId/toggle_like").post(verifyJWT, toggleLike);

//=============================================================================================================//

// Get Like Count

router.route("/video/:videoId/likes").get(getVideoLikes);

//=============================================================================================================//

// Get Current User Like Status

router.route("/video/:videoId/like-status").get(verifyJWT, getUserLikeStatus);

//=============================================================================================================//


router.get(
    "/test-like-profile",
    verifyJWT,
    testLikeProfile
);

export default router;