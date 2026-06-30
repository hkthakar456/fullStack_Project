//=============================================================================================================//
// Build Engagement Candidate Pool
//
// Purpose:
//
// Build engagement candidate pool
// using the generic candidate
// pool builder.
//
// Strategy:
//
// 1. Build ranking configuration
// 2. Build candidate pool
// 3. Return engagement candidate pool
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

export const buildEngagementCandidatePool = (videoMetrics) => {

    // Steps (Algorithm)

    // 1. Build ranking configuration
    // 2. Build candidate pool
    // 3. Return engagement candidate pool

    //=========================================================================================================//

    // 1. Build Ranking Configuration

    const rankingConfig = [

        {

            metric: "engagementRate",

            rankProperty: "engagementRank",

            order: "desc",
        },

        {

            metric: "views",

            rankProperty: "popularityRank",

            order: "desc",
        },
    ];

    //=========================================================================================================//

    // 2. Build Candidate Pool

    const engagementCandidatePool = buildCandidatePool({

        videoMetrics,

        rankingConfig,

        weights: COLD_START_WEIGHTS.ENGAGEMENT,

        scoreProperty: "engagementScore",

        candidatePoolSize:
            COLD_START_CANDIDATE_POOL_SIZE.ENGAGEMENT,
    });

    //=========================================================================================================//

    // 3. Return Engagement Candidate Pool

    return engagementCandidatePool;
};