import { Navigate, Outlet } from "react-router";
import useAuthStore from "../features/auth/useAuthStore";

function GuestRoute() {
  const authStatus = useAuthStore(
    (state) => state.authStatus
  );

  if (authStatus === "loading") {
    return <div>Loading...</div>;
  }

  if (authStatus === "authenticated") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;