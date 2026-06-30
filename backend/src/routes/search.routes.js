console.log("SEARCH ROUTES LOADED");

import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";

import { 
    searchVideos, 
    trackSearchClick,
    getSearchAnalytics,
    testSearchClickProfile,
} from "../controllers/search.controller.js";

const router = Router();

//=============================================================================================================//
// Search Videos
//
// Example:
//
// /api/v1/search?query=react
//
//=============================================================================================================//

router.route("/").get(verifyJWT, searchVideos);

router.route("/click").post(verifyJWT, trackSearchClick);

router.route("/analytics").get(verifyJWT, getSearchAnalytics);


router.route("/profile")
.get(
    verifyJWT,
    testSearchClickProfile
);



export default router;


//=============================================================================================================//
// TODO:
//
// Frontend Integration Required
//
// When user clicks a search result:
//
// POST /api/v1/search/click
//
// Body:
//
// {
//     query,
//     videoId
// }
//
//=============================================================================================================//