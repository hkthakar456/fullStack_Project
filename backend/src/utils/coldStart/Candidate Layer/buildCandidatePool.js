//=============================================================================================================//
// Build Candidate Pool
//
// Purpose:
//
// Generate candidate pool using
// ranking configuration, score weights,
// and candidate pool size.
//
// Strategy:
//
// 1. Validate inputs
// 2. Build metric ranks
// 3. Calculate candidate score
// 4. Sort by candidate score
// 5. Select candidate pool
// 6. Return candidate pool
//
// Rules:
//
// 1. Dynamic ranking configuration
// 2. Dynamic score weights
// 3. Dynamic score property
// 4. Dynamic candidate pool size
// 5. Return Candidate Pool only
//
//=============================================================================================================//

import { buildRanks } from "../Metrics Layer/buildRanks.js";

import { calculateRankScore } from "../Metrics Layer/calculateRankScore.js";

export const buildCandidatePool = ({videoMetrics, rankingConfig, weights, scoreProperty, candidatePoolSize,}) => {

    // Steps (Algorithm)

    // 1. Validate inputs
    // 2. Build metric ranks
    // 3. Calculate candidate score
    // 4. Sort by candidate score
    // 5. Select candidate pool
    // 6. Return candidate pool

    //=========================================================================================================//

    // 1. Validate Inputs

    if (!Array.isArray(videoMetrics)) {
        throw new Error("videoMetrics must be an array");
    }

    if (!Array.isArray(rankingConfig)) {
        throw new Error("rankingConfig must be an array");
    }

    if (!weights || typeof weights !== "object") {
        throw new Error("weights must be an object");
    }

    if (!scoreProperty) {
        throw new Error("scoreProperty is required");
    }

    if (
        typeof candidatePoolSize !== "number" ||
        candidatePoolSize <= 0 ||
        candidatePoolSize > 1
    ) {
        throw new Error("candidatePoolSize must be a number between 0 and 1");
    }

    //=========================================================================================================//

    // 2. Build Metric Ranks

    const rankedVideos = buildRanks(videoMetrics, rankingConfig);

    //=========================================================================================================//

    // 3. Calculate Candidate Score

    const scoredVideos = calculateRankScore(rankedVideos, weights, scoreProperty);

    //=========================================================================================================//

    // 4. Sort By Candidate Score

    scoredVideos.sort((a, b) => b[scoreProperty] - a[scoreProperty]);

    //=========================================================================================================//

    // 5. Select Candidate Pool

    const candidateCount = Math.max(1, Math.ceil(scoredVideos.length * candidatePoolSize));

    const candidatePool = scoredVideos.slice(0, candidateCount);

    //=========================================================================================================//

    // 6. Return Candidate Pool

    return candidatePool;
};
