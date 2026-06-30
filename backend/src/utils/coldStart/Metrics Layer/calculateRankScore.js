//=============================================================================================================//
// Merge Ranks
//
// Purpose:
//
// Merge multiple ranking metrics into
// one weighted score.
//
// Strategy:
//
// 1. Validate weights
// 2. Calculate weighted score
// 3. Add score property
// 4. Return updated videos
//
// Rules:
//
// 1. No sorting
// 2. No ranking
// 3. Preserve existing object
// 4. Dynamic weights
//
//=============================================================================================================//

export const calculateRankScore = (rankedVideos, weights, scoreProperty) => {

    // Steps (Algorithm)

    // 1. Validate inputs
    // 2. Calculate weighted score
    // 3. Add score property
    // 4. Return updated videos

    //=========================================================================================================//

    // 1. Validate Inputs

    if (!Array.isArray(rankedVideos)) {
        throw new Error("rankedVideos must be an array");
    }

    if (!weights || typeof weights !== "object") {
        throw new Error("weights must be an object");
    }

    //=========================================================================================================//

    // 2. Calculate Weighted Score

    const updatedVideos = rankedVideos.map((item) => {
        
        let score = 0;

        Object.entries(weights).forEach(([rankProperty, weight]) => {
            if (!(rankProperty in item)) {
                throw new Error(`Missing rank property: ${rankProperty}`);
            }

            score += item[rankProperty] * weight;
        });

        //=====================================================================================================//

        // 3. Add Score Property

        return {
            ...item,

            [scoreProperty]: Number(score.toFixed(2)),
        };
    });

    //=========================================================================================================//

    // 4. Return Updated Videos

    return updatedVideos;
};
