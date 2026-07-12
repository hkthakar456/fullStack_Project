const COLD_START_WEIGHTS = {
    TRENDING: {
        popularityRank: 0.5,

        engagementRank: 0.3,

        recencyRank: 0.2,
    },

    RECENT: {
        recencyRank: 0.8,

        popularityRank: 0.2,
    },

    ENGAGEMENT: {
        engagementRank: 0.8,

        popularityRank: 0.2,
    },

    CATEGORY: {
        popularityRank: 0.4,

        engagementRank: 0.4,

        recencyRank: 0.2,
    },
    DISCOVERY: {
        recencyRank: 0.4,

        engagementRank: 0.4,

        discoveryRank: 0.20,
    }
};

const COLD_START_CANDIDATE_POOL_SIZE = {

    TRENDING: 0.40,

    RECENT: 0.35,

    ENGAGEMENT: 0.30,

    CATEGORY: 0.30,

    DISCOVERY: 0.20,
};

const COLD_START_FEED_PROPORTIONS = {

    TRENDING: 0.30,

    RECENT: 0.25,

    ENGAGEMENT: 0.20,

    CATEGORY: 0.15,

    DISCOVERY: 0.10,
};

const DEFAULT_RECOMMENDATION_BATCH_SIZE = 100;

const FEED_DIVERSIFICATION = {

    TARGET_MAX_CREATOR_PERCENTAGE: 0.10,

    RELAXATION_STEP: 0.05,

    ABSOLUTE_MAX_CREATOR_PERCENTAGE: 0.30,

    LOOK_AHEAD_WINDOW: 5,

    MAX_CONSECUTIVE_CREATOR_VIDEOS: 1,

    PRESERVE_RELATIVE_ORDER: true,
}

export {
    COLD_START_WEIGHTS,
    COLD_START_CANDIDATE_POOL_SIZE,
    COLD_START_FEED_PROPORTIONS,
    DEFAULT_RECOMMENDATION_BATCH_SIZE,
    FEED_DIVERSIFICATION,

}


//=============================================================================================================//
// TODO (Phase 18)
//
// Search Trend Intelligence
//
// Purpose:
//
// Improve recommendation quality by
// incorporating search trend signals
// into both Cold Start and Personalized
// recommendation systems.
//
// Features:
//
// 1. Track every successful search.
// 2. Store search frequency by keyword/tag/category.
// 3. Maintain rolling time windows
//    (1 hour, 24 hours, 7 days).
// 4. Detect rapidly increasing search topics.
// 5. Generate Search Trend Score.
// 6. Boost videos matching trending
//    searches before they accumulate
//    views or likes.
//
// Example:
//
// Earthquake in Japan
//
// ↓
//
// Searches increase rapidly
//
// ↓
//
// Videos tagged:
// "Japan", "Earthquake", "Breaking News"
//
// ↓
//
// Search Trend Boost
//
// Future Usage:
//
// ✓ Discovery Candidate Pool
// ✓ Cold Start Feed
// ✓ Personalized Feed
// ✓ Trending Page
// ✓ Search Suggestions
//
//
//
// Search:
// "earthquake japan"
//
//  ↓
//
// Extract topics
//
//  ↓
//
// Tags:
// earthquake
// japan
// breaking-news
//
//  ↓
//
// Categories:
// News
//
// ↓ 
//
// Boost matching videos
//=============================================================================================================//