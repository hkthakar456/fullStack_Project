import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

import { ApiError } from "../utils/helpers/ApiError.js";
import { ApiResponse } from "../utils/helpers/ApiResponce.js";
import { asyncHandler } from "../utils/helpers/asyncHandler.js";

import { buildSearchClickProfile } from "../utils/recommendation/profiles/buildSearchClickProfile.js";

//=============================================================================================================//

// Helper Functions

const userCountSearches = (users) => {

    return users.reduce(

        (total, user) =>

            total +
            user.searchHistory.length,

        0
    );
};

const userCountClicks = (users) => {

    return users.reduce(

        (total, user) =>

            total +
            user.searchClickHistory.length,

        0
    );
};

//=============================================================================================================//

const searchVideos = asyncHandler(async (req, res) => {
    // Steps (Algorithm)

    // 1. Get search query
    // 2. Validate query
    // 3. Get current user
    // 4. Save search history
    // 5. Search videos
    // 6. Return response

    //=============================================================================================================//

    // 1. Get search query

    const { query } = req.query;

    //=============================================================================================================//

    // 2. Validate query

    if (!query?.trim()) {
        throw new ApiError(400, "Search query is required");
    }

    //=============================================================================================================//

    // 3. Get current user

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    //=============================================================================================================//

    // 4. Save search history

    user.searchHistory.push({ query: query.trim() });

    await user.save();

    //=============================================================================================================//

    // 5. Search videos

    const videos = await Video.find({
        isPublished: true,

        $or: [
            {
                title: {
                    $regex: query,
                    $options: "i",
                },
            },
            {
                description: {
                    $regex: query,
                    $options: "i",
                },
            },
            {
                tags: {
                    $regex: query,
                    $options: "i",
                },
            },
            {
                category: {
                    $regex: query,
                    $options: "i",
                },
            },
        ],
    }).populate("owner", "fullName userName avatar");

    //=============================================================================================================//

    // 6. Return response

    return res
        .status(200)
        .json(new ApiResponse(200, "Search completed successfully", videos));
});

const trackSearchClick = asyncHandler(async (req, res) => {
    //=========================================================================================================//

    // 1. Get Data

    const { query, videoId } = req.body;

    //=========================================================================================================//

    // 2. Validate

    if (!query || !videoId) {
        throw new ApiError(400, "Query and videoId are required");
    }

    //=========================================================================================================//

    // 3. Get User

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    //=============================================================================================================//

    // 4. Get video

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    //=============================================================================================================//

    // 5. Save click signal

    user.searchClickHistory.push({
        query: query.trim(),

        video: video._id,

        category: video.category,

        tags: video.tags,

        creator: video.owner,
    });

    await user.save();

    const existingHistory = user.watchHistory.find(
        (item) => item.video.toString() === videoId
    );

    //=============================================================================================================//

    // 6. Return response

    if (!existingHistory) {
        user.watchHistory.push({
            video: videoId,

            watchDuration: 0,

            watchPercentage: 0,

            watchedAt: new Date(),
        });
    }

    await user.save();
    //=============================================================================================================//

    // 7. Return response

    return res
        .status(200)
        .json(new ApiResponse(200, "Search click tracked successfully", null));
});

const testSearchClickProfile = asyncHandler(async (req, res) => {

    // Steps (Algorithm)

    // 1. Get current user
    // 2. Generate profile
    // 3. Return profile

    //=========================================================================================================//

    // 1. Get current user

    const user = await User.findById(req.user._id);

    if (!user) {

        throw new ApiError(
            404,
            "User not found"
        );
    }

    //=========================================================================================================//

    // 2. Generate profile

    const profile = buildSearchClickProfile(
        user.searchClickHistory
    );

    //=========================================================================================================//

    // 3. Return profile

    return res.status(200).json(

        new ApiResponse(

            200,

            "Search Click Profile generated successfully",

            profile
        )
    );
});

const getSearchAnalytics = asyncHandler(async (req, res) => {

    // Steps (Algorithm)

    // 1. Get all users
    // 2. Create analytics containers
    // 3. Process search history
    // 4. Process search click history
    // 5. Calculate top search queries
    // 6. Calculate top clicked queries
    // 7. Calculate top categories
    // 8. Calculate top tags
    // 9. Calculate total search and clicks
    // 10. Calculate click through rate
    // 11. Return analytics

    //=========================================================================================================//

    // 1. Get all users

    const users = await User.find({});

    //=========================================================================================================//

    // 2. Create analytics containers

    const queryCounts = {};

    const clickedQueryCounts = {};

    const categoryCounts = {};

    const tagCounts = {};

    let totalSearches = 0;

    let totalClicks = 0;

    //=========================================================================================================//

    // 3. Process Search History

    users.forEach((user) => {
        user.searchHistory.forEach((search) => {
            const query = search.query.toLowerCase();

            queryCounts[query] = (queryCounts[query] || 0) + 1;
        });
    });

    //=========================================================================================================//

    // 4. Process Search Click History

    users.forEach((user) => {
        user.searchClickHistory.forEach((click) => {
            //=================================================================================================//

            // Clicked Queries

            const query = click.query.toLowerCase();

            clickedQueryCounts[query] = (clickedQueryCounts[query] || 0) + 1;

            //=================================================================================================//

            // Categories

            const category = click.category?.toLowerCase();

            if (category) {
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            }

            //=================================================================================================//

            // Tags

            click.tags?.forEach((tag) => {
                tag = tag.toLowerCase();

                tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
        });
    });

    //=========================================================================================================//

    // 5. Top Search Queries

    const topQueries = Object.entries(queryCounts)

        .sort((a, b) => b[1] - a[1])

        .slice(0, 10)

        .map(([query, count]) => ({
            query,

            count,
        }));

    //=========================================================================================================//

    // 6. Top Clicked Queries

    const topClickedQueries = Object.entries(clickedQueryCounts)

        .sort((a, b) => b[1] - a[1])

        .slice(0, 10)

        .map(([query, count]) => ({
            query,
            count,
        }));

    //=========================================================================================================//

    // 7. Top Categories

    const topCategories = Object.entries(categoryCounts)

        .sort((a, b) => b[1] - a[1])

        .slice(0, 10)

        .map(([category, count]) => ({
            category,
            count,
        }));

    //=========================================================================================================//

    // 8. Top Tags

    const topTags = Object.entries(tagCounts)

        .sort((a, b) => b[1] - a[1])

        .slice(0, 10)

        .map(([tag, count]) => ({
            tag,
            count,
        }));

    //=========================================================================================================//

    // 9. Calculate total search and clicks

    totalSearches = userCountSearches(users);

    totalClicks = userCountClicks(users);


    //=============================================================================================================//
// TODO (Future Improvement)
//
// Current CTR Formula:
//
// CTR = (Total Clicks / Total Searches) * 100
//
// This works for development/testing.
//
// Problem:
//
// One search can generate multiple clicks.
//
// Example:
//
// Searches = 1
// Clicks = 4
//
// CTR = 400%
//
// Future Solution:
//
// Replace raw CTR with:
//
// 1. Unique Search CTR
//
// OR
//
// 2. Search Session CTR
//
// OR
//
// 3. Searches With At Least One Click
//
// Example:
//
// Searches = 10
// Searches With Click = 6
//
// CTR = 60%
//
// This will provide more realistic analytics
// for production dashboards.
//
//=============================================================================================================//

    //=========================================================================================================//

    // 10. Calculate Click Through Rate

    const clickThroughRate =
        totalSearches === 0
            ? 0
            : Number(((totalClicks / totalSearches) * 100).toFixed(2));

    //=========================================================================================================//

    // 11. Return Analytics

    return res.status(200).json(
        new ApiResponse(
            200,

            "Search analytics generated successfully",

            {
                totalUsers: users.length,

                totalSearches,

                totalClicks,

                clickThroughRate,

                topQueries,

                topClickedQueries,

                topCategories,

                topTags,
            }
        )
    );
});


export { 
    searchVideos,
    trackSearchClick,
    testSearchClickProfile,
    getSearchAnalytics 
};

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
