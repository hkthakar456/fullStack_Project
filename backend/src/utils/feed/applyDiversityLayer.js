//=============================================================================================================//

// Diversity Layer
//
// Purpose:
//
// 1. Prevent creator domination
// 2. Prevent category domination
// 3. Generate diversified feed
// 4. Build feed of maximum 100 videos

//=============================================================================================================//

const applyDiversityLayer = (topVideos) => {

//=============================================================================================================//

    // Configuration

    const MAX_FEED_SIZE = 100;
    const MAX_CREATOR_PERCENTAGE = 0.20;
    const MAX_CATEGORY_PERCENTAGE = 0.30;

//=============================================================================================================//

    // Final feed

    const diversifiedFeed = [];

//=============================================================================================================//

    // Tracking objects

    const creatorCount = {};
    const categoryCount = {};

//=============================================================================================================//


    const maxCreatorVideos = Math.max(
        2,
        Math.floor(topVideos.length * MAX_CREATOR_PERCENTAGE)
    );

    const maxCategoryVideos = Math.max(
        2,
        Math.floor(topVideos.length * MAX_CATEGORY_PERCENTAGE)
    );
//=============================================================================================================//

    // Loop through candidate videos

    for (const item of topVideos) {

//=============================================================================================================//

        const creatorId = item.video.owner._id.toString();

//=============================================================================================================//

        const category = item.video.category || "uncategorized";

//=============================================================================================================//

        // Initialize creator count

        if (!creatorCount[creatorId]) 
        {
            creatorCount[creatorId] = 0;
        }

//=============================================================================================================//

        // Initialize category count

        if (!categoryCount[category]) 
        {
            categoryCount[category] = 0;
        }

//=============================================================================================================//

        // Creator Diversity Rule

        if (creatorCount[creatorId] >= maxCreatorVideos) 
        {
            continue;
        }

//=============================================================================================================//

        // Category Diversity Rule

        if (categoryCount[category] >= maxCategoryVideos) 
        {
            continue;
        }

//=============================================================================================================//

        diversifiedFeed.push(item);

//=============================================================================================================//

        creatorCount[creatorId]++;
        categoryCount[category]++;

//=============================================================================================================//

        // Stop after 100 videos

        if (diversifiedFeed.length >= MAX_FEED_SIZE) 
        {
            break;
        }

    }

//=============================================================================================================//

    return diversifiedFeed;
    

};

export {
    applyDiversityLayer
};