import { useState } from "react";
import { Link, useNavigate } from "react-router";

import useAuthStore from "../../../features/auth/useAuthStore";
import UserMenu from "./UserMenu";

import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const user = useAuthStore((state) => state.user);
  const authStatus = useAuthStore((state) => state.authStatus);

  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen((previousState) => !previousState);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          StreamTube
        </Link>
      </div>

      <div className="navbar-center">
        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search videos"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />

          <button type="submit">Search</button>
        </form>
      </div>

      <div className="navbar-right">
        {authStatus === "authenticated" && user ? (
          <>
            <button
              className="upload-button"
              onClick={() => navigate("/studio")}
            >
              Upload
            </button>

            <div className="user-menu-container">
              <button className="avatar-button" onClick={toggleUserMenu}>
                <img
                  src={user.avatar}
                  alt={user.userName}
                  className="navbar-avatar"
                />
              </button>

              {isUserMenuOpen && (
                <UserMenu
                  user={user}
                  closeMenu={() => setIsUserMenuOpen(false)}
                />
              )}
            </div>
          </>
        ) : authStatus === "unauthenticated" ? (
          <>
            <Link to="/login" className="login-link">
              Login
            </Link>

            <Link to="/register" className="register-button">
              Register
            </Link>
          </>
        ) : null}
      </div>
    </nav>
  );
}

export default Navbar;
