import express from "express";

import {
    toggleFollow,
    getFollowers,
    getFollowing,
    getFollowStatus
} from "../controllers/follow.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

//=============================================================================================================//

// Toggle Follow

router.route("/creator/:creatorId/follow").post(verifyJWT,toggleFollow);

//=============================================================================================================//

// Get Followers

router.route("/creator/:creatorId/followers").get(getFollowers);

//=============================================================================================================//

// Get Following Count

router.route("/following").get(verifyJWT,getFollowing);

//=============================================================================================================//

// Get Follow Status

router.route("/creator/:creatorId/follow-status").get(verifyJWT,getFollowStatus);

//=============================================================================================================//

export default router;