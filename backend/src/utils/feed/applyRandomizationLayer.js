//=============================================================================================================//

// Randomization Layer
//
// Purpose:
//
// 1. Prevent identical feed on every refresh
// 2. Keep best recommendations stable
// 3. Shuffle lower ranked recommendations
//
// Strategy:
//
// Top 5 Videos    -> Fixed
// Remaining Videos -> Randomized

//=============================================================================================================//

const applyRandomizationLayer = (diversifiedFeed) => {

    // Configuration

    const FIXED_TOP_VIDEOS = 5;

    // Get top videos that should remain fixed

    const fixedVideos = diversifiedFeed.slice(0, FIXED_TOP_VIDEOS);


    // Get remaining videos

    const remainingVideos = diversifiedFeed.slice(FIXED_TOP_VIDEOS);

    // Shuffle remaining videos
    // Fisher-Yates Shuffle Algorithm

    for (let i = remainingVideos.length - 1; i > 0;i--) {

        const randomIndex = Math.floor(Math.random() * (i + 1));

        [remainingVideos[i], remainingVideos[randomIndex]] = [remainingVideos[randomIndex], remainingVideos[i]];

    }

    // Combine fixed videos and shuffled videos

    const randomizedFeed = [...fixedVideos, ...remainingVideos];

//=============================================================================================================//

    // Return final feed

    return randomizedFeed;

//=============================================================================================================//

};

export {

    applyRandomizationLayer
};