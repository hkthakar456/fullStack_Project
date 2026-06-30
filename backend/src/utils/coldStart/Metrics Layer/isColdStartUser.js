//=============================================================================================================//
// Detect Cold Start User
//
// Purpose:
//
// Identify users with insufficient
// behavioral data.
//
//=============================================================================================================//

export const isColdStartUser = (user) => {

    // Steps (Algorithm)

    // 1. Get watch history count
    // 2. Get like history count
    // 3. Get search click count
    // 4. calculate Confidence Score
    // 5. Check thresholds
    // 6. Return result

    //=========================================================================================================//

    // 1. Get watch history count

    const watchCount = user.watchHistory?.length || 0;

    //=========================================================================================================//

    // 2. Get like history count

    const likeCount = user.likeHistory?.length || 0;

    //=========================================================================================================//

    // 3. Get search click count

    const searchClickCount = user.searchClickHistory?.length || 0;

    //=========================================================================================================//

    // 4. calculate Confidence Score

    const confidenceScore = watchCount * 6 + likeCount * 2 + searchClickCount * 2;

    //=========================================================================================================//

    // 5. Check thresholds

    if (confidenceScore < 25 ) 
    {
        return true;
    }

    //=========================================================================================================//

    // 6. Return result

    return false;
};