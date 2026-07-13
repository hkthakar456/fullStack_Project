import Button from "../../common/Button/Button";

import "./CommentInput.css";

function CommentInput() {
  return (
    <div className="comment-input">
      <img
        src="https://placehold.co/40x40"
        alt="User"
        className="comment-avatar"
      />

      <div className="comment-input-wrapper">
        <input type="text" placeholder="Add a comment..." />

        <div className="comment-actions">
          <Button variant="secondary">Cancel</Button>

          <Button>Comment</Button>
        </div>
      </div>
    </div>
  );
}

export default CommentInput;
