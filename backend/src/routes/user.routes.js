import express from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.route("/register").post(
  (req, res, next) => {
    console.log("✅ ROUTE HIT");
    next();
  },
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post((req, res) => {
  res.send("Login route hit");
  next();
}, loginUser);

router.route("/refresh-token").post(
    refreshAccessToken
);

router.route("/logout").post(
    verifyJWT,
    logoutUser
);

export default router;
