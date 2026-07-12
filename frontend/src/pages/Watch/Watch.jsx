import VideoPlayer from "../../components/watch/VideoPlayer/VideoPlayer";
import VideoInfo from "../../components/watch/VideoInfo/VideoInfo";
import ChannelCard from "../../components/watch/ChannelCard/ChannelCard";
import Description from "../../components/watch/Description/Description";
import Comments from "../../components/watch/Comments/Comments";

import "./Watch.css";

function Watch() {
    return (
        <div className="watch-page">

            <VideoPlayer />

            <VideoInfo />

            <ChannelCard />

            <Description />

            <Comments />

        </div>
    );
}

export default Watch;