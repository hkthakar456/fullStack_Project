import { Like } from "../../../models/likes.model.js";

//=============================================================================================================//

// Steps
//
// 1. Get User Likes and Populate Video Data
// 2. Initialize Profile
// 3. Process Likes
// 4. Process Tags
// 5. Process Categories
// 6. Normalize Scores
// 7. Return Profile

//=============================================================================================================//

const buildLikePreferenceProfile = async (userId) => {
    //=============================================================================================================//

    // 1. Get User Likes and Populate Video Data

    const userLikes = await Like.find({
        likedBy: userId,
    })
    .populate("video");

    //=============================================================================================================//

    // 2. Initialize Profile

    const profile = {
        tagScores: {},

        categoryScores: {},
    };

    //=============================================================================================================//

    // 3. Process Likes

    userLikes.forEach((like) => {

        const video = like.video;

        if (!video) return;

        //=============================================================================================================//

        // 4. Process Tags

        video.tags.forEach((tag) => {
            const normalizedTag = tag.toLowerCase();

            profile.tagScores[normalizedTag] = (profile.tagScores[normalizedTag] || 0) + 10;
        });

        //=============================================================================================================//

        // 5. Process Categories

        if (video.category) {
            const normalizedCategory = video.category.toLowerCase();

            profile.categoryScores[normalizedCategory] = (profile.categoryScores[normalizedCategory] || 0) + 10;
        }

    });

    //=============================================================================================================//

    // 6. Normalize Scores

    const maxTagScore = Math.max(...Object.values(profile.tagScores), 1);

    const maxCategoryScore = Math.max(...Object.values(profile.categoryScores), 1);


    Object.keys(profile.tagScores)
        .forEach((tag) => {
            profile.tagScores[tag] = Number(((profile.tagScores[tag] / maxTagScore) * 100).toFixed(2));
        });


    Object.keys(profile.categoryScores)
        .forEach((category) => {
            profile.categoryScores[category] = Number(((profile.categoryScores[category] / maxCategoryScore) * 100).toFixed(2));
        });

    //=============================================================================================================//

    // 7. Return Profile

    return profile;

};

export { buildLikePreferenceProfile };
