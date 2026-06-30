//=============================================================================================================//
// Build Search Click Profile
//
// Purpose:
//
// Convert search click history
// into recommendation signals.
//
//=============================================================================================================//

export const buildSearchClickProfile = (searchClickHistory) => {
    // Steps (Algorithm)

    // 1. Create score objects
    // 2. Process search click history
    // 3. Calculate category scores
    // 4. Calculate tag scores
    // 5. Calculate creator scores
    // 6. Normalize scores
    // 7. Return profile

    //=========================================================================================================//

    // 1. Create score objects

    const tagScores = {};

    const categoryScores = {};

    const creatorScores = {};

    //=========================================================================================================//

    // 2. Process search click history

    searchClickHistory.forEach((click) => {

        // 3. Calculate Category Scores

        const category = click.category?.toLowerCase();

        if (category) {
            categoryScores[category] = (categoryScores[category] || 0) + 1;
        }

        //=====================================================================================================//

        // 4. Calculate Tag Scores

        click.tags?.forEach((tag) => {
            tag = tag.toLowerCase();

            tagScores[tag] = (tagScores[tag] || 0) + 1;
        });

        //=====================================================================================================//

        // 5. Calculate Creator Scores

        const creatorId = click.creator?.toString();

        if (creatorId) {
            creatorScores[creatorId] = (creatorScores[creatorId] || 0) + 1;
        }
    });

    //=========================================================================================================//

    // 6. Normalize all scores


    // Normalize Category Scores

    const maxCategoryScore = Math.max(...Object.values(categoryScores), 1);

    Object.keys(categoryScores).forEach((category) => {
        categoryScores[category] = Math.round(
            (categoryScores[category] / maxCategoryScore) * 100
        );
    });

    

    // Normalize Tag Scores

    const maxTagScore = Math.max(...Object.values(tagScores), 1);

    Object.keys(tagScores).forEach((tag) => {
        tagScores[tag] = Math.round((tagScores[tag] / maxTagScore) * 100);
    });

    

    // Normalize Creator Scores

    const maxCreatorScore = Math.max(...Object.values(creatorScores), 1);

    Object.keys(creatorScores).forEach((creatorId) => {
        creatorScores[creatorId] = Math.round(
            (creatorScores[creatorId] / maxCreatorScore) * 100
        );
    });

    //=========================================================================================================//

    // 7. Return Profile

    return {
        tagScores,
        categoryScores,
        creatorScores,
    };
};
