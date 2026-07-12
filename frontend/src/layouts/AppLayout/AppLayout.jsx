import { Outlet } from "react-router";

import Navbar from "../../components/layout/Navbar/Navbar";
import Sidebar from "../../components/layout/Sidebar/Sidebar";

import "./AppLayout.css";

function AppLayout() {
  return (
    <div className="app-layout">
      <Navbar />

      <div className="app-layout-body">
        <Sidebar />

        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;