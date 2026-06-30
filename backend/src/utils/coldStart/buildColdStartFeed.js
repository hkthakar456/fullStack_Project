//=============================================================================================================//
// Build Cold Start Feed
//
// Purpose:
//
// Generate a complete cold start
// recommendation feed by orchestrating
// all cold start utilities.
//
// Workflow:
//
// Videos
//      ↓
// Video Metrics
//      ↓
// Candidate Pools
//      ↓
// Feed Slot Allocation
//      ↓
// Feed Assembly
//      ↓
// Feed Diversification
//      ↓
// Final Feed
//
//=============================================================================================================//

import { buildVideoMetrics } from "./Metrics Layer/buildVideoMetrics.js";

import { buildTrendingCandidatePool } from "./Candidate Layer/buildTrendingCandidatePool.js";
import { buildRecentCandidatePool } from "./Candidate Layer/buildRecentCandidatePool.js";
import { buildEngagementCandidatePool } from "./Candidate Layer/buildEngagementCandidatePool.js";
import { buildCategoryCandidates } from "./Candidate Layer/buildCategoryCandidates.js";
import { buildDiscoveryCandidatePool } from "./Candidate Layer/buildDiscoveryCandidatePool.js";
import { assembleCategoryPool } from "./Candidate Layer/assembleCategoryPool.js";
import { groupVideosByCategory } from "./Candidate Layer/groupVideosByCategory.js";

import { calculateFeedSlots } from "./Assembly Layer/calculateFeedSlots.js";
import { assembleColdStartFeed } from "./Assembly Layer/assembleColdStartFeed.js";

import { applyFeedDiversification } from "./Diversification Layer/applyFeedDiversification.js";

import {
    DEFAULT_RECOMMENDATION_BATCH_SIZE,
} from "../../constants/recommendation.constants.js";

const buildColdStartFeed = ({videos, feedSize = DEFAULT_RECOMMENDATION_BATCH_SIZE}) => {

    //=========================================================================================================//
    // Build Video Metrics
    //=========================================================================================================//

    const videoMetrics = buildVideoMetrics(videos);

    //=========================================================================================================//
    // Build Candidate Pools
    //=========================================================================================================//

    const candidatePools = {

        trending:
            buildTrendingCandidatePool(videoMetrics),

        recent:
            buildRecentCandidatePool(videoMetrics),

        engagement:
            buildEngagementCandidatePool(videoMetrics),

        category:
            assembleCategoryPool(
                buildCategoryCandidates(
                    groupVideosByCategory(videoMetrics)
                )
            ),

        discovery:
            buildDiscoveryCandidatePool(videoMetrics),
    };

    //=========================================================================================================//
    // Calculate Feed Slots
    //=========================================================================================================//

    const feedSlots = calculateFeedSlots({
        candidatePools,
        feedSize,
    });

    //=========================================================================================================//
    // Assemble Feed
    //=========================================================================================================//

    const assembledFeed = assembleColdStartFeed({
        candidatePools,
        feedSlots,
    });

    //=========================================================================================================//
    // Apply Diversification
    //=========================================================================================================//

    const diversifiedFeed = applyFeedDiversification({
        assembledFeed,
        feedSize,
    });

    //=========================================================================================================//
    // Return Feed
    //=========================================================================================================//

    return diversifiedFeed;
};

export { buildColdStartFeed };