//=============================================================================================================//
// Build Trending Candidate Pool
//
// Purpose:
//
// Build trending candidate pool
// using the generic candidate
// pool builder.
//
// Strategy:
//
// 1. Build ranking configuration
// 2. Build candidate pool
// 3. Return trending candidate pool
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

export const buildTrendingCandidatePool = (videoMetrics) => {

    // Steps (Algorithm)

    // 1. Build ranking configuration
    // 2. Build candidate pool
    // 3. Return trending candidate pool

    //=========================================================================================================//

    // 1. Build Ranking Configuration

    const rankingConfig = [

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
    ];

    //=========================================================================================================//

    // 2. Build Candidate Pool

    const trendingCandidatePool = buildCandidatePool({

        videoMetrics,

        rankingConfig,

        weights: COLD_START_WEIGHTS.TRENDING,

        scoreProperty: "trendingScore",

        candidatePoolSize:
            COLD_START_CANDIDATE_POOL_SIZE.TRENDING,
    });

    //=========================================================================================================//

    // 3. Return Trending Candidate Pool

    return trendingCandidatePool;
};