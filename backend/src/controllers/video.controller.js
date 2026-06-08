import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponce.js";

import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";


const uploadVideo = asyncHandler(async (req, res) => {

    // Steps (Algorithm) to upload video

    // 1. Get video details from request body
    // 2. Validate required fields
    // 3. Get thumbnail and video file paths from multer
    // 4. Upload thumbnail to Cloudinary
    // 5. Upload video to Cloudinary
    // 6. Create video document in database
    // 7. Return success response

//=============================================================================================================//

    // 1. Get video details from request body

    const {title, description, category, tags} = req.body;

//=============================================================================================================//

    // 2. Validate required fields

    if (!title || !description) 
    {
        throw new ApiError(
            400,
            "Title and description are required"
        );
    }

//=============================================================================================================//

    // 3. Get thumbnail and video file paths from multer

    const thumbnailLocalPath =req.files?.thumbnail?.[0]?.path;

    const videoLocalPath = req.files?.videoFile?.[0]?.path;

    if (!thumbnailLocalPath) {
        throw new ApiError(
            400,
            "Thumbnail file is required"
        );
    }

    if (!videoLocalPath) {

        throw new ApiError(
            400,
            "Video file is required"
        );
    }

//=============================================================================================================//

    // 4. Upload thumbnail to Cloudinary

    const thumbnail =
        await uploadToCloudinary(
            thumbnailLocalPath,
            "videoTube/thumbnails"
        );

    if (!thumbnail) {

        throw new ApiError(
            500,
            "Failed to upload thumbnail"
        );
    }

//=============================================================================================================//

    // 5. Upload video to Cloudinary

    const videoFile =
        await uploadToCloudinary(
            videoLocalPath,
            "videoTube/videos"
        );

    if (!videoFile) {

        throw new ApiError(
            500,
            "Failed to upload video"
        );
    }

//=============================================================================================================//

    // 6. Create video document in database

    const video = await Video.create({

        title: {
            type: String,
            required: true,
        },

        description: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            default: "General"
        },

        tags:
            tags? tags.split(","): [],

        videoFile:
            videoFile.secure_url,

        thumbnail:
            thumbnail.secure_url,

        duration:
            videoFile.duration,

        owner:
            req.user._id
    });

//=============================================================================================================//

    // 7. Check if video created successfully

    if (!video) {

        throw new ApiError(
            500,
            "Failed to create video"
        );
    }

//=============================================================================================================//

    // 8. Return success response

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                "Video uploaded successfully",
                video
            )
        );
});

const getAllVideos = asyncHandler(async (req, res) => {

    // Steps

    // 1. Fetch all published videos
    // 2. Populate owner details
    // 3. Return response

//=============================================================================================================//

    // 1. Fetch all published videos
    // 2. Populate owner details

    const videos =
        await Video.find({
            isPublished: true
        })
        .populate(
            "owner",
            "fullName userName avatar"
        )
        .sort({
            createdAt: -1
        });

//=============================================================================================================//

// 3. Return response

    return res.status(200).json(

        new ApiResponse(
            200,
            "Videos fetched successfully",
            videos
        )
    );
});

const getVideoById = asyncHandler(async (req, res) => {

    // Steps

    // 1. Get video id
    // 2. Validate video
    // 3. Increase views
    // 4. Return video details

//=============================================================================================================//

// 1. Get video id

    const { videoId } = req.params;

//=============================================================================================================//

// 2. Validate video

    const video =
        await Video.findById(videoId)
        .populate(
            "owner",
            "fullName userName avatar coverImage"
        );

    if (!video) {

        throw new ApiError(
            404,
            "Video not found"
        );
    }

//=============================================================================================================//

// 3. Add video to watch history if user is logged in and Increase views

    if (req.user?._id) {

        await User.findByIdAndUpdate(
            req.user._id,
            {
                $push: {
                    watchHistory: {
                        video: videoId,
                        watchedAt: new Date()
                    }
                }
            }
        );
    }

    video.views += 1;

    await video.save({
        validateBeforeSave: false
    });

//=============================================================================================================//

// 4. Return video details

    return res.status(200).json(

        new ApiResponse(
            200,
            "Video fetched successfully",
            video
        )
    );
});

const deleteVideo = asyncHandler(async (req, res) => {

    // Steps

    // 1. Get video id
    // 2. Find video
    // 3. Check ownership
    // 4. Delete video
    // 5. Return response

//=============================================================================================================//

// 1. Get video id

    const { videoId } = req.params;

//=============================================================================================================//

// 2. Find video

    const video =
        await Video.findById(videoId);

    if (!video) {
        throw new ApiError(
            404,
            "Video not found"
        );
    }

//=============================================================================================================//

// 3. Check ownership

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to delete this video"
        );
    }

//=============================================================================================================//

// 4. Delete video

    await Video.findByIdAndDelete(videoId);

//=============================================================================================================//

// 5. Return response

    return res.status(200).json(
        new ApiResponse(
            200,
            "Video deleted successfully"
        )
    );
});

const updateVideo = asyncHandler(async (req, res) => {

    // Steps (Algorithm) to update video details

    // 1. Get video id from params
    // 2. Get updated data from request body
    // 3. Find video
    // 4. Check ownership
    // 5. Update video fields
    // 6. Return updated video

//=============================================================================================================//

// 1. Get video id from params

    const { videoId } = req.params;

//=============================================================================================================//

// 2. Get updated data from request body

    const {title, description, category, tags} = req.body;

//=============================================================================================================//

// 3. Find video

    const video = await Video.findById(videoId);

    if (!video) {

        throw new ApiError(
            404,
            "Video not found"
        );
    }

//=============================================================================================================//

// 4. Check ownership

    if (video.owner.toString() !== req.user._id.toString()) 
    {
        throw new ApiError(
            403,
            "You are not authorized to update this video"
        );
    }

//=============================================================================================================//

// 5. Build update object dynamically

    const updateFields = {};      

    if (title !== undefined && title !== null) {
        updateFields.title = title;
    }
    if (description !== undefined && description !== null) {
        updateFields.description = description;
    }
    if (category !== undefined && category !== null) {
        updateFields.category = category;
    }
    if (tags !== undefined && tags !== null) {
        updateFields.tags = Array.isArray(tags)? tags: tags.split(",").map(tag => tag.trim());
    }

//=============================================================================================================//

// 6. Save updated video and return response

    const updatedVideo =
        await Video.findByIdAndUpdate(

            videoId,

            {
                $set: updateFields
            },

            {
                new: true,
                runValidators: true
            }
        );

//=============================================================================================================//

// 7. Return updated video

    return res.status(200).json(

        new ApiResponse(
            200,
            "Video updated successfully",
            updatedVideo
        )
    );
});

const togglePublishStatus = asyncHandler(async (req, res) => {

    // Steps (Algorithm) to toggle publish status

    // 1. Get video id
    // 2. Find video
    // 3. Check ownership
    // 4. Toggle publish status
    // 5. Save video
    // 6. Return response

//=============================================================================================================//

// 1. Get video id

    const { videoId } = req.params;

//=============================================================================================================//

// 2. Find video

    const video = await Video.findById(videoId);

    if (!video) {

        throw new ApiError(
            404,
            "Video not found"
        );
    }

//=============================================================================================================//

// 3. Check ownership

    if (video.owner.toString() !== req.user._id.toString()) 
    {
        throw new ApiError(
            403,
            "You are not authorized to perform this action"
        );
    }

//=============================================================================================================//

// 4. Toggle publish status

    video.isPublished = !video.isPublished;

    await video.save({
        validateBeforeSave: false
    });

//=============================================================================================================//

    return res.status(200).json(

        new ApiResponse(
            200,
            `Video ${video.isPublished? "published": "unpublished"} successfully`,
            video
        )
    );
});

const getMyVideos = asyncHandler(async (req, res) => {

    // Steps (Algorithm) to get creator videos

    // 1. Get logged in user id
    // 2. Find all videos uploaded by user
    // 3. Sort latest first
    // 4. Return response

//=============================================================================================================//

// 1. Get logged in user id
    const userId = req.user._id;

//=============================================================================================================//

// 2. Find all videos uploaded by user
// 3. Sort latest first

    const videos = await Video.find({
        owner: userId
    }).sort({
        createdAt: -1
    });

//=============================================================================================================//

    return res.status(200).json(

        new ApiResponse(
            200,
            "Videos fetched successfully",
            videos
        )
    );
});

const updateVideoFile = asyncHandler(async (req, res) => {

    // Steps (Algorithm) to update video file

    // 1. Get video id
    // 2. Find video
    // 3. Check ownership
    // 4. Get video file
    // 5. Upload video to Cloudinary
    // 6. Update video URL and duration
    // 7. Return response

//=============================================================================================================//

// 1. Get video id

    const { videoId } = req.params;

//=============================================================================================================//

// 2. Find video

    const video = await Video.findById(videoId);

    if (!video) {

        throw new ApiError(
            404,
            "Video not found"
        );
    }

//=============================================================================================================//

// 3. Check ownership

    if (
        video.owner.toString() !==
        req.user._id.toString()
    ) {

        throw new ApiError(
            403,
            "You are not authorized to update this video"
        );
    }

//=============================================================================================================//

// 4. Get video file

    const videoLocalPath =
        req.file?.path;

    if (!videoLocalPath) {

        throw new ApiError(
            400,
            "Video file is required"
        );
    }

//=============================================================================================================//

// 5. Upload video to Cloudinary

    const uploadedVideo =
        await uploadToCloudinary(
            videoLocalPath,
            "videoTube/videos"
        );

    if (!uploadedVideo) {

        throw new ApiError(
            500,
            "Failed to upload video"
        );
    }

//=============================================================================================================//

// 6. Update video URL and duration

    video.videoFile =
        uploadedVideo.secure_url;

    video.duration =
        uploadedVideo.duration;

    await video.save({
        validateBeforeSave: false
    });

//=============================================================================================================//

// 7. Return response

    return res.status(200).json(

        new ApiResponse(
            200,
            "Video file updated successfully",
            video
        )
    );
});

const updateThumbnail = asyncHandler(async (req, res) => {

    // Steps (Algorithm) to update thumbnail

    // 1. Get video id
    // 2. Find video
    // 3. Check ownership
    // 4. Get thumbnail file
    // 5. Upload thumbnail to Cloudinary
    // 6. Update thumbnail URL
    // 7. Return response

//=============================================================================================================//

// 1. Get video id

    const { videoId } = req.params;

//=============================================================================================================//

// 2. Find video

    const video = await Video.findById(videoId);

    if (!video) {

        throw new ApiError(
            404,
            "Video not found"
        );
    }

//=============================================================================================================//

// 3. Check ownership

    if (
        video.owner.toString() !==
        req.user._id.toString()
    ) {

        throw new ApiError(
            403,
            "You are not authorized to update this video"
        );
    }

//=============================================================================================================//

// 4. Get thumbnail file

    const thumbnailLocalPath =
        req.file?.path;

    if (!thumbnailLocalPath) {

        throw new ApiError(
            400,
            "Thumbnail file is required"
        );
    }

//=============================================================================================================//

// 5. Upload thumbnail to Cloudinary

    const thumbnail =
        await uploadToCloudinary(
            thumbnailLocalPath,
            "videoTube/thumbnails"
        );

    if (!thumbnail) {

        throw new ApiError(
            500,
            "Failed to upload thumbnail"
        );
    }

//=============================================================================================================//

// 6. Update thumbnail URL

    video.thumbnail =
        thumbnail.secure_url;

    await video.save({
        validateBeforeSave: false
    });

//=============================================================================================================//

// 7. Return response

    return res.status(200).json(

        new ApiResponse(
            200,
            "Thumbnail updated successfully",
            video
        )
    );
});

const getWatchHistory = asyncHandler(async (req, res) => {

    // Steps (Algorithm)

    // 1. Get logged in user
    // 2. Populate watch history and video owner details
    // 3. Sort watch history by watchedAt in descending order
    // 4. Return response

//=============================================================================================================//

// 1. Get logged in user
// 2. Populate watch history and video owner details
    const user = await User.findById(

        req.user._id

    ).populate({

        path: "watchHistory",

        populate: {
            path: "owner",
            select:
                "fullName userName avatar"
        }
    });

    if (!user) {

        throw new ApiError(
            404,
            "User not found"
        );
    }

//=============================================================================================================//

// 3. Sort watch history by watchedAt in descending order

    const watchHistory =[...user.watchHistory]
        .sort((a, b) => b.watchedAt - a.watchedAt);

//=============================================================================================================//

// 4. Return response

    return res.status(200).json(

        new ApiResponse(
            200,
            "Watch history fetched successfully",
            user.watchHistory
        )
    );
});

export {
    uploadVideo,
    getAllVideos,
    getVideoById,
    deleteVideo,
    updateVideo,
    togglePublishStatus,
    getMyVideos,
    updateVideoFile,
    updateThumbnail,
    getWatchHistory
};
