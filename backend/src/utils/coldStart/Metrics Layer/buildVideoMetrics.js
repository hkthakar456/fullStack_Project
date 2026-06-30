//=============================================================================================================//
// Build Video Metrics
//
// Purpose:
//
// Generate reusable video metrics
// for every published video.
//
// Strategy:
//
// 1. Extract Raw Metrics
// 2. Calculate Derived Metrics
// 3. Return Video Metrics
//
// Rules:
//
// 1. No recommendation scoring
// 2. No ranking
// 3. No normalization
// 4. No user behavior
//
//=============================================================================================================//

export const buildVideoMetrics = (videos) => {

    // Steps (Algorithm)

    // 1. Extract raw metrics
    // 2. Calculate derived metrics
    // 3. Return video metrics

    //=========================================================================================================//

    // 1. Extract Raw Metrics

    const videoMetrics = videos.map((video) => {

        const views = video.views || 0;

        const videoId = video._id.toString();

        const likes = video.likesCount || 0;

        const comments = video.commentsCount || 0;

        const createdAt = video.createdAt;

        const creatorId = video.owner._id.toString();

        const category = video.category.trim().toLowerCase();
        
        const tags = video.tags || [];

        //=====================================================================================================//

        // 2. Calculate Derived Metrics

        const ageInDays = Math.floor((Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24));

        let engagementRate = 0;

        if (views > 0) {
            engagementRate = Number((((likes + comments) / views) * 100).toFixed(2));
        }

        //=====================================================================================================//

        // 3. Return Video Metrics

        return {

            video,

            videoId,

            //=================================================================================================//
            // Raw Metrics
            //=================================================================================================//

            views,

            likes,

            comments,

            createdAt,

            creatorId,

            category,

            tags,

            //=================================================================================================//
            // Derived Metrics
            //=================================================================================================//

            ageInDays,

            engagementRate,
        };
    });

    //=========================================================================================================//

    return videoMetrics;
    
};