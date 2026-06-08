import express from "express";

import {addComment, getVideoComments, updateComment, deleteComment} from "../controllers/comment.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

//=============================================================================================================//

// Add Comment

router.route("/video/:videoId/comment").post(verifyJWT, addComment);

//=============================================================================================================//

// Get Video Comments

router.route("/video/:videoId/comments").get(getVideoComments);

//=============================================================================================================//

// Update Comment

router.route("/comment/:commentId").patch(verifyJWT,updateComment);

//=============================================================================================================//

// Delete Comment

router.route("/comment/:commentId").delete(verifyJWT,deleteComment);

//=============================================================================================================//

export default router;