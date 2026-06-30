//=============================================================================================================//
// Apply Feed Diversification
//
// Purpose:
//
// Apply creator diversification
// while preserving recommendation
// quality and creator relative order.
//
// Strategy:
//
// 1. Create diversified feed
// 2. Create recent creators
// 3. Create remaining candidates
// 4. Build diversified feed
// 5. Return diversified feed
//
// Rules:
//
// 1. No database query
// 2. No ranking calculation
// 3. No score calculation
// 4. Preserve creator relative order
// 5. Never duplicate videos
// 6. Never remove videos
// 7. Never change feed size
//
//=============================================================================================================//

import {DEFAULT_RECOMMENDATION_BATCH_SIZE, FEED_DIVERSIFICATION} from "../../../constants/recommendation.constants.js";

import { isCandidateEligible } from "./isCandidateEligible.js";

export const applyFeedDiversification = ({
    assembledFeed,

    feedSize = DEFAULT_RECOMMENDATION_BATCH_SIZE,

    lookAheadWindow = FEED_DIVERSIFICATION.LOOK_AHEAD_WINDOW,
}) => {
    // Steps (Algorithm)

    // 1. Create diversified feed
    // 2. Create recent creators
    // 3. Create remaining candidates
    // 4. Build diversified feed
    // 5. Return diversified feed

    //=========================================================================================================//

    // 1. Create Diversified Feed

    const diversifiedFeed = [];

    //=========================================================================================================//

    // 2. Create Recent Creators

    const recentCreators = [];

    //=========================================================================================================//

    // 3. Create Remaining Candidates

    const remainingCandidates = [...assembledFeed];

    //=========================================================================================================//

    // 4. Build Diversified Feed

    while (remainingCandidates.length > 0 && diversifiedFeed.length < feedSize) 
    {
        //=====================================================================================================//

        // Select Current Candidate

        const currentCandidate = remainingCandidates[0];

        let selectedCandidate = currentCandidate;

        let selectedIndex = 0;

        let alternativeFound = false;

        //=====================================================================================================//

        // Validate Current Candidate

        const currentCandidateEligible = isCandidateEligible({candidate: currentCandidate, recentCreators});

        //=====================================================================================================//

        // Search Local Look-Ahead Window

        if (!currentCandidateEligible) {
            const maximumLookAheadIndex = Math.min(
                lookAheadWindow,

                remainingCandidates.length - 1
            );

            for (
                let lookAheadIndex = 1;
                lookAheadIndex <= maximumLookAheadIndex;
                lookAheadIndex++
            ) {
                const candidate = remainingCandidates[lookAheadIndex];

                const candidateEligible = isCandidateEligible({
                    candidate,

                    recentCreators,
                });

                if (!candidateEligible) {
                    continue;
                }

                selectedCandidate = candidate;

                selectedIndex = lookAheadIndex;

                alternativeFound = true;

                break;
            }
        }

        //=====================================================================================================//

        // Keep Current Candidate
        //
        // If no eligible candidate was found
        // inside the local look-ahead window,
        // continue with the current candidate.

        if (!alternativeFound) {
            selectedCandidate = currentCandidate;

            selectedIndex = 0;
        }

        //=====================================================================================================//

        // Add Selected Candidate To Feed

        diversifiedFeed.push(selectedCandidate);

        //=====================================================================================================//

        // Remove Selected Candidate

        remainingCandidates.splice(
            selectedIndex,

            1
        );

        //=====================================================================================================//

        // Update Recent Creators

        recentCreators.push(selectedCandidate.creatorId);

        // Maintain Recent Creator Window

        while (recentCreators.length > lookAheadWindow) {
            recentCreators.shift();
        }
    }

    //=========================================================================================================//

    // 5. Return Diversified Feed

    return diversifiedFeed;
};
