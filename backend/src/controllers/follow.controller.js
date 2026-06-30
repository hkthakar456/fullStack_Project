import { asyncHandler } from "../utils/helpers/asyncHandler.js";
import { ApiError } from "../utils/helpers/ApiError.js";
import { ApiResponse } from "../utils/helpers/ApiResponce.js";

import { Follow } from "../models/follow.model.js";
import { User } from "../models/user.model.js";

const toggleFollow = asyncHandler(async (req, res) => {

    // Steps (Algorithm)

    // 1. Get creator id
    // 2. Validate creator
    // 3. Prevent self follow
    // 4. Check existing follow
    // 5. Toggle follow state
    // 6. Create new follow (if not existing)
    // 7. Return response

//=============================================================================================================//

// 1. Get creator id

    const { creatorId } = req.params;

//=============================================================================================================//

// 2. Validate creator

    const creator = await User.findById(creatorId);

    if (!creator) {

        throw new ApiError(
            404,
            "Creator not found"
        );
    }

//=============================================================================================================//

// 3. Prevent self follow

    if (creatorId === req.user._id.toString()) 
    {
        throw new ApiError(
            400,
            "You cannot follow yourself"
        );
    }

//=============================================================================================================//

// 4. Check existing follow

    const existingFollow =
        await Follow.findOne({
            follower: req.user._id,
            creator: creatorId
        });

//=============================================================================================================//

// 5. Toggle follow state

    if (existingFollow) {

        await Follow.findByIdAndDelete(
            existingFollow._id
        );

        return res.status(200).json(

            new ApiResponse(
                200,
                "Creator unfollowed successfully"
            )
        );
    }

//=============================================================================================================//

// 6. Create new follow (if not existing)

    await Follow.create({

        follower: req.user._id,

        creator: creatorId
    });

//=============================================================================================================//

// 7. Return response

    return res.status(200).json(

        new ApiResponse(
            200,
            "Creator followed successfully"
        )
    );
});

const getFollowers = asyncHandler(async (req, res) => {

    // Steps (Algorithm)

    // 1. Get creator id
    // 2. Count followers
    // 3. Return response

//=============================================================================================================//

// 1. Get creator id

    const { creatorId } = req.params;

//=============================================================================================================//

// 2. Count followers

    const followersCount =
        await Follow.countDocuments({
            creator: creatorId
        });

//=============================================================================================================//

// 3. Return response

    return res.status(200).json(

        new ApiResponse(
            200,
            "Followers fetched successfully",
            {
                followersCount
            }
        )
    );
});

const getFollowing = asyncHandler(async (req, res) => {

    // Steps (Algorithm)

    // 1. Count creators followed by current user
    // 2. Return response

//=============================================================================================================//

// 1. Count creators followed by current user

    const followingCount =
        await Follow.countDocuments({

            follower: req.user._id
        });

//=============================================================================================================//

// 2. Return response

    return res.status(200).json(

        new ApiResponse(
            200,
            "Following count fetched successfully",
            {
                followingCount
            }
        )
    );
});

const getFollowStatus = asyncHandler(async (req, res) => {

    // Steps (Algorithm)

    // 1. Get creator id
    // 2. Check follow existence
    // 3. Return response

//=============================================================================================================//

// 1. Get creator id

    const { creatorId } = req.params;

//=============================================================================================================//

// 2. Check follow existence

    const following =
        await Follow.exists({
            follower: req.user._id,
            creator: creatorId
        });

//=============================================================================================================//

// 3. Return response

    return res.status(200).json(

        new ApiResponse(
            200,
            "Follow status fetched successfully",
            {
                following: !!following
            }
        )
    );
});

export {
    toggleFollow,
    getFollowers,
    getFollowing,
    getFollowStatus
};