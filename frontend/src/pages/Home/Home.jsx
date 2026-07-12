import { useQuery } from "@tanstack/react-query";

import { getRecommendedVideos } from "../../features/videos/videoApi";
import VideoCard from "../../components/video/VideoCard/VideoCard";

import "./Home.css";

function Home() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["recommendedVideos"],
    queryFn: getRecommendedVideos,
  });

  if (isLoading) {
    return (
      <div className="home-status">
        Loading your feed...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="home-status home-error">
        {error.response?.data?.message ||
          "Failed to load video feed."}
      </div>
    );
  }

  const feedItems = data?.data || [];

  if (feedItems.length === 0) {
    return (
      <div className="home-status">
        No videos available yet.
      </div>
    );
  }

  return (
    <section className="home-page">
      <div className="home-header">
        <h1>Recommended</h1>
      </div>

      <div className="video-grid">
        {feedItems.map((item) => (
          <VideoCard
            key={item.video._id}
            video={item.video}
          />
        ))}
      </div>
    </section>
  );
}

export default Home;