import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

import PillButton from "../../common/PillButton/PillButton";

import "./ActionGroup.css";

function ActionGroup() {
  return (
    <div className="action-group">
      <PillButton icon={<ThumbsUp size={18} />}>Like</PillButton>

      <PillButton icon={<ThumbsDown size={18} />} />

      <PillButton icon={<Share2 size={18} />}>Share</PillButton>

      <PillButton icon={<Bookmark size={18} />}>Save</PillButton>

      <PillButton icon={<MoreHorizontal size={18} />} />
    </div>
  );
}

export default ActionGroup;
