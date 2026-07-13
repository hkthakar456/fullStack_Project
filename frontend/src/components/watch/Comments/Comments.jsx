import CommentInput from "./CommentInput";
import CommentList from "./CommentList";

import "./Comments.css";

function Comments() {
  return (
    <section className="comments">
      <h2>2 Comments</h2>

      <CommentInput />

      <CommentList />
    </section>
  );
}

export default Comments;
