import ChannelCard from "../ChannelCard/ChannelCard";
import ActionGroup from "../ActionGroup/ActionGroup";

import "./VideoHeader.css";

function VideoHeader({ video }) {
  return (
    <section className="video-header">

      <ChannelCard owner={video.owner} />

      <ActionGroup />
      
    </section>
  );
}

export default VideoHeader;
