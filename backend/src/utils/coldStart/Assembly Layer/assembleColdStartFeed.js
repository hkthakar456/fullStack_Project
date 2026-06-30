//=============================================================================================================//
// Assemble Cold Start Feed
//
// Purpose:
//
// Assemble the final cold
// start feed using candidate
// pools and calculated slots.
//
// Strategy:
//
// 1. Create cold start feed
// 2. Create unique video tracker
// 3. Process each candidate pool
// 4. Fill allocated slots
// 5. Return cold start feed
//
// Rules:
//
// 1. No database query
// 2. No ranking
// 3. No score calculation
// 4. No creator diversification
// 5. Preserve pool priority
// 6. Prevent duplicate videos
//
//=============================================================================================================//

export const assembleColdStartFeed = ({
    candidatePools,

    feedSlots,
}) => {
    // Steps (Algorithm)

    // 1. Create cold start feed
    // 2. Create unique video tracker
    // 3. Process each candidate pool
    // 4. Fill allocated slots
    // 5. Return cold start feed

    //=========================================================================================================//

    // 1. Create Cold Start Feed

    const coldStartFeed = [];

    //=========================================================================================================//

    // 2. Create Unique Video Tracker

    const addedVideoIds = new Set();

    //=========================================================================================================//

    // 3. Process Each Candidate Pool

    Object.entries(feedSlots).forEach(([poolName, slotCount]) => {
        const pool = candidatePools[poolName] || [];

        let selectedVideos = 0;

        //=================================================================================================//

        // 4. Fill Allocated Slots

        for (const candidate of pool) {
            if (selectedVideos >= slotCount) {
                break;
            }

            if (addedVideoIds.has(candidate.videoId)) {
                continue;
            }

            addedVideoIds.add(candidate.videoId);

            coldStartFeed.push(candidate);

            selectedVideos++;
        }
    });

    //=========================================================================================================//

    // 5. Return Cold Start Feed

    return coldStartFeed;
};
