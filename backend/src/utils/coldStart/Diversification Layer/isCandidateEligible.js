//=============================================================================================================//
// Is Candidate Eligible
//
// Purpose:
//
// Check whether candidate creator
// appeared recently in the feed.
//
// Strategy:
//
// 1. Check recent creators
// 2. Return eligibility result
//
// Rules:
//
// 1. No database query
// 2. No ranking calculation
// 3. No score calculation
//
//=============================================================================================================//

export const isCandidateEligible = ({candidate, recentCreators}) => {
    // Steps (Algorithm)

    // 1. Check Recent Creators
    // 2. Return Eligibility Result

    //=========================================================================================================//

    // 1. Check Recent Creators

    const creatorAlreadyExists = recentCreators.includes(candidate.creatorId);

    //=========================================================================================================//

    // 2. Return Eligibility Result

    return !creatorAlreadyExists;
};
