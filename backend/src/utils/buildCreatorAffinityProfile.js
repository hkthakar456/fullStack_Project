import { User } from "../models/user.model.js";

//=============================================================================================================//

// Steps



const buildCreatorAffinityProfile = async (userId) => {

//=============================================================================================================//

// 1. Fetch user's watch history with video details (owner)

    const user = await User.findById(
        userId
    ).populate({

        path: "watchHistory.video",

        select: "owner"
    });

//=============================================================================================================//

// 2. Calculate affinity scores for creators based on watch duration and completion
    const creatorScores = {};

    const creatorVideoCount = {};

//=============================================================================================================//

// Process every watched video

    user.watchHistory.forEach((history) => {

        const video = history.video;

        if (!video) return;

        //=========================================================================================================//

        const creatorId = video.owner.toString();

        //=========================================================================================================//

        const weight = history.watchPercentage / 10;

        //=========================================================================================================//

        creatorScores[creatorId] = (creatorScores[creatorId] || 0) + weight;

        //=========================================================================================================//

        creatorVideoCount[creatorId] =(creatorVideoCount[creatorId] || 0) + 1;
    });

//=============================================================================================================//

// 3. Normalize scores by the number of videos watched from each creator to get an average affinity score
    
    Object.keys(creatorScores).forEach((creatorId) => {
        creatorScores[creatorId] = Number((creatorScores[creatorId] / creatorVideoCount[creatorId]).toFixed(2));
    }); // This gives us an average affinity score for each creator based on the user's watch history

//=============================================================================================================//

// 4. Return the affinity profile

    return creatorScores;
};

//=============================================================================================================//

export {
    buildCreatorAffinityProfile
};