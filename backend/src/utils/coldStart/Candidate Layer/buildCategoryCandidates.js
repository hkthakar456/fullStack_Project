//=============================================================================================================//
// Build Category Candidate Pools
//
// Purpose:
//
// Build candidate pool for
// every category.
//
// Strategy:
//
// 1. Create category candidate pools
// 2. Build candidate pool for each category
// 3. Return category candidate pools
//
// Rules:
//
// 1. No database query
// 2. No hardcoded categories
// 3. Support unlimited categories
// 4. Reuse buildCandidatePool()
//
//=============================================================================================================//

import { buildCandidatePool } from "./buildCandidatePool.js";

import {COLD_START_WEIGHTS, COLD_START_CANDIDATE_POOL_SIZE} from "../../../constants/recommendation.constants.js";

export const buildCategoryCandidates = (categoryMap) => {

    // Steps (Algorithm)

    // 1. Create category candidate pools
    // 2. Build candidate pool for each category
    // 3. Return category candidate pools

    //=========================================================================================================//

    // 1. Create Category Candidate Pools

    const categoryCandidates = {};

    //=========================================================================================================//

    // 2. Build Candidate Pool For Each Category

    Object.entries(categoryMap).forEach(([category, categoryVideos]) => {
        categoryCandidates[category] = buildCandidatePool({
            videoMetrics: categoryVideos,

            rankingConfig: [
                {
                    metric: "views",
                    rankProperty: "popularityRank",
                    order: "desc",
                },

                {
                    metric: "engagementRate",
                    rankProperty: "engagementRank",
                    order: "desc",
                },

                {
                    metric: "ageInDays",
                    rankProperty: "recencyRank",
                    order: "asc",
                },
            ],

            weights: COLD_START_WEIGHTS.CATEGORY,

            scoreProperty: "categoryScore",

            candidatePoolSize: COLD_START_CANDIDATE_POOL_SIZE.CATEGORY,
        });
    });

    //=========================================================================================================//

    // 3. Return Category Candidate Pools

    return categoryCandidates;
};
