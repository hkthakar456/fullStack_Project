import { Outlet } from "react-router";
import Navbar from "../../components/layout/Navbar/Navbar";

import "./WatchLayout.css";

function WatchLayout() {
  return (
    <>
      <Navbar />

      <main className="watch-layout">
        <section className="watch-main">
          <Outlet />
        </section>

        <aside className="watch-sidebar">
          Recommendation Sidebar
        </aside>
      </main>
    </>
  );
}

export default WatchLayout;