//=============================================================================================================//

// Steps

// 1. TAG SCORE
// 2. CATEGORY SCORE
// 3. CREATOR AFFINITY SCORE
// 4. ENGAGEMENT SCORE
// 5. POPULARITY SCORE
// 6. return Responce

const calculateRecommendationScore = (
    video,
    userProfile,
    creatorAffinity,
    likeProfile,
    searchClickProfile,
    followedCreatorsList
) => {
    //=============================================================================================================//

    let totalScore = 0;

    //=============================================================================================================//

    // 1. TAG SCORE (35%)

    let tagScore = 0;

    video.tags.forEach((tag) => {
        const normalizedTag = tag.toLowerCase();

        tagScore += userProfile.tagScores[normalizedTag] || 0;
    });

    totalScore += tagScore * 0.20;

    //=============================================================================================================//

    // 2. CATEGORY SCORE (15%)

    const categoryScore = userProfile.categoryScores[video.category?.toLowerCase()] || 0;

    totalScore += categoryScore * 0.10;

    //=============================================================================================================//

    // 3. CREATOR AFFINITY SCORE (30%)

    const creatorId = video.owner._id.toString();

    const originalCreatorScore = creatorAffinity[creatorId] || 0;

    let creatorScore = originalCreatorScore;

    totalScore += creatorScore * 0.15;

    //=============================================================================================================//
    
    // FOLLOW BOOST

    // Increase creator affinity contribution when the user follows the creator.
    
    //=============================================================================================================//

    const isFollowed = followedCreatorsList.has(creatorId);

    const followBonus = isFollowed ? creatorScore * 0.08 : 0;

    totalScore += followBonus;

    //=============================================================================================================//

    // 4. ENGAGEMENT SCORE (10%)

    let engagementScore = 0;

    if (video.views > 0) {
        engagementScore = ((video.likesCount || 0) / video.views) * 10;
    }

    totalScore += engagementScore * 0.04;

    //=============================================================================================================//

    // 5. POPULARITY SCORE (10%)

    const popularityScore = (video.views || 0) / 100;

    totalScore += popularityScore * 0.01;
    //=============================================================================================================//

    // 6. Like Tag Score

    let likeTagScore = 0;

    let matchedTags = 0;

    video.tags.forEach((tag) => {
        const normalizedTag = tag.toLowerCase();

        if (likeProfile.tagScores[normalizedTag]) {
            likeTagScore += likeProfile.tagScores[normalizedTag];

            matchedTags++;
        }
    });

    if (matchedTags > 0) {
        likeTagScore = likeTagScore / matchedTags;
    }

    totalScore += likeTagScore * 0.15;

    //=============================================================================================================//

    // 7. Like Category Score

    const likeCategoryScore = likeProfile.categoryScores[video.category?.toLowerCase()] || 0;

    totalScore += likeCategoryScore * 0.10;

    //=============================================================================================================//

    // 8. Search Tag Score

    let searchTagScore = 0;

    let matchedSearchTags = 0;

    video.tags.forEach((tag) => {
        const normalizedTag = tag.toLowerCase();

        if (searchClickProfile.tagScores[normalizedTag]) {
            searchTagScore += searchClickProfile.tagScores[normalizedTag];

            matchedSearchTags++;
        }
    });

    if (matchedSearchTags > 0) {
        searchTagScore = searchTagScore / matchedSearchTags;
    }

    totalScore += searchTagScore * 0.07;

    //=============================================================================================================//

    // 9. Search Category Score

    const searchCategoryScore = searchClickProfile.categoryScores[video.category?.toLowerCase()] || 0;

    totalScore += searchCategoryScore * 0.04;

    //=============================================================================================================//

    // 10. Search Creator Score

    const searchCreatorScore = searchClickProfile.creatorScores[creatorId] || 0;

    totalScore += searchCreatorScore * 0.04;

    //=============================================================================================================//

    // 8. Recency Score

    const ageInDays =
        (Date.now() - new Date(video.createdAt)) / (1000 * 60 * 60 * 24);

    let recencyScore = 0;

    if (ageInDays <= 1) {
        recencyScore = 100;
    } else if (ageInDays <= 7) {
        recencyScore = 80;
    } else if (ageInDays <= 30) {
        recencyScore = 60;
    } else if (ageInDays <= 90) {
        recencyScore = 40;
    } else if (ageInDays <= 180) {
        recencyScore = 20;
    } else {
        recencyScore = 5;
    }

    totalScore += recencyScore * 0.01;

    //=============================================================================================================//

    // 6. return Responce

    return {
        totalScore: Number(totalScore.toFixed(2)),

        breakdown: {
            tagScore: Number(tagScore.toFixed(2)),

            categoryScore: Number(categoryScore.toFixed(2)),

            creatorScore: Number(originalCreatorScore.toFixed(2)),

            followBonus: Number(followBonus.toFixed(2)),

            likeTagScore: Number(likeTagScore.toFixed(2)),

            likeCategoryScore: Number(likeCategoryScore.toFixed(2)),

            engagementScore: Number(engagementScore.toFixed(2)),

            popularityScore: Number(popularityScore.toFixed(2)),

            searchTagScore: Number(searchTagScore.toFixed(2)),

            searchCategoryScore: Number(searchCategoryScore.toFixed(2)),

            searchCreatorScore: Number(searchCreatorScore.toFixed(2)),

            recencyScore: Number(recencyScore.toFixed(2)),
        },
    };
};

//=============================================================================================================//

export { calculateRecommendationScore };
