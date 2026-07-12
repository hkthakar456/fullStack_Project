import { Video } from "../../models/video.model.js";

import { isColdStartUser } from "../coldStart/Metrics Layer/isColdStartUser.js";
import { buildColdStartFeed } from "../coldStart/buildColdStartFeed.js";
import { buildPersonalizedFeed } from "../recommendation/buildPersonalizedFeed.js"

import { DEFAULT_RECOMMENDATION_BATCH_SIZE } from "../../constants/recommendation.constants.js";

const buildRecommendationFeed = async ({ user, feedSize = DEFAULT_RECOMMENDATION_BATCH_SIZE }) => {
    // Responsibility:

    // Generate the final recommendation feed by deciding whether to serve a cold
    // start feed or a personalized feed. If the personalized feed doesn't contain
    // enough recommendations, complete it using the cold start recommendation
    // system.

    // Steps(Algorithm):

    // 1. Detect Cold Start User
    // 2: Build Cold Start Feed
    // 3. Build Personalized Feed
    // 4. Check Feed Size
    // 5. Build Cold Start Feed (If Needed)
    // 6. Merge Personalized & Cold Start Feed
    // 7. Return Final Recommendation Feed

    // For Guest user
    if (!user) {
        const videos = await Video.find({
            isPublished: true,
        }).populate("owner", "fullName userName avatar");

        return buildColdStartFeed({
            videos,
            feedSize,
        });
    }

    // For Authenticated (logged in) user

    //=========================================================================================================//

    // Step 1: Detect Cold Start User

    console.log("Recommendation User:", user);
    console.log("Watch History:", user?.watchHistory);
    console.log("Like History:", user?.likeHistory);
    console.log("Search Click History:", user?.searchClickHistory);

    const coldStartUser = isColdStartUser(user);

    //=========================================================================================================//

    // Step 2: Build Cold Start Feed

    if (coldStartUser) {
        const videos = await Video.find({
            isPublished: true,
        }).populate("owner", "fullName userName avatar");

        return buildColdStartFeed({
            videos,
            feedSize,
        });
    }

    //=========================================================================================================//

    // Step 3: Build Personalized Feed

    const userId = user._id.toString();

    const personalizedFeed = await buildPersonalizedFeed({ userId, feedSize });

    //=========================================================================================================//

    // Step 4: Check Feed Size

    if (personalizedFeed.length >= feedSize) {
        return personalizedFeed.slice(0, feedSize);
    }

    //=========================================================================================================//

    // Step 5: Build Cold Start Feed

    const videos = await Video.find({
        isPublished: true,
    }).populate("owner", "fullName userName avatar");

    const coldStartFeed = buildColdStartFeed({ videos, feedSize });

    //=========================================================================================================//

    // Step 6: Merge Personalized & Cold Start Feed

    const finalFeed = [...personalizedFeed];

    const existingVideoIds = new Set(
        personalizedFeed.map((item) => item.video._id.toString())
    );

    for (const item of coldStartFeed) {
        if (finalFeed.length >= feedSize) break;

        const videoId = item.video._id.toString();

        if (existingVideoIds.has(videoId)) {
            continue;
        }

        finalFeed.push(item);
    }

    //=========================================================================================================//

    // Step 7: Return Final Recommendation Feed

    return finalFeed;
};;

export { buildRecommendationFeed };
