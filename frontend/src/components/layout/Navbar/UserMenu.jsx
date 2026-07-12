import { Link } from "react-router";

import LogoutButton from "../../common/LogoutButton/LogoutButton";

function UserMenu({ user, closeMenu }) {
  return (
    <div className="user-menu">
      <div className="user-menu-header">
        <img
          src={user.avatar}
          alt={user.userName}
          className="user-menu-avatar"
        />

        <div>
          <p className="user-menu-name">{user.fullName}</p>

          <p className="user-menu-username">@{user.userName}</p>
        </div>
      </div>

      <div className="user-menu-divider" />

      <Link
        to={`/channel/${user.userName}`}
        className="user-menu-item"
        onClick={closeMenu}
      >
        Your Channel
      </Link>

      <Link to="/studio" className="user-menu-item" onClick={closeMenu}>
        Creator Studio
      </Link>

      <Link to="/history" className="user-menu-item" onClick={closeMenu}>
        Watch History
      </Link>

      <div className="user-menu-divider" />

      <LogoutButton />
    </div>
  );
}

export default UserMenu;
