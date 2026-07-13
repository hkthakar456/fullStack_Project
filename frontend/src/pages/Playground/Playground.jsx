import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";

import PillButton from "../../components/common/PillButton/PillButton";

import Button from "../../components/common/Button/Button";

import "./Playground.css";

function Playground() {
  return (
    <div className="playground">
      <h1>Component Playground</h1>

      <section className="playground-section">
        <h2>Buttons</h2>

        <div className="button-group">
          <Button>Subscribe</Button>

          <Button variant="secondary">Join</Button>

          <Button variant="outline">Login</Button>

          <Button variant="danger">Delete</Button>

          <PillButton icon={<ThumbsUp size={18} />}>4.6K</PillButton>

          <PillButton icon={<ThumbsDown size={18} />} />

          <PillButton icon={<Share2 size={18} />}>Share</PillButton>

          <PillButton icon={<Bookmark size={18} />}>Save</PillButton>

          <PillButton icon={<MoreHorizontal size={18} />} />
        </div>
      </section>
    </div>
  );
}

export default Playground;
