//=============================================================================================================//

// Steps

// 1. TAG SCORE
// 2. CATEGORY SCORE
// 3. CREATOR AFFINITY SCORE
// 4. ENGAGEMENT SCORE
// 5. POPULARITY SCORE
// 6. return Responce

const calculateRecommendationScore = (video, userProfile, creatorAffinity) => {

//=============================================================================================================//

    let totalScore = 0;

//=============================================================================================================//

    // 1. TAG SCORE (35%)

    let tagScore = 0;

    video.tags.forEach((tag) => {

        const normalizedTag = tag.toLowerCase();

        tagScore += userProfile.tagScores[normalizedTag] || 0;
    });

    totalScore += tagScore * 0.35;

//=============================================================================================================//

    // 2. CATEGORY SCORE (15%)

    const categoryScore = userProfile.categoryScores[video.category?.toLowerCase()] || 0;

    totalScore += categoryScore * 0.15;

//=============================================================================================================//

    // 3. CREATOR AFFINITY SCORE (30%)

    const creatorScore = creatorAffinity[video.owner.toString()] || 0;

    totalScore += creatorScore * 0.30;

//=============================================================================================================//

    // 4. ENGAGEMENT SCORE (10%)

    let engagementScore = 0;

    if (video.views > 0) {
        engagementScore = ((video.likesCount || 0) / video.views) * 10;
    }

    totalScore += engagementScore * 0.10;

//=============================================================================================================//

    // 5. POPULARITY SCORE (10%)

    const popularityScore = ((video.views || 0) / 100);

    totalScore += popularityScore * 0.10;

//=============================================================================================================//

    // 6. return Responce

    return {

        totalScore:

            Number(totalScore.toFixed(2)),

        breakdown: {

            tagScore: Number(tagScore.toFixed(2)),

            categoryScore: Number(categoryScore.toFixed(2)),

            creatorScore: Number(creatorScore.toFixed(2)),

            engagementScore: Number(engagementScore.toFixed(2)),

            popularityScore: Number(popularityScore.toFixed(2))
        }
    };
};

//=============================================================================================================//

export {
    calculateRecommendationScore
};