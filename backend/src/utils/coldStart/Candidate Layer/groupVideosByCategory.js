//=============================================================================================================//
// Group Videos By Category
//
// Purpose:
//
// Group all video metrics
// by category.
//
// Strategy:
//
// 1. Create category map
// 2. Group videos
// 3. Return category map
//
// Rules:
//
// 1. No database query
// 2. No ranking
// 3. No scoring
// 4. No sorting
//
//=============================================================================================================//

export const groupVideosByCategory = (videoMetrics) => {
    // Steps (Algorithm)

    // 1. Create category map
    // 2. Group videos
    // 3. Return category map

    //=========================================================================================================//

    // 1. Create Category Map

    const categoryMap = {};

    //=========================================================================================================//

    // 2. Group Videos

    videoMetrics.forEach((video) => {
        const category = video.category.toLowerCase();

        if (!categoryMap[category]) {
            categoryMap[category] = [];
        }

        categoryMap[category].push(video);
    });

    //=========================================================================================================//

    // 3. Return Category Map

    return categoryMap;
};
