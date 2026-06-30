import { Follow } from "../../../models/follow.model.js";

//=============================================================================================================//

// Steps
//
// 1. Get Follow Records
// 2. Extract Creator IDs
// 3. Convert To Set
// 4. Return Result

//=============================================================================================================//

const getFollowedCreators = async (userId) => {

    // 1. Get Follow Records

    const follows = await Follow.find({
        follower: userId,
    });

    //=============================================================================================================//

    // 2. Extract Creator IDs

    const creatorIds = follows.map((follow) => follow.creator.toString());

    //=============================================================================================================//

    // 3. Convert To Set

    const followedCreators = new Set(creatorIds);

    //=============================================================================================================//

    // 4. Return Result

    return followedCreators;
};

export { getFollowedCreators };
