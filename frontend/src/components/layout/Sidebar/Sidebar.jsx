import { NavLink } from "react-router";

import useAuthStore from "../../../features/auth/useAuthStore";

import "./Sidebar.css";

function Sidebar() {
  const user = useAuthStore((state) => state.user);

  const authStatus = useAuthStore(
    (state) => state.authStatus
  );

  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? "sidebar-link sidebar-link-active"
      : "sidebar-link";
  };

  return (
    <aside className="sidebar">
      <nav className="sidebar-navigation">
        <div className="sidebar-section">
          <NavLink
            to="/"
            end
            className={getNavLinkClass}
          >
            Home
          </NavLink>

          <NavLink
            to="/search"
            className={getNavLinkClass}
          >
            Search
          </NavLink>
        </div>

        {authStatus === "authenticated" && user && (
          <>
            <div className="sidebar-divider" />

            <div className="sidebar-section">
              <p className="sidebar-section-title">
                You
              </p>

              <NavLink
                to="/history"
                className={getNavLinkClass}
              >
                History
              </NavLink>
            </div>

            <div className="sidebar-divider" />

            <div className="sidebar-section">
              <p className="sidebar-section-title">
                Creator
              </p>

              <NavLink
                to={`/channel/${user.userName}`}
                className={getNavLinkClass}
              >
                Your Channel
              </NavLink>

              <NavLink
                to="/studio"
                className={getNavLinkClass}
              >
                Studio
              </NavLink>
            </div>
          </>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;