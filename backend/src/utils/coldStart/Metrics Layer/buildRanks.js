//=============================================================================================================//
// Build Ranks
//
// Purpose:
//
// Build multiple metric rankings
// for a collection of videos.
//
// Strategy:
//
// 1. Validate ranking configuration
// 2. Clone video metrics
// 3. Build each metric rank
// 4. Return ranked videos
//
// Rules:
//
// 1. Support multiple metrics
// 2. Support ascending & descending sorting
// 3. Preserve existing object
// 4. Add rank properties dynamically
//
//=============================================================================================================//

export const buildRanks = (videoMetrics, rankingConfig) => {
    // Steps (Algorithm)

    // 1. Validate ranking configuration
    // 2. Clone video metrics
    // 3. Create lookup map
    // 4. Build each metric rank
    // 5. Return ranked videos

    //=========================================================================================================//

    // 1. Validate Ranking Configuration

    if (!Array.isArray(videoMetrics)) {
        throw new Error("videoMetrics must be an array");
    }

    if (!Array.isArray(rankingConfig)) {
        throw new Error("rankingConfig must be an array");
    }

    //=========================================================================================================//

    // 2. Clone Video Metrics

    const rankedVideos = videoMetrics.map((item) => ({ ...item }));

    //=========================================================================================================//

    // 3. Create lookup map

    const videoMap = new Map();

    rankedVideos.forEach((item) => {
        videoMap.set(item.video._id.toString(), item);
    });

    //=========================================================================================================//

    // 4. Build Each Metric Rank

    rankingConfig.forEach(({ metric, rankProperty, order = "desc" }) => {
        if (!rankedVideos.every((item) => metric in item)) {
            throw new Error(`Invalid metric: ${metric}`);
        }

        if (!["asc", "desc"].includes(order)) {
            throw new Error(`Invalid order: ${order}`);
        }

        //=================================================================================================//

        // Sort Current Metric

        const sortedVideos = [...rankedVideos];

        sortedVideos.sort((a, b) =>
            order === "asc" ? a[metric] - b[metric] : b[metric] - a[metric]
        );

        //=================================================================================================//

        // Assign Percentile Rank

        const totalVideos = sortedVideos.length;

        sortedVideos.forEach((video, index) => {
            const percentileRank =
                totalVideos === 1
                    ? 100
                    : Number(
                          (100 - (index / (totalVideos - 1)) * 100).toFixed(2)
                      );

            const originalVideo = videoMap.get(video.videoId);

            originalVideo[rankProperty] = percentileRank;
        });
    });

    //=========================================================================================================//

    // 5. Return Ranked Videos

    return rankedVideos;
};;
