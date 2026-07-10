import { Outlet } from "react-router";
import "./AppLayout.css";

function AppLayout() {
  return (
    <div className="app-layout">
      <header className="app-navbar">
        Navbar
      </header>

      <div className="app-layout-body">
        <aside className="app-sidebar">
          Sidebar
        </aside>

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;