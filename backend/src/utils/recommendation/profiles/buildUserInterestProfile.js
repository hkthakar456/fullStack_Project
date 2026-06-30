import { User } from "../../../models/user.model.js";

//=============================================================================================================//

// Steps

// 1. Fetch user's watch history with video details (tags, category)
// 2. Calculate interest scores for tags and categories based on watch duration and completion
// 3. Return the interest profile

const buildUserInterestProfile = async (userId) => {

//=============================================================================================================//

// 1. Fetch user's watch history with video details (tags, category)

    const user = await User.findById(
        userId
    ).populate({
        path: "watchHistory.video",
        select:
            "tags category owner"
    });// Only need tags and category for interest profiling

    if (!user) {
        throw new Error("User not found");
    }

//=============================================================================================================//

    const tagScores = {};

    const categoryScores = {};

//=============================================================================================================//

    // Process every watched video

    user.watchHistory.forEach((history) => {

        const video = history.video; // Populated video details are available here

        if (!video) return;// In case the video was deleted after watching

// Weight based on watch completion

        const weight = history.watchPercentage / 10; // Scale to 0-10 for easier scoring

// Tags

        video.tags.forEach((tag) => {

            const normalizedTag = tag.toLowerCase();// Normalize tag for consistent scoring
 
            tagScores[normalizedTag] = (tagScores[normalizedTag] || 0) + weight;// Accumulate score for this tag
        });


// Category

        if (video.category) 
        {
            const normalizedCategory = video.category.toLowerCase();// Normalize category for consistent scoring

            categoryScores[normalizedCategory] = (categoryScores[normalizedCategory] || 0) + weight; // Accumulate score for this category
        }

    });

//=============================================================================================================//

// 3. Return the interest profile

    return {

        tagScores,

        categoryScores
    };// The returned profile contains scores for each tag and category based on the user's watch history
};

//=============================================================================================================//

export {
    buildUserInterestProfile
};