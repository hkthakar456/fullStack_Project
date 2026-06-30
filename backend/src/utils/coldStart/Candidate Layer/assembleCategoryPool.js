//=============================================================================================================//
// Assemble Category Pool
//
// Purpose:
//
// Assemble all category
// candidate pools into one
// balanced category pool.
//
// Strategy:
//
// 1. Get category names
// 2. Find maximum category size
// 3. Merge using round robin
// 4. Return category pool
//
// Rules:
//
// 1. No database query
// 2. No ranking
// 3. No scoring
// 4. No shuffling
// 5. No duplicate removal
//
//=============================================================================================================//

export const assembleCategoryPool = (categoryCandidates) => {
    // Steps (Algorithm)

    // 1. Get category names
    // 2. Find maximum category size
    // 3. Merge category pools
    // 4. Return category pool
    
    //=========================================================================================================//

    // 1. Get Category Names

    const categories = Object.keys(categoryCandidates);

    //=========================================================================================================//

    // 2. Find Maximum Category Size

    const maxCategorySize = Math.max(
        ...Object.values(categoryCandidates)

            .map((videos) => videos.length)
    );

    //=========================================================================================================//

    // 3. Merge Category Pools

    const categoryPool = [];

    for (let index = 0; index < maxCategorySize; index++) {
        categories.forEach((category) => {
            const video = categoryCandidates[category][index];

            if (video) {
                categoryPool.push(video);
            }
        });
    }

    //=========================================================================================================//

    // 4. Return Category Pool

    return categoryPool;
};
