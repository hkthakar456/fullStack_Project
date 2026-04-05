import express from "express";
import { registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post(
  "/register",
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


// router.post("/register", registerUser);

// router.route("/login").post(loginUser);
// router.route("/logout").post(logoutUser);

export default router;
