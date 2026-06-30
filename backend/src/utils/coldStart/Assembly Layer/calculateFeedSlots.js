//=============================================================================================================//
// Calculate Feed Slots
//
// Purpose:
//
// Calculate feed slots for each
// candidate pool while preserving
// proportions and redistributing
// shortages.
//
//=============================================================================================================//

import {COLD_START_FEED_PROPORTIONS, DEFAULT_RECOMMENDATION_BATCH_SIZE} from "../../../constants/recommendation.constants.js";

export const calculateFeedSlots = ({candidatePools, feedSize = DEFAULT_RECOMMENDATION_BATCH_SIZE}) => {

    // Steps (Algorithm)

    // 1. Calculate Initial Slots
    // 2. Apply Availability Limits
    // 3. Redistribute Shortage
    // 4. Return Slots

    //=========================================================================================================//

    // 1. Calculate Initial Slots

    const slots = {};

    let allocatedSlots = 0;

    Object.entries(COLD_START_FEED_PROPORTIONS).forEach(
        ([poolName, proportion]) => {
            const slotCount = Math.floor(feedSize * proportion);

            slots[poolName.toLowerCase()] = slotCount;

            allocatedSlots += slotCount;
        }
    );

    // Assign remaining slots caused by rounding

    let remainingSlots = feedSize - allocatedSlots;

    while (remainingSlots > 0) {
        for (const poolName of Object.keys(slots)) {
            slots[poolName]++;

            remainingSlots--;

            if (remainingSlots === 0) break;
        }
    }

    //=========================================================================================================//

    // 2. Apply Availability Limits

    let shortage = 0;

    Object.entries(slots).forEach(([poolName, slotCount]) => {
        const availableVideos = candidatePools[poolName].length;

        if (availableVideos < slotCount) {
            shortage += slotCount - availableVideos;

            slots[poolName] = availableVideos;
        }
    });

    //=========================================================================================================//

    // 3. Redistribute Shortage

    while (shortage > 0) {
        let redistributed = false;

        for (const poolName of Object.keys(slots)) {
            if (slots[poolName] < candidatePools[poolName].length) {
                slots[poolName]++;

                shortage--;

                redistributed = true;

                if (shortage === 0) break;
            }
        }

        if (!redistributed) {
            break;
        }
    }

    //=========================================================================================================//

    // 4. Return Slots

    return slots;
};
