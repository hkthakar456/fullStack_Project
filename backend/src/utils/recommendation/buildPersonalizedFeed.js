import { Video } from "../../models/video.model.js";
import { User } from "../../models/user.model.js";

import { applyDiversityLayer } from "../feed/applyDiversityLayer.js";
import { assembleFeed } from "../feed/assembleFeed.js";

import { buildUserInterestProfile } from "./profiles/buildUserInterestProfile.js";
import { buildCreatorAffinityProfile } from "./profiles/buildCreatorAffinityProfile.js";
import { buildSearchClickProfile } from "./profiles/buildSearchClickProfile.js";
import { buildLikePreferenceProfile } from "./profiles/buildLikePreferenceProfile.js";

import { calculateRecommendationScore } from "./scores/calculateRecommendationScore.js";
import { getFollowedCreators } from "./signals/getFollowedCreators.js";

//=============================================================================================================//
// Build Personalized Feed
//=============================================================================================================//

export const buildPersonalizedFeed = async ({ userId, feedSize = 100 }) => {

    // Steps (Algorithm):
    
    // 1. Get User
    // 2. Build User Interest Profile
    // 3. Build Creator Affinity Profile
    // 4. Build Like Preference Profile
    // 5. Build Search Click Profile
    // 6. Get Followed Creators
    // 7. Build Excluded Video List
    // 8. Fetch Candidate Videos
    // 9. Calculate Recommendation Scores
    // 10. Sort Recommendation Candidates
    // 11. Remove Irrelevant Videos
    // 12. Keep Top Recommendation Candidates
    // 13. Apply Diversity Layer
    // 14. Calculate Feed Distribution
    // 15. Build Personalized Pool
    // 16. Build Related Pool
    // 17. Build Exploration Pool
    // 18. Fill Related Pool With Remaining Videos
    // 19. Assemble Personalized Feed
    // 20. Return Personalized Feed
    
    //=========================================================================================================//
    
    // Step 1: Get User
    

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    //=========================================================================================================//
    
    // Step 2: Build User Interest Profile
    

    const userProfile = await buildUserInterestProfile(userId);

    //=========================================================================================================//
    
    // Step 3: Build Creator Affinity Profile
    

    const creatorAffinity = await buildCreatorAffinityProfile(userId);

    //=========================================================================================================//
    
    // Step 4: Build Like Preference Profile
    

    const likeProfile = await buildLikePreferenceProfile(userId);

    //=========================================================================================================//
    
    // Step 5: Build Search Click Profile
    

    const searchClickProfile = buildSearchClickProfile(user.searchClickHistory);

    //=========================================================================================================//
    
    // Step 6: Get Followed Creators
    

    const followedCreatorsList = await getFollowedCreators(userId);

    //=========================================================================================================//
    
    // Step 7: Build Excluded Video List
    
    // Exclude:
    // • Completed videos (>= 85%)
    // • Abandoned videos (<= 15%)
    //
    // Keep:
    // • Continue Watching
    // • Partially Watched Videos

    const excludedVideoIds = user.watchHistory

        .filter(
            (item) => item.watchPercentage >= 85 || item.watchPercentage <= 15
        )

        .map((item) => item.video.toString());

    //=========================================================================================================//
    
    // Step 8: Fetch Candidate Videos

    const candidateVideos = await Video.find({
        isPublished: true,

        _id: {
            $nin: excludedVideoIds,
        },
    })

        .populate("owner", "fullName userName avatar");

    //=========================================================================================================//
    
    // Step 9: Calculate Recommendation Scores
    

    const scoredVideos = candidateVideos.map((video) => {
        const scoreResult = calculateRecommendationScore(
            video,

            userProfile,

            creatorAffinity,

            likeProfile,

            searchClickProfile,

            followedCreatorsList
        );

        return {
            video,

            score: scoreResult.totalScore,

            breakdown: scoreResult.breakdown,
        };
    });

    //=========================================================================================================//
    
    // Step 10: Sort Recommendation Candidates
    

    scoredVideos.sort((a, b) => b.score - a.score);

    //=========================================================================================================//
    
    // Step 11: Remove Irrelevant Videos
    

    const relevantVideos = scoredVideos.filter((item) => item.score > 0);

    //=========================================================================================================//
    
    // Step 12: Keep Top Recommendation Candidates
    

    const topVideos = relevantVideos.slice(0, 250);

    //=========================================================================================================//
    
    // Step 13: Apply Diversity Layer
    

    const diversifiedFeed = applyDiversityLayer(topVideos);

    //=========================================================================================================//
    
    // Step 14: Calculate Feed Distribution
    

    const totalVideos = diversifiedFeed.length;

    const personalizedCount = Math.max(1, Math.floor(totalVideos * 0.6));

    const relatedCount = Math.max(1, Math.floor(totalVideos * 0.25));

    const explorationCount = Math.max(1, Math.floor(totalVideos * 0.15));

    //=========================================================================================================//
    
    // Step 15: Build Personalized Pool
    
    // Most relevant recommendations
    

    const personalizedVideos = diversifiedFeed.slice(0, personalizedCount);

    //=========================================================================================================//
    
    // Step 16: Build Related Pool
    
    // Medium relevance recommendations
    

    const personalizedIds = new Set(
        personalizedVideos.map((item) => item.video._id.toString())
    );

    const relatedVideos = diversifiedFeed

        .filter((item) => !personalizedIds.has(item.video._id.toString()))

        .slice(0, relatedCount);

    const relatedIds = new Set(
        relatedVideos.map((item) => item.video._id.toString())
    );

    //=========================================================================================================//
    
    // Step 17: Build Exploration Pool
    
    // Low relevance videos that introduce users to
    // new creators, categories and tags.

    const usedVideoIds = new Set([
        ...personalizedVideos.map((item) => item.video._id.toString()),
        ...relatedVideos.map((item) => item.video._id.toString()),
    ]);

    const explorationVideos = diversifiedFeed

        .filter(
            (item) =>
                !usedVideoIds.has(item.video._id.toString()) &&
                !relatedIds.has(item.video._id.toString()) &&
                !personalizedIds.has(item.video._id.toString())
        )

        .filter((item) => item.score < 25)

        .map((item) => {
            let explorationScore = 0;

            //=================================================================================================//
            
            // Reward Unknown Category
            

            const categoryScore =
                userProfile.categoryScores[
                    item.video.category?.toLowerCase()
                ] || 0;

            if (categoryScore < 20) {
                explorationScore += 40;
            }

            //=================================================================================================//
            
            // Reward Unknown Tags
            

            let unfamiliarTags = 0;

            item.video.tags.forEach((tag) => {
                const tagScore = userProfile.tagScores[tag.toLowerCase()] || 0;

                if (tagScore < 20) {
                    unfamiliarTags++;
                }
            });

            explorationScore += unfamiliarTags * 10;

            //=================================================================================================//
            
            // Reward Unknown Creator
            

            const creatorId = item.video.owner._id.toString();

            const creatorScore = creatorAffinity[creatorId] || 0;

            if (creatorScore === 0) {
                explorationScore += 20;
            }

            //=================================================================================================//
            
            // Small Trending Boost
            
            // Prevent completely dead videos from entering
            // the exploration pool.
            

            explorationScore += Math.min(item.video.views / 10, 20);

            return {
                ...item,

                explorationScore,
            };
        })

        .sort((a, b) => b.explorationScore - a.explorationScore)

        .slice(0, explorationCount);

    //=========================================================================================================//
    
    // Step 18: Fill Related Pool With Remaining Videos
    
    // Preserve every recommendation candidate that
    // wasn't assigned to Personalized or Exploration.

    const assignedVideoIds = new Set([
        ...personalizedVideos.map((item) => item.video._id.toString()),

        ...relatedVideos.map((item) => item.video._id.toString()),

        ...explorationVideos.map((item) => item.video._id.toString()),
    ]);

    const leftoverVideos = diversifiedFeed.filter(
        (item) => !assignedVideoIds.has(item.video._id.toString())
    );

    relatedVideos.push(...leftoverVideos);

    //=========================================================================================================//
    
    // Step 19: Assemble Personalized Feed
    

    const personalizedFeed = assembleFeed({
        personalizedVideos,

        relatedVideos,

        explorationVideos,
    });

    //=========================================================================================================//
    
    // Step 20: Return Personalized Feed

    return personalizedFeed.slice(0, feedSize);
};
