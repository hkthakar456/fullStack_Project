import { Link } from "react-router";

import { formatDuration } from "../../../utils/formatDuration";
import { formatViews } from "../../../utils/formatViews";
import { formatTimeAgo } from "../../../utils/formatTimeAgo";

import "./VideoCard.css";

function VideoCard({ video }) {
  if (!video) {
    return null;
  }

  const owner = video.owner;

  return (
    <article className="video-card">
      <Link
        to={`/watch/${video._id}`}
        className="video-thumbnail-link"
      >
        <div className="video-thumbnail-container">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="video-thumbnail"
            loading="lazy"
          />

          <span className="video-duration">
            {formatDuration(video.duration)}
          </span>
        </div>
      </Link>

      <div className="video-card-info">
        {owner && (
          <Link
            to={`/channel/${owner.userName}`}
            className="video-owner-avatar-link"
          >
            <img
              src={owner.avatar}
              alt={owner.userName}
              className="video-owner-avatar"
              loading="lazy"
            />
          </Link>
        )}

        <div className="video-card-details">
          <Link
            to={`/watch/${video._id}`}
            className="video-card-title"
          >
            {video.title}
          </Link>

          {owner && (
            <Link
              to={`/channel/${owner.userName}`}
              className="video-owner-name"
            >
              {owner.fullName}
            </Link>
          )}

          <div className="video-card-meta">
            <span>
              {formatViews(video.views)} views
            </span>

            <span>•</span>

            <span>
              {formatTimeAgo(video.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default VideoCard;