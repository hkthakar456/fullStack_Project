//=============================================================================================================//
// Build Recent Candidate Pool
//
// Purpose:
//
// Build recent candidate pool
// using the generic candidate
// pool builder.
//
// Strategy:
//
// 1. Build ranking configuration
// 2. Build candidate pool
// 3. Return recent candidate pool
//
// Rules:
//
// 1. No database query
// 2. No ranking calculation
// 3. No score calculation
// 4. Only provide configuration
//
//=============================================================================================================//

import { buildCandidatePool } from "./buildCandidatePool.js";

import {COLD_START_WEIGHTS, COLD_START_CANDIDATE_POOL_SIZE} from "../../../constants/recommendation.constants.js";

export const buildRecentCandidatePool = (videoMetrics) => {
    // Steps (Algorithm)

    // 1. Build ranking configuration
    // 2. Build candidate pool
    // 3. Return recent candidate pool

    //=========================================================================================================//

    // 1. Build Ranking Configuration

    const rankingConfig = [
        {
            metric: "ageInDays",

            rankProperty: "recencyRank",

            order: "asc",
        },

        {
            metric: "views",

            rankProperty: "popularityRank",

            order: "desc",
        },
    ];

    //=========================================================================================================//

    // 2. Build Candidate Pool

    const recentCandidatePool = buildCandidatePool({
        videoMetrics,

        rankingConfig,

        weights: COLD_START_WEIGHTS.RECENT,

        scoreProperty: "recentScore",

        candidatePoolSize: COLD_START_CANDIDATE_POOL_SIZE.RECENT,
    });

    //=========================================================================================================//

    // 3. Return Recent Candidate Pool

    return recentCandidatePool;
};
