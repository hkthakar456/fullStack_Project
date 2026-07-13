import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { getVideoById } from "../../features/videos/videoApi";

import VideoPlayer from "../../components/watch/VideoPlayer/VideoPlayer";
import VideoTitle from "../../components/watch/VideoTitle/VideoTitle";
import VideoHeader from "../../components/watch/VideoHeader/VideoHeader";
import Description from "../../components/watch/Description/Description";
import Comments from "../../components/watch/Comments/Comments";

import "./Watch.css";

function Watch() {

    const { videoId } = useParams();

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({

        queryKey: ["video", videoId],

        queryFn: () => getVideoById(videoId),

    });

    if (isLoading) {
        return <h2>Loading...</h2>;
    }

    if (isError) {
        return (
            <h2>
                {
                    error.response?.data?.message ||
                    "Something went wrong"
                }
            </h2>
        );
    }

    const video = data.data;

    return (

        <div className="watch-page">

            <VideoPlayer video={video} />

            <VideoTitle title={video.title} />

            <VideoHeader video={video} />

            <Description video={video} />

            <Comments videoId={video._id} />

        </div>

    );

}

export default Watch;