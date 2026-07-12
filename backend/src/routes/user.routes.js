import express from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";

import { userUpload } from "../middlewares/userUpload.middleware.js";

import { videoUpload } from "../middlewares/videoUpload.middleware.js";

const router = express.Router();

router.route("/register").post(
  userUpload,
  registerUser
);

router.route("/login").post(
    loginUser
);

router.route("/refresh-token").post(
    refreshAccessToken
);

router.route("/logout").post(
    verifyJWT,
    logoutUser
);

router.route("/current-user").get(
    verifyJWT,
    getCurrentUser
);

export default router;
