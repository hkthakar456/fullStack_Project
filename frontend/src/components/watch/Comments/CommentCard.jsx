import "./CommentCard.css";

function CommentCard({ author, comment, likes, createdAt }) {
  return (
    <div className="comment-card">
      <img
        src="https://placehold.co/40x40"
        alt={author}
        className="comment-avatar"
      />

      <div className="comment-content">
        <div className="comment-header">
          <span className="comment-author">{author}</span>

          <span className="comment-date">{createdAt}</span>
        </div>

        <p>{comment}</p>

        <div className="comment-footer">
          👍 {likes}
          <button>Reply</button>
        </div>
      </div>
    </div>
  );
}

export default CommentCard;
