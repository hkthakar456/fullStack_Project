//=============================================================================================================//

// Steps
//
// 1. Initialize Diversity Counters
// 2. Copy Trending Candidates
// 3. Select Best Candidate
// 4. Calculate Diversity Penalty
// 5. Find Highest Adjusted Score
// 6. Add Video To Feed
// 7. Update Diversity Counters
// 8. Remove Selected Candidate
// 9. Repeat Until Feed Complete
// 10. Return Diversified Feed

//=============================================================================================================//

const applyTrendingDiversity = (trendingCandidates, feedSize = 100) => {

    // 1. Initialize Diversity Counters

    const categoryCounts = {};

    const creatorCounts = {};

    const tagCounts = {};

    //=============================================================================================================//

    // 2. Copy Trending Candidates

    const remainingCandidates = [...trendingCandidates];

    const diversifiedFeed = [];

    //=============================================================================================================//

    // 9. Repeat Until Feed Complete

    while (remainingCandidates.length > 0 && diversifiedFeed.length < feedSize) 
    {
        let bestIndex = 0;

        let bestAdjustedScore = -Infinity;

        //=============================================================================================================//

        // 3. Select Best Candidate

        remainingCandidates.forEach((candidate, index) => {

            const video = candidate.video;

            //=============================================================================================================//

            // 4. Calculate Diversity Penalty

            const category = video.category?.toLowerCase() || "uncategorized";

            const creatorId = video.owner?._id?.toString() || video.owner?.toString();

            //=============================================================================================================//

            const categoryPenalty = (categoryCounts[category] || 0) * 0.5;

            const creatorPenalty = (creatorCounts[creatorId] || 0) * 1.0;

            let tagPenalty = 0;

            video.tags.forEach((tag) => {

                const normalizedTag = tag.toLowerCase();

                tagPenalty += (tagCounts[normalizedTag] || 0) * 0.15;
            });

            //=============================================================================================================//

            const diversityPenalty = categoryPenalty + creatorPenalty + tagPenalty;

            const adjustedScore = candidate.trendingScore - diversityPenalty;

            //=============================================================================================================//

            // 5. Find Highest Adjusted Score

            if (adjustedScore > bestAdjustedScore) 
            {
                bestAdjustedScore = adjustedScore;
                bestIndex = index;
            }

            //=============================================================================================================//
        });

        //=============================================================================================================//

        const selectedVideo = remainingCandidates[bestIndex];

        //=============================================================================================================//

        // 6. Add Video To Feed

        diversifiedFeed.push({
            ...selectedVideo,

            adjustedTrendingScore: Number(bestAdjustedScore.toFixed(2)),
        });

        //=============================================================================================================//

        const video = selectedVideo.video;

        const category = video.category?.toLowerCase() || "uncategorized";

        const creatorId = video.owner?._id?.toString() || video.owner?.toString();

        //=============================================================================================================//

        // 7. Update Diversity Counters

        categoryCounts[category] = (categoryCounts[category] || 0) + 1;

        creatorCounts[creatorId] = (creatorCounts[creatorId] || 0) + 1;

        video.tags.forEach((tag) => {
            const normalizedTag = tag.toLowerCase();

            tagCounts[normalizedTag] = (tagCounts[normalizedTag] || 0) + 1;
        });

        //=============================================================================================================//

        // 8. Remove Selected Candidate

        remainingCandidates.splice(bestIndex, 1);
        
    }

    //=============================================================================================================//

    // 10. Return Diversified Feed

    return diversifiedFeed;

};

export { applyTrendingDiversity };


// TODO:
// Future Upgrade:
// Feed Re-ranking V2
// Dynamic Diversity Penalties
// Exploration Injection