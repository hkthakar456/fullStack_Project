import CommentCard from "./CommentCard";

import "./CommentList.css";

const dummyComments = [
  {
    id: 1,
    author: "Harsh",
    comment: "Amazing explanation!",
    likes: 21,
    createdAt: "2 hours ago",
  },

  {
    id: 2,
    author: "Alex",
    comment: "Waiting for next part.",
    likes: 8,
    createdAt: "Yesterday",
  },
];

function CommentList() {
  return (
    <div className="comment-list">
      {dummyComments.map((comment) => (
        <CommentCard key={comment.id} {...comment} />
      ))}
    </div>
  );
}

export default CommentList;
