import { Outlet } from "react-router";
import "./WatchLayout.css";

function WatchLayout() {
  return (
    <div className="watch-layout">
      <header className="watch-navbar">
        Navbar
      </header>

      <main className="watch-content">
        <Outlet />
      </main>
    </div>
  );
}

export default WatchLayout;