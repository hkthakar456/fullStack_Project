//=============================================================================================================//
// Build Discovery Candidate Pool
//
// Purpose:
//
// Build discovery candidate pool
// using the generic candidate
// pool builder.
//
// Strategy:
//
// 1. Build ranking configuration
// 2. Build candidate pool
// 3. Return discovery candidate pool
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

export const buildDiscoveryCandidatePool = (videoMetrics) => {
    const rankingConfig = [
        {
            metric: "ageInDays",

            rankProperty: "recencyRank",

            order: "asc",
        },

        {
            metric: "engagementRate",

            rankProperty: "engagementRank",

            order: "desc",
        },

        {
            metric: "views",

            rankProperty: "discoveryRank",

            order: "asc",
        },
    ];

    return buildCandidatePool({
        videoMetrics,

        rankingConfig,

        weights: COLD_START_WEIGHTS.DISCOVERY,

        scoreProperty: "discoveryScore",

        candidatePoolSize: COLD_START_CANDIDATE_POOL_SIZE.DISCOVERY,
    });
};
