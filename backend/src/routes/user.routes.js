import express from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";

import { userUpload } from "../middlewares/userUpload.middleware.js";

import { videoUpload } from "../middlewares/videoUpload.middleware.js";

const router = express.Router();

router.route("/register").post(
  (req, res, next) => {
    console.log("✅ ROUTE HIT");
    console.log(req.body);
    console.log(req.files);
    next();
  },
  userUpload,
  registerUser
);

router.route("/login").post(
    (req, res, next) => {
        console.log("🔥 LOGIN ROUTE HIT");
        next();
    },
    loginUser
);

router.route("/refresh-token").post(
    refreshAccessToken
);

router.route("/logout").post(
    verifyJWT,
    logoutUser
);

export default router;
