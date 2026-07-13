import "./VideoPlayer.css";

function VideoPlayer({ video }) {
  return (
    <section className="video-player">

      <video
        className="video-element"
        controls
        preload="metadata"
        poster={video.thumbnail}
      >
        <source src={video.videoFile} type="video/mp4" />
        
        Your browser does not support HTML5 video.

      </video>
      
    </section>
  );
}

export default VideoPlayer;
