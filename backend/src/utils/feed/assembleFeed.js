// Create final homepage feed.
//
// Combine:
//
// 1. Personalized Videos
// 2. Related Videos
// 3. Exploration Videos

// Into:

// Single Mixed Feed

// Rules
//
// 1. Personalized Weight = 50
//
// 2. Related Weight = 33
//
// 3. Exploration Weight = 17
//
// 4. Maximum Personalized Streak = 4
//
// 5. Maximum Related Streak = 2
//
// 6. Maximum Exploration Streak = 1
//
//=============================================================================================================//

const assembleFeed = ({personalizedVideos, relatedVideos, explorationVideos,}) => {

    // Steps (Algorithm)

    // 1. Create final feed
    // 2. Clone all pools
    // 3. Create streak trackers
    // 4. Continue until all pools become empty
    // 5. Create weighted selection pool
    // 6. Apply personalized rules
    // 7. Apply related rules
    // 8. Apply exploration rules
    // 9. Select random source pool
    // 10. Add selected video to feed
    // 11. Update streak counters
    // 12. Repeat until all pools become empty
    // 13. Return final feed

    //=============================================================================================================//

    // 1. Create final feed

    const finalFeed = [];

    //=============================================================================================================//

    // 2. Clone all pools

    const personalizedPool = [...personalizedVideos];

    const relatedPool = [...relatedVideos];

    const explorationPool = [...explorationVideos];

    //=============================================================================================================//

    // 3. Create streak trackers

    let personalizedStreak = 0;

    let relatedStreak = 0;

    let explorationStreak = 0;

    //=============================================================================================================//

    // 4. Continue until all pools become empty

    while (personalizedPool.length || relatedPool.length || explorationPool.length) 
        {

        // 5. Create weighted selection pool

        const weightedPool = [];

        //=====================================================================================================//

        // 6. Apply personalized rules

        if (personalizedPool.length > 0 && personalizedStreak < 4) {
            weightedPool.push(...Array(60).fill("personalized"));
        }

        //=====================================================================================================//

        // 7. Apply related rules

        if (relatedPool.length > 0 && relatedStreak < 2) {
            weightedPool.push(...Array(25).fill("related"));
        }

        //=====================================================================================================//

        // 8. Apply exploration rules

        if (explorationPool.length > 0 && explorationStreak < 1) {
            weightedPool.push(...Array(15).fill("exploration"));
        }

        //=====================================================================================================//

        // Emergency fallback
        //
        // If all streak limits are reached,
        // reset streak counters and continue

        if (!weightedPool.length) {
            personalizedStreak = 0;

            relatedStreak = 0;

            explorationStreak = 0;

            continue;
        }

        //=====================================================================================================//

        // 9. Select random source pool

        const selectedPool = weightedPool[Math.floor(Math.random() * weightedPool.length)];

        //=====================================================================================================//

        // 10. Add selected video to feed

        if (selectedPool === "personalized") {
            const selectedVideo = personalizedPool.shift();

            finalFeed.push({...selectedVideo, feedSource: "personalized",});

            //=================================================================================================//

            // 11. Update streak counters

            personalizedStreak++;

            relatedStreak = 0;

            explorationStreak = 0;
        }

        //=====================================================================================================//
        else if (selectedPool === "related") {
            const selectedVideo = relatedPool.shift();

            finalFeed.push({...selectedVideo, feedSource: "related",});

            //=================================================================================================//

            // 11. Update streak counters

            relatedStreak++;

            personalizedStreak = 0;

            explorationStreak = 0;
        }

        //=====================================================================================================//
        else {
            const selectedVideo = explorationPool.shift();

            finalFeed.push({...selectedVideo, feedSource: "explorationck",});

            //=================================================================================================//

            // 11. Update streak counters

            explorationStreak++;

            personalizedStreak = 0;

            relatedStreak = 0;
        }
    }






    //=============================================================================================================//

// Debug Logs

console.log(
    "Final Feed Length:",
    finalFeed.length
);

console.log(

    finalFeed.map((item) => ({

        title: item.video.title,

        category: item.video.category,
    }))
);

//=============================================================================================================//






    //=============================================================================================================//

    // 13. Return final feed

    return finalFeed;
};

//=============================================================================================================//

export { assembleFeed };
