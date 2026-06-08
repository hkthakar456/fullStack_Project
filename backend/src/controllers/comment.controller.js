import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";

import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";

//=============================================================================================================//

// Controller functions for Comment Management

const addComment = asyncHandler(async (req, res) => {

    // Steps (Algorithm) to add comment

    // 1. Get video id
    // 2. Get comment content
    // 3. Validate input
    // 4. Check if video exists
    // 5. Create comment
    // 6. Increment comment count
    // 7. Return response

//=============================================================================================================//

// 1. Get video id and comment content

    const { videoId } = req.params;

    const { content } = req.body;

//=============================================================================================================//

// 2. Validate input

    if (!content?.trim()) {

        throw new ApiError(
            400,
            "Comment content is required"
        );
    }

//=============================================================================================================//

// 3. Check if video exists

    const video =
        await Video.findById(videoId);

    if (!video) {

        throw new ApiError(
            404,
            "Video not found"
        );
    }

//=============================================================================================================//

// 4. Create comment

    const comment =
        await Comment.create({
            content,
            owner: req.user._id,
            video: videoId
        });

//=============================================================================================================//

// 5. Increment comment count

    video.commentsCount += 1;

    await video.save({
        validateBeforeSave: false
    });

//=============================================================================================================//

// 6. Return response

    return res.status(201).json(

        new ApiResponse(
            201,
            "Comment added successfully",
            comment
        )
    );
});

const getVideoComments = asyncHandler(async (req, res) => {

    // Steps (Algorithm)

    // 1. Get video id
    // 2. Fetch comments
    // 3. Populate owner details
    // 4. Return response

//=============================================================================================================//

// 1. Get video id

    const { videoId } = req.params;

//=============================================================================================================//

// 2. Fetch comments
// 3. Populate owner details

    const comments =
        await Comment.find({ video: videoId })
        .populate(
            "owner",
            "fullName userName avatar"
        )
        .sort({
            createdAt: -1
        });

//=============================================================================================================//

// 4. Return response

    return res.status(200).json(

        new ApiResponse(
            200,
            "Comments fetched successfully",
            comments
        )
    );
});

const updateComment = asyncHandler(async (req, res) => {

    // Steps

    // 1. Get comment id
    // 2. Validate content
    // 3. Find comment
    // 4. Check ownership
    // 5. Update comment
    // 6. Return response

//=============================================================================================================//

// 1. Get comment id
// 2. Validate content

    const { commentId } = req.params;

    const { content } = req.body;

//=============================================================================================================//

// 3. Validate content

    if (!content?.trim()) {

        throw new ApiError(
            400,
            "Comment content is required"
        );
    }

//=============================================================================================================//

// 4. Find comment

    const comment =
        await Comment.findById(commentId);

    if (!comment) {

        throw new ApiError(
            404,
            "Comment not found"
        );
    }

//=============================================================================================================//

// 5. Check ownership

    if (comment.owner.toString() !== req.user._id.toString()) 
    {
        throw new ApiError(
            403,
            "You are not authorized to update this comment"
        );
    }

//=============================================================================================================//

// 6. Update comment

    comment.content = content;

    await comment.save();

//=============================================================================================================//

// 7. Return response

    return res.status(200).json(

        new ApiResponse(
            200,
            "Comment updated successfully",
            comment
        )
    );
});

const deleteComment = asyncHandler(async (req, res) => {

    // Steps (Algorithm)

    // 1. Get comment id
    // 2. Find comment
    // 3. Check ownership
    // 4. Delete comment
    // 5. Decrement comment count
    // 6. Return response

//=============================================================================================================//

// 1. Get comment id

    const { commentId } = req.params;

//=============================================================================================================//

// 2. Find comment

    const comment =
        await Comment.findById(commentId);

    if (!comment) {

        throw new ApiError(
            404,
            "Comment not found"
        );
    }

//=============================================================================================================//

// 3. Check ownership

    if (comment.owner.toString() !== req.user._id.toString()) 
    {
        throw new ApiError(
            403,
            "You are not authorized to delete this comment"
        );
    }

//=============================================================================================================//

// 4. Decrement comment count

    await Video.findByIdAndUpdate(
        comment.video,
        {
            $inc: {
                commentsCount: -1
            }
        }
    );

//=============================================================================================================//

// 5. Delete comment

    await Comment.findByIdAndDelete(
        commentId
    );

//=============================================================================================================//

// 6. Return response

    return res.status(200).json(

        new ApiResponse(
            200,
            "Comment deleted successfully"
        )
    );
});

export {
    addComment,
    getVideoComments,
    updateComment,
    deleteComment
};