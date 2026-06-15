import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";

import { Like } from "../models/likes.model.js";
import { Video } from "../models/video.model.js";

const toggleLike = asyncHandler(async (req, res) => {

    // Steps (Algorithm)

    // 1. Get video id
    // 2. Check if video exists
    // 3. Check if user already liked
    // 4. If liked -> remove like
    // 5. If not liked -> create like
    // 6. Update likes count
    // 7. Return response

//=============================================================================================================//

// 1. Get video id

    const { videoId } = req.params;

//=============================================================================================================//

// 2. Check if video exists

    const video =
        await Video.findById(videoId);

    if (!video) {

        throw new ApiError(
            404,
            "Video not found"
        );
    }

//=============================================================================================================//

// 3. Check if user already liked

    const existingLike =
        await Like.findOne({likedBy: req.user._id, video: videoId});

//=============================================================================================================//

// 4. If liked -> remove like

    if (existingLike) {

        await Like.findByIdAndDelete(existingLike._id);

        await Video.findByIdAndUpdate(
            videoId,
            {
                $inc: {
                    likesCount: -1
                }
            }
        );

        return res.status(200).json(
            new ApiResponse(
                200,
                "Video unliked successfully"
            )
        );
    }

//=============================================================================================================//

// 5. If not liked -> create like
    else{

        await Like.create({

            likedBy: req.user._id,

            video: videoId
        });
    

//=============================================================================================================//

// 6. Update likes count

        await Video.findByIdAndUpdate(
            videoId,
            {
                $inc: {

                    likesCount: 1

                }
            }
        );

//=============================================================================================================//

// 7. Return response

        return res.status(200).json(

            new ApiResponse(
                200,
                "Video liked successfully"
            )
        );
    }
});

const getVideoLikes = asyncHandler(async (req, res) => {

    // Steps (Algorithm)

    // 1. Get video id
    // 2. Count likes
    // 3. Return response

//=============================================================================================================//

// 1. Get video id

    const { videoId } = req.params;

//=============================================================================================================//

// 2. Count likes

    const likesCount =
        await Like.countDocuments({
            video: videoId
        });

//=============================================================================================================//

// 3. Return response

    return res.status(200).json(
        new ApiResponse(
            200,
            "Likes fetched successfully",
            {
                likesCount
            }
        )
    );
});

const getUserLikeStatus = asyncHandler(async (req, res) => {

    // Steps (Algorithm)

    // 1. Get video id
    // 2. Check if like exists
    // 3. Return response

//=============================================================================================================//

// 1. Get video id

    const { videoId } = req.params;

//=============================================================================================================//

// 2. Check if like exists

    const liked =
        await Like.exists({
            likedBy: req.user._id,
            video: videoId
        });

//=============================================================================================================//

// 3. Return response

    return res.status(200).json(
        new ApiResponse(
            200,
            "Like status fetched",
            {
                liked: !!liked
            }
        )
    );
});

export {
    toggleLike,
    getVideoLikes,
    getUserLikeStatus
};