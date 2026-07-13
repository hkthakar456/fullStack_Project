import "./Description.css";

import { formatDate, formatViews } from "../../../utils/formatters";

function Description({ video }) {
  const formattedDate = new Date(video.createdAt).toLocaleDateString();

  return (
    <section className="description-card">
      <div className="description-meta">
        <span>{formatViews(video.views)} views</span>

        <span>•</span>

        <span>{formatDate(video.createdAt)}</span>
      </div>

      <p className="description-text">{video.description}</p>

      <button className="show-more-btn">Show more</button>
    </section>
  );
}

export default Description;
